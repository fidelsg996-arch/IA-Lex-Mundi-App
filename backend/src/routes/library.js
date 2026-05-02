const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { validateId } = require('../middleware/validation');
const {
  getBooks,
  getBookById,
  purchaseBook,
  getUserPurchases,
} = require('../controllers/libraryController');

router.use(verifyToken);

router.get('/books', getBooks);
router.get('/books/:id', validateId, getBookById);
router.get('/purchases', getUserPurchases);
router.post('/books/:id/purchase', validateId, purchaseBook);

module.exports = router;

