const express = require('express');
const router = express.Router();
const { Contract, User, Job, WorkProgress } = require('../models');
const { auth } = require('../middleware/auth.middleware');
const { validateContract } = require('../middleware/validation.middleware');

// Get all contracts for the current user
router.get('/', auth, async (req, res) => {
  try {
    const contracts = await Contract.findAll({
      where: {
        [req.user.role === 'client' ? 'clientId' : 'freelancerId']: req.user.id
      },
      include: [
        {
          model: User,
          as: req.user.role === 'client' ? 'freelancer' : 'client',
          attributes: ['id', 'fullName', 'email', 'profilePicture']
        },
        {
          model: Job,
          as: 'job',
          attributes: ['id', 'title', 'description']
        }
      ]
    });
    res.json(contracts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new contract
router.post('/', auth, validateContract, async (req, res) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({ error: 'Only clients can create contracts' });
    }

    const contract = await Contract.create({
      ...req.body,
      clientId: req.user.id
    });
    res.status(201).json(contract);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update contract status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const contract = await Contract.findOne({
      where: { id: req.params.id }
    });

    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    // Only client or freelancer involved in the contract can update status
    if (contract.clientId !== req.user.id && contract.freelancerId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this contract' });
    }

    await contract.update({ status: req.body.status });
    res.json(contract);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get contract details with work progress
router.get('/:id', auth, async (req, res) => {
  try {
    const contract = await Contract.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['id', 'fullName', 'email', 'profilePicture']
        },
        {
          model: User,
          as: 'freelancer',
          attributes: ['id', 'fullName', 'email', 'profilePicture']
        },
        {
          model: Job,
          as: 'job',
          attributes: ['id', 'title', 'description']
        },
        {
          model: WorkProgress,
          as: 'workProgress',
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    // Check if user is authorized to view this contract
    if (contract.clientId !== req.user.id && contract.freelancerId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to view this contract' });
    }

    res.json(contract);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 