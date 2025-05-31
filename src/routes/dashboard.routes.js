const express = require('express');
const { Job, Application, User } = require('../models');
const { auth, checkRole } = require('../middleware/auth.middleware');

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

module.exports = router; 