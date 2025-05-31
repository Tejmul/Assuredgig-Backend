const express = require('express');
const router = express.Router();
const { Portfolio } = require('../models');
const { auth } = require('../middleware/auth.middleware');
const { validatePortfolio } = require('../middleware/validation.middleware');

// Get all portfolio items for a freelancer
router.get('/', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findAll({
      where: { freelancerId: req.user.id }
    });
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new portfolio item
router.post('/', auth, validatePortfolio, async (req, res) => {
  try {
    const portfolio = await Portfolio.create({
      ...req.body,
      freelancerId: req.user.id
    });
    res.status(201).json(portfolio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a portfolio item
router.put('/:id', auth, validatePortfolio, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      where: { id: req.params.id, freelancerId: req.user.id }
    });

    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio item not found' });
    }

    await portfolio.update(req.body);
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a portfolio item
router.delete('/:id', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      where: { id: req.params.id, freelancerId: req.user.id }
    });

    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio item not found' });
    }

    await portfolio.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 