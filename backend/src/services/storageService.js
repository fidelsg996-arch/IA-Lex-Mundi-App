const { getBucket } = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

const uploadFile = async (fileBuffer, fileName, mimeType, folder = 'documents') => {
  try {
    const bucket = getBucket();
    if (!bucket) throw new Error('Firebase Storage no configurado');
    
    const fileId = uuidv4();
    const filePath = `${folder}/${fileId}_${fileName}`;
    const file = bucket.file(filePath);
    
    await file.save(fileBuffer, {
      metadata: { contentType: mimeType, metadata: { originalName: fileName } },
    });
    
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 365 * 24 * 60 * 60 * 1000,
    });
    
    return { url, path: filePath, fileId };
  } catch (error) {
    logger.error('Error uploading file to storage:', error);
    throw new Error('Error al subir el archivo');
  }
};

const deleteFile = async (filePath) => {
  try {
    const bucket = getBucket();
    if (!bucket) return;
    const file = bucket.file(filePath);
    await file.delete();
    logger.info(`File deleted: ${filePath}`);
  } catch (error) {
    logger.error('Error deleting file from storage:', error);
  }
};

const getFileUrl = async (filePath) => {
  try {
    const bucket = getBucket();
    if (!bucket) return null;
    const file = bucket.file(filePath);
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 365 * 24 * 60 * 60 * 1000,
    });
    return url;
  } catch (error) {
    logger.error('Error getting file URL:', error);
    return null;
  }
};

const calculateUserStorage = async (userId) => {
  return 0;
};

module.exports = {
  uploadFile,
  deleteFile,
  getFileUrl,
  calculateUserStorage,
};