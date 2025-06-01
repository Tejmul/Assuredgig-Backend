const express = require('express');
const { body, validationResult } = require('express-validator');
const { Job, User, Application } = require('../models');
const { auth, checkRole } = require('../middleware/auth.middleware');
const NotificationService = require('../services/notification.service');

const router = express.Router();

// Job validation
const jobValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('budget').isNumeric().withMessage('Budget must be a number'),
  body('deadline').isISO8601().withMessage('Invalid deadline date'),
  body('skills').optional().isArray().withMessage('Skills must be an array')
];

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.findAll({
      where: { status: 'open' },
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['id', 'fullName', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs', error: error.message });
  }
});

// Create job (client only)
router.post('/', auth, checkRole(['client']), jobValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const job = await Job.create({
      ...req.body,
      clientId: req.user.id
    });

    // Notify matching freelancers
    await NotificationService.notifyMatchingFreelancers(job);

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get job details
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['id', 'fullName', 'email']
        },
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
      ]
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching job', error: error.message });
  }
});

// Update job (client only)
router.put('/:id', auth, checkRole(['client']), jobValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const job = await Job.findByPk(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.clientId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    await job.update(req.body);
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error updating job', error: error.message });
  }
});

// Delete job (client only)
router.delete('/:id', auth, checkRole(['client']), async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.clientId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await job.destroy();
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting job', error: error.message });
  }
});

module.exports = router; 