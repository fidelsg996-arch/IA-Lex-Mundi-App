const Storage = require('../models/Storage');
const fs = require('fs');
const path = require('path');

// Crear carpeta de uploads si no existe
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Subir archivo
exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No se envió ningún archivo' });
        }

        const file = req.file;
        const userId = req.user._id;

        const storageFile = new Storage({
            userId,
            filename: file.filename,
            originalName: file.originalname,
            fileType: file.mimetype,
            size: file.size,
            path: file.path
        });

        await storageFile.save();

        res.status(201).json({
            success: true,
            message: 'Archivo subido exitosamente',
            file: {
                id: storageFile._id,
                filename: storageFile.originalName,
                size: storageFile.size,
                uploadedAt: storageFile.uploadedAt
            }
        });
    } catch (error) {
        console.error('Error al subir archivo:', error);
        res.status(500).json({ success: false, error: 'Error al subir archivo' });
    }
};

// Obtener archivos del usuario
exports.getFiles = async (req, res) => {
    try {
        const userId = req.user._id;
        const files = await Storage.find({ userId }).sort({ uploadedAt: -1 });
        
        res.json({
            success: true,
            files: files.map(f => ({
                _id: f._id,
                filename: f.originalName,
                size: f.size,
                fileType: f.fileType,
                uploadedAt: f.uploadedAt
            }))
        });
    } catch (error) {
        console.error('Error al obtener archivos:', error);
        res.status(500).json({ success: false, error: 'Error al obtener archivos' });
    }
};

// Descargar archivo
exports.downloadFile = async (req, res) => {
    try {
        const fileId = req.params.id;
        const userId = req.user._id;

        const file = await Storage.findOne({ _id: fileId, userId });
        if (!file) {
            return res.status(404).json({ error: 'Archivo no encontrado' });
        }

        if (!fs.existsSync(file.path)) {
            return res.status(404).json({ error: 'Archivo físico no encontrado' });
        }

        res.download(file.path, file.originalName);
    } catch (error) {
        console.error('Error al descargar archivo:', error);
        res.status(500).json({ error: 'Error al descargar archivo' });
    }
};

// Eliminar archivo
exports.deleteFile = async (req, res) => {
    try {
        const fileId = req.params.id;
        const userId = req.user._id;

        const file = await Storage.findOne({ _id: fileId, userId });
        if (!file) {
            return res.status(404).json({ error: 'Archivo no encontrado' });
        }

        // Eliminar archivo físico
        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }

        // Eliminar registro de la BD
        await file.deleteOne();

        res.json({ success: true, message: 'Archivo eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar archivo:', error);
        res.status(500).json({ error: 'Error al eliminar archivo' });
    }
};
