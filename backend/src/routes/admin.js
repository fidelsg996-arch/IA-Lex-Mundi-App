const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const {
  getStats,
  getUsers,
  updateUser,
  createBook,
  updateBook,
  deleteBook,
  createCourse,
  updateCourse,
  createDiploma,
  createProcedure,
} = require('../controllers/adminController');

router.use(verifyToken, requireRole('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.post('/books', createBook);
router.put('/books/:id', updateBook);
router.delete('/books/:id', deleteBook);
router.post('/courses', createCourse);
router.put('/courses/:id', updateCourse);
router.post('/diplomas', createDiploma);
router.post('/procedures', createProcedure);

module.exports = router;
