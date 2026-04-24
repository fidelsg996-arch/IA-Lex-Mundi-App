const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const storageController = require('../controllers/storageController');
const { verifyToken } = require('../middleware/auth');

// Configurar multer
const uploadDir = path.join(__dirname, '../../uploads');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'image/jpeg', 'image/png'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Tipo de archivo no permitido. Solo PDF, DOC, TXT, JPG, PNG'));
        }
    }
});

// Rutas protegidas
router.post('/upload', verifyToken, upload.single('file'), storageController.uploadFile);
router.get('/files', verifyToken, storageController.getFiles);
router.get('/download/:id', verifyToken, storageController.downloadFile);
router.delete('/delete/:id', verifyToken, storageController.deleteFile);

module.exports = router;


