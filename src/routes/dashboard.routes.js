const express = require('express');
const { Job, Application, User } = require('../models');
const { auth, checkRole } = require('../middleware/auth.middleware');
const { Op } = require('sequelize');

const router = express.Router();

// Client dashboard
router.get('/client', auth, checkRole(['client']), async (req, res) => {
  try {
    // Get posted jobs with their applications
    const postedJobs = await Job.findAll({
      where: { clientId: req.user.id },
      include: [
        {
          model: Application,
          as: 'applications',
          include: [
            {
              model: User,
              as: 'freelancer',
              attributes: ['id', 'fullName', 'email']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Get statistics
    const stats = {
      totalJobs: postedJobs.length,
      openJobs: postedJobs.filter(job => job.status === 'open').length,
      inProgressJobs: postedJobs.filter(job => job.status === 'in_progress').length,
      completedJobs: postedJobs.filter(job => job.status === 'completed').length,
      totalApplications: postedJobs.reduce((acc, job) => acc + job.applications.length, 0)
    };

    res.json({
      stats,
      jobs: postedJobs
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching client dashboard', error: error.message });
  }
});

// Freelancer dashboard
router.get('/freelancer', auth, checkRole(['freelancer']), async (req, res) => {
  try {
    // Get applications with their jobs
    const applications = await Application.findAll({
      where: { freelancerId: req.user.id },
      include: [
        {
          model: Job,
          as: 'job',
          include: [
            {
              model: User,
              as: 'client',
              attributes: ['id', 'fullName', 'email']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Get statistics
    const stats = {
      totalApplications: applications.length,
      pendingApplications: applications.filter(app => app.status === 'pending').length,
      hiredApplications: applications.filter(app => app.status === 'hired').length,
      rejectedApplications: applications.filter(app => app.status === 'rejected').length,
      activeJobs: applications.filter(app => 
        app.status === 'hired' && 
        ['hired', 'in_progress'].includes(app.job.status)
      ).length
    };

    res.json({
      stats,
      applications
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching freelancer dashboard', error: error.message });
  }
});

// Get dashboard stats
router.get('/stats', auth, async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Get user's role-specific stats
    const stats = {
      totalJobs: 0,
      activeContracts: 0,
      completedContracts: 0,
      totalEarnings: 0,
      recentActivity: [],
      todayStats: {
        hoursWorked: 0,
        messagesReceived: 0,
        messagesSent: 0,
        meetingsScheduled: 0
      }
    };

    if (req.user.role === 'client') {
      // Client-specific stats
      stats.totalJobs = await Job.count({
        where: { clientId: req.user.id }
      });

      stats.activeContracts = await Contract.count({
        where: {
          clientId: req.user.id,
          status: 'active'
        }
      });

      stats.completedContracts = await Contract.count({
        where: {
          clientId: req.user.id,
          status: 'completed'
        }
      });

      // Today's stats
      stats.todayStats.meetingsScheduled = await Meeting.count({
        where: {
          contractId: {
            [Op.in]: await Contract.findAll({
              where: { clientId: req.user.id },
              attributes: ['id']
            }).then(contracts => contracts.map(c => c.id))
          },
          startTime: {
            [Op.between]: [startOfDay, endOfDay]
          }
        }
      });

      stats.todayStats.messagesReceived = await Chat.count({
        where: {
          contractId: {
            [Op.in]: await Contract.findAll({
              where: { clientId: req.user.id },
              attributes: ['id']
            }).then(contracts => contracts.map(c => c.id))
          },
          senderId: { [Op.ne]: req.user.id },
          createdAt: {
            [Op.between]: [startOfDay, endOfDay]
          }
        }
      });
    } else {
      // Freelancer-specific stats
      stats.activeContracts = await Contract.count({
        where: {
          freelancerId: req.user.id,
          status: 'active'
        }
      });

      stats.completedContracts = await Contract.count({
        where: {
          freelancerId: req.user.id,
          status: 'completed'
        }
      });

      // Calculate total earnings
      const completedContracts = await Contract.findAll({
        where: {
          freelancerId: req.user.id,
          status: 'completed'
        },
        attributes: ['totalAmount']
      });

      stats.totalEarnings = completedContracts.reduce((sum, contract) => sum + parseFloat(contract.totalAmount), 0);

      // Today's stats
      const todayWork = await WorkProgress.findOne({
        where: {
          contractId: {
            [Op.in]: await Contract.findAll({
              where: { freelancerId: req.user.id },
              attributes: ['id']
            }).then(contracts => contracts.map(c => c.id))
          },
          date: startOfDay
        },
        attributes: ['hoursWorked']
      });

      stats.todayStats.hoursWorked = todayWork ? todayWork.hoursWorked : 0;

      stats.todayStats.messagesSent = await Chat.count({
        where: {
          contractId: {
            [Op.in]: await Contract.findAll({
              where: { freelancerId: req.user.id },
              attributes: ['id']
            }).then(contracts => contracts.map(c => c.id))
          },
          senderId: req.user.id,
          createdAt: {
            [Op.between]: [startOfDay, endOfDay]
          }
        }
      });

      stats.todayStats.meetingsScheduled = await Meeting.count({
        where: {
          contractId: {
            [Op.in]: await Contract.findAll({
              where: { freelancerId: req.user.id },
              attributes: ['id']
            }).then(contracts => contracts.map(c => c.id))
          },
          startTime: {
            [Op.between]: [startOfDay, endOfDay]
          }
        }
      });
    }

    // Get recent activity
    const recentActivity = await Promise.all([
      // Recent jobs
      Job.findAll({
        where: req.user.role === 'client' ? { clientId: req.user.id } : {},
        limit: 5,
        order: [['createdAt', 'DESC']],
        include: [{
          model: User,
          as: 'client',
          attributes: ['id', 'fullName', 'profilePicture']
        }]
      }),
      // Recent applications
      Application.findAll({
        where: req.user.role === 'freelancer' ? { freelancerId: req.user.id } : {},
        limit: 5,
        order: [['createdAt', 'DESC']],
        include: [{
          model: Job,
          include: [{
            model: User,
            as: 'client',
            attributes: ['id', 'fullName', 'profilePicture']
          }]
        }]
      }),
      // Recent contracts
      Contract.findAll({
        where: {
          [req.user.role === 'client' ? 'clientId' : 'freelancerId']: req.user.id
        },
        limit: 5,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: User,
            as: 'client',
            attributes: ['id', 'fullName', 'profilePicture']
          },
          {
            model: User,
            as: 'freelancer',
            attributes: ['id', 'fullName', 'profilePicture']
          }
        ]
      }),
      // Recent work progress
      WorkProgress.findAll({
        where: {
          contractId: {
            [Op.in]: await Contract.findAll({
              where: {
                [req.user.role === 'client' ? 'clientId' : 'freelancerId']: req.user.id
              },
              attributes: ['id']
            }).then(contracts => contracts.map(c => c.id))
          }
        },
        limit: 5,
        order: [['createdAt', 'DESC']],
        include: [{
          model: Contract,
          include: [
            {
              model: User,
              as: 'client',
              attributes: ['id', 'fullName', 'profilePicture']
            },
            {
              model: User,
              as: 'freelancer',
              attributes: ['id', 'fullName', 'profilePicture']
            }
          ]
        }]
      })
    ]);

    stats.recentActivity = [
      ...recentActivity[0].map(job => ({
        type: 'job',
        data: job,
        createdAt: job.createdAt
      })),
      ...recentActivity[1].map(application => ({
        type: 'application',
        data: application,
        createdAt: application.createdAt
      })),
      ...recentActivity[2].map(contract => ({
        type: 'contract',
        data: contract,
        createdAt: contract.createdAt
      })),
      ...recentActivity[3].map(progress => ({
        type: 'work_progress',
        data: progress,
        createdAt: progress.createdAt
      }))
    ].sort((a, b) => b.createdAt - a.createdAt).slice(0, 10);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 