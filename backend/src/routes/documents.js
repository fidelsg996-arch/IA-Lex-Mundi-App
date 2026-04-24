const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { checkStorageQuota } = require('../middleware/planLimits');
const { validateId } = require('../middleware/validation');
const {
  uploadDocument,
  getUserDocuments,
  getDocumentById,
  deleteDocument,
  toggleFavorite,
} = require('../controllers/documentController');

router.use(verifyToken);

router.get('/', getUserDocuments);
router.get('/:id', validateId, getDocumentById);
router.post('/', checkStorageQuota, uploadDocument);
router.delete('/:id', validateId, deleteDocument);
router.put('/:id/favorite', validateId, toggleFavorite);

module.exports = router;


