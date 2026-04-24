const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');

const userController = require('../controllers/userController');

router.use(verifyToken);

router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.get('/stats', userController.getUserStats);
router.get('/notifications', userController.getUserNotifications);
router.put('/notifications/read', userController.markNotificationsRead);
router.post('/fiel', userController.uploadFIEL);
router.delete('/fiel', userController.deleteFIEL);

module.exports = router;

