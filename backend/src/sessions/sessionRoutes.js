const express = require('express');
const {
  bookSession,
  rescheduleSession,
  cancelSession,
  getStudentSessions,
  getTutorSessions,
  getOrCreateMeeting,
} = require('./sessionController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/book')
  .post(protect, authorize('Student'), bookSession);

router.put('/:id/reschedule', protect, rescheduleSession);
router.delete('/:id', protect, cancelSession);
router.get('/:id/meeting', protect, getOrCreateMeeting);

router.route('/student/:id')
  .get(protect, getStudentSessions);

router.route('/tutor/:id')
  .get(protect, getTutorSessions);

module.exports = router;
