const express = require('express');
const router = express.Router();
const { Chat, Contract, User } = require('../models');
const { auth } = require('../middleware/auth.middleware');

// Get chat messages for a contract
router.get('/contract/:contractId', auth, async (req, res) => {
  try {
    const contract = await Contract.findOne({
      where: { id: req.params.contractId }
    });

    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    // Check if user is part of the contract
    if (contract.clientId !== req.user.id && contract.freelancerId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to view these messages' });
    }

    const messages = await Chat.findAll({
      where: { contractId: req.params.contractId },
      include: [{
        model: User,
        as: 'sender',
        attributes: ['id', 'fullName', 'profilePicture']
      }],
      order: [['createdAt', 'ASC']]
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send a message
router.post('/contract/:contractId', auth, async (req, res) => {
  try {
    const contract = await Contract.findOne({
      where: { id: req.params.contractId }
    });

    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    // Check if user is part of the contract
    if (contract.clientId !== req.user.id && contract.freelancerId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to send messages' });
    }

    const message = await Chat.create({
      contractId: req.params.contractId,
      senderId: req.user.id,
      message: req.body.message,
      attachments: req.body.attachments || []
    });

    const messageWithSender = await Chat.findOne({
      where: { id: message.id },
      include: [{
        model: User,
        as: 'sender',
        attributes: ['id', 'fullName', 'profilePicture']
      }]
    });

    res.status(201).json(messageWithSender);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark messages as read
router.patch('/contract/:contractId/read', auth, async (req, res) => {
  try {
    const contract = await Contract.findOne({
      where: { id: req.params.contractId }
    });

    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    // Check if user is part of the contract
    if (contract.clientId !== req.user.id && contract.freelancerId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to mark messages as read' });
    }

    await Chat.update(
      {
        isRead: true,
        readAt: new Date()
      },
      {
        where: {
          contractId: req.params.contractId,
          senderId: { [Op.ne]: req.user.id },
          isRead: false
        }
      }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 