const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { validateId } = require('../middleware/validation');
const {
  getCourses,
  getCourseById,
  updateCourseProgress,
  getDiplomas,
  getDiplomaById,
  enrollDiploma,
  getUserCourses,
  getUserDiplomas,
} = require('../controllers/educationController');

router.use(verifyToken);

router.get('/courses', getCourses);
router.get('/courses/:id', validateId, getCourseById);
router.put('/courses/:id/progress', validateId, updateCourseProgress);
router.get('/my-courses', getUserCourses);
router.get('/diplomas', getDiplomas);
router.get('/diplomas/:id', validateId, getDiplomaById);
router.post('/diplomas/:id/enroll', validateId, enrollDiploma);
router.get('/my-diplomas', getUserDiplomas);

module.exports = router;

