const { body, validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Portfolio validation
const validatePortfolio = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').optional().isISO8601().withMessage('Valid end date is required'),
  body('technologies').isArray().withMessage('Technologies must be an array'),
  validate
];

// Contract validation
const validateContract = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
  body('totalAmount').isNumeric().withMessage('Valid amount is required'),
  body('milestones').isArray().withMessage('Milestones must be an array'),
  body('paymentSchedule').isArray().withMessage('Payment schedule must be an array'),
  validate
];

// Meeting validation
const validateMeeting = [
  body('title').notEmpty().withMessage('Title is required'),
  body('startTime').isISO8601().withMessage('Valid start time is required'),
  body('endTime').isISO8601().withMessage('Valid end time is required'),
  body('meetingType').isIn(['zoom', 'google_meet', 'other']).withMessage('Valid meeting type is required'),
  body('meetingLink').notEmpty().withMessage('Meeting link is required'),
  body('participantId').isUUID().withMessage('Valid participant ID is required'),
  validate
];

// Work Progress validation
const validateWorkProgress = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('progressPercentage')
    .isInt({ min: 0, max: 100 })
    .withMessage('Progress percentage must be between 0 and 100'),
  body('status')
    .isIn(['in_progress', 'completed', 'blocked'])
    .withMessage('Valid status is required'),
  body('contractId').isUUID().withMessage('Valid contract ID is required'),
  validate
];

module.exports = {
  validatePortfolio,
  validateContract,
  validateMeeting,
  validateWorkProgress
}; 