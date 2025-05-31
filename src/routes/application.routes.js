const express = require('express');
const { body, validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { Job, Application, User } = require('../models');
const { auth, checkRole } = require('../middleware/auth.middleware');

const router = express.Router();

// Application validation
const applicationValidation = [
  body('proposal').notEmpty().withMessage('Proposal is required'),
  body('expectedDeliveryDate').isISO8601().withMessage('Invalid delivery date'),
  body('bidAmount').isNumeric().withMessage('Bid amount must be a number')
];

// Apply to a job (freelancer only)
router.post('/jobs/:jobId/apply', auth, checkRole(['freelancer']), applicationValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const job = await Job.findByPk(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.status !== 'open') {
      return res.status(400).json({ message: 'This job is no longer accepting applications' });
    }

    // Check if freelancer has already applied
    const existingApplication = await Application.findOne({
      where: {
        jobId: job.id,
        freelancerId: req.user.id
      }
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }

    const application = await Application.create({
      ...req.body,
      jobId: job.id,
      freelancerId: req.user.id
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting application', error: error.message });
  }
});

// Get applications for a job (client only)
router.get('/jobs/:jobId/applications', auth, checkRole(['client']), async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.clientId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view these applications' });
    }

    const applications = await Application.findAll({
      where: { jobId: job.id },
      include: [
        {
          model: User,
          as: 'freelancer',
          attributes: ['id', 'fullName', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
});

// Update application status (client only)
router.put('/:id/status', auth, checkRole(['client']), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'hired', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const application = await Application.findByPk(req.params.id, {
      include: [{ model: Job, as: 'job' }]
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.job.clientId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    // If hiring a freelancer, update job status and reject other applications
    if (status === 'hired') {
      await application.job.update({ status: 'hired' });
      await Application.update(
        { status: 'rejected' },
        {
          where: {
            jobId: application.jobId,
            id: { [Op.ne]: application.id }
          }
        }
      );
    }

    await application.update({ status });
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Error updating application', error: error.message });
  }
});

// Get freelancer's applications
router.get('/my-applications', auth, checkRole(['freelancer']), async (req, res) => {
  try {
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

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
});

module.exports = router; 