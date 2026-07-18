const express = require('express');
const {
  bookSession,
  rescheduleSession,
  cancelSession,
  getStudentSessions,
  getTutorSessions
} = require('./sessionController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/book')
  .post(protect, authorize('Student'), bookSession);

router.route('/:id/reschedule')
  .put(protect, rescheduleSession);

router.route('/:id')
  .delete(protect, cancelSession);

router.route('/student/:id')
  .get(protect, getStudentSessions);

router.route('/tutor/:id')
  .get(protect, getTutorSessions);

module.exports = router;
