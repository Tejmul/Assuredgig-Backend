const express = require('express');
const router = express.Router();
const { Meeting, Contract, User } = require('../models');
const { auth } = require('../middleware/auth.middleware');
const { validateMeeting } = require('../middleware/validation.middleware');

// Get all meetings for the current user
router.get('/', auth, async (req, res) => {
  try {
    const meetings = await Meeting.findAll({
      where: {
        [req.user.role === 'client' ? 'organizerId' : 'participantId']: req.user.id
      },
      include: [
        {
          model: User,
          as: 'organizer',
          attributes: ['id', 'fullName', 'email', 'profilePicture']
        },
        {
          model: User,
          as: 'participant',
          attributes: ['id', 'fullName', 'email', 'profilePicture']
        },
        {
          model: Contract,
          as: 'contract',
          attributes: ['id', 'title']
        }
      ],
      order: [['startTime', 'DESC']]
    });
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Schedule a new meeting
router.post('/', auth, validateMeeting, async (req, res) => {
  try {
    const meeting = await Meeting.create({
      ...req.body,
      organizerId: req.user.id
    });
    res.status(201).json(meeting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update meeting status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const meeting = await Meeting.findOne({
      where: { id: req.params.id }
    });

    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    // Only organizer or participant can update status
    if (meeting.organizerId !== req.user.id && meeting.participantId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this meeting' });
    }

    await meeting.update({ status: req.body.status });
    res.json(meeting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get meeting details
router.get('/:id', auth, async (req, res) => {
  try {
    const meeting = await Meeting.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: User,
          as: 'organizer',
          attributes: ['id', 'fullName', 'email', 'profilePicture']
        },
        {
          model: User,
          as: 'participant',
          attributes: ['id', 'fullName', 'email', 'profilePicture']
        },
        {
          model: Contract,
          as: 'contract',
          attributes: ['id', 'title']
        }
      ]
    });

    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    // Check if user is authorized to view this meeting
    if (meeting.organizerId !== req.user.id && meeting.participantId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to view this meeting' });
    }

    res.json(meeting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 