const express = require('express');
const { addAvailability, getTutorAvailability } = require('./availabilityController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .post(protect, authorize('Tutor'), addAvailability);

router.route('/:tutorId')
  .get(getTutorAvailability);

module.exports = router;
