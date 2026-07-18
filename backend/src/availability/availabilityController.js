const Availability = require('./Availability');

/**
 * @swagger
 * /availability:
 *   post:
 *     summary: Add availability slot for the logged-in tutor
 *     tags: [Availability]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dayOfWeek
 *               - startTime
 *               - endTime
 *             properties:
 *               dayOfWeek:
 *                 type: string
 *                 example: Monday
 *               startTime:
 *                 type: string
 *                 example: "09:00"
 *               endTime:
 *                 type: string
 *                 example: "17:00"
 *     responses:
 *       201:
 *         description: Availability added successfully
 */
exports.addAvailability = async (req, res, next) => {
  try {
    const { dayOfWeek, startTime, endTime } = req.body;
    
    if (startTime >= endTime) {
      return res.status(400).json({ success: false, message: 'End time must be after start time' });
    }

    const availability = await Availability.create({
      tutor: req.user._id,
      dayOfWeek,
      startTime,
      endTime
    });
    
    res.status(201).json({
      success: true,
      data: availability
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'This availability slot already exists' });
    }
    next(error);
  }
};

/**
 * @swagger
 * /availability/{tutorId}:
 *   get:
 *     summary: Get a tutor's availability
 *     tags: [Availability]
 *     parameters:
 *       - in: path
 *         name: tutorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of availability slots
 */
exports.getTutorAvailability = async (req, res, next) => {
  try {
    const availability = await Availability.find({ tutor: req.params.tutorId });
    
    res.status(200).json({
      success: true,
      count: availability.length,
      data: availability
    });
  } catch (error) {
    next(error);
  }
};
