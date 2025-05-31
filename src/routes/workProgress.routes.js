const express = require('express');
const router = express.Router();
const { WorkProgress, Contract, User } = require('../models');
const { auth } = require('../middleware/auth.middleware');
const { validateWorkProgress } = require('../middleware/validation.middleware');

// Get all work progress updates for a contract
router.get('/contract/:contractId', auth, async (req, res) => {
  try {
    const contract = await Contract.findOne({
      where: { id: req.params.contractId }
    });

    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    // Check if user is authorized to view this contract's progress
    if (contract.clientId !== req.user.id && contract.freelancerId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to view this contract' });
    }

    const progress = await WorkProgress.findAll({
      where: { contractId: req.params.contractId },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'freelancer',
          attributes: ['id', 'fullName', 'profilePicture']
        }
      ]
    });

    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new work progress update
router.post('/', auth, validateWorkProgress, async (req, res) => {
  try {
    const contract = await Contract.findOne({
      where: { id: req.body.contractId }
    });

    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    // Only the freelancer assigned to the contract can create progress updates
    if (contract.freelancerId !== req.user.id) {
      return res.status(403).json({ error: 'Only the assigned freelancer can create progress updates' });
    }

    const progress = await WorkProgress.create({
      ...req.body,
      freelancerId: req.user.id
    });

    res.status(201).json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update work progress
router.put('/:id', auth, validateWorkProgress, async (req, res) => {
  try {
    const progress = await WorkProgress.findOne({
      where: { id: req.params.id }
    });

    if (!progress) {
      return res.status(404).json({ error: 'Work progress not found' });
    }

    // Only the freelancer who created the progress can update it
    if (progress.freelancerId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this progress' });
    }

    await progress.update(req.body);
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add comment to work progress
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const progress = await WorkProgress.findOne({
      where: { id: req.params.id }
    });

    if (!progress) {
      return res.status(404).json({ error: 'Work progress not found' });
    }

    const contract = await Contract.findOne({
      where: { id: progress.contractId }
    });

    // Only client or freelancer involved in the contract can comment
    if (contract.clientId !== req.user.id && contract.freelancerId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to comment on this progress' });
    }

    const comments = progress.comments || [];
    comments.push({
      userId: req.user.id,
      userName: req.user.fullName,
      comment: req.body.comment,
      timestamp: new Date()
    });

    await progress.update({ comments });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 