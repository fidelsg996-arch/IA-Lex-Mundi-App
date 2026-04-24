const vision = require('@google-cloud/vision');
const { Storage } = require('@google-cloud/storage');
const logger = require('../utils/logger');

let visionClient = null;
let storageClient = null;

const getVisionClient = () => {
  if (!visionClient) {
    try {
      visionClient = new vision.ImageAnnotatorClient({
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      });
      logger.info('Google Vision client initialized');
    } catch (error) {
      logger.error('Error initializing Google Vision:', error);
    }
  }
  return visionClient;
};

const extractTextFromImageBuffer = async (imageBuffer, mimeType) => {
  try {
    const client = getVisionClient();
    const request = {
      image: { content: imageBuffer.toString('base64') },
      imageContext: { languageHints: ['es', 'en'] },
    };
    const [result] = await client.textDetection(request);
    const detections = result.textAnnotations;
    return detections && detections.length > 0 ? detections[0].description : '';
  } catch (error) {
    logger.error('Error en Google Vision OCR:', error);
    throw new Error('Error al procesar el documento con OCR');
  }
};

const extractTextFromPdfUrl = async (fileUrl) => {
  try {
    const client = getVisionClient();
    const [result] = await client.documentTextDetection(fileUrl);
    const fullTextAnnotation = result.fullTextAnnotation;
    return fullTextAnnotation ? fullTextAnnotation.text : '';
  } catch (error) {
    logger.error('Error en Google Vision PDF OCR:', error);
    throw new Error('Error al procesar el PDF con OCR');
  }
};

const uploadToStorage = async (fileBuffer, fileName, folder = 'documents') => {
  try {
    const storage = new Storage({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });
    const bucket = storage.bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET);
    const filePath = `${folder}/${Date.now()}_${fileName}`;
    const file = bucket.file(filePath);
    await file.save(fileBuffer);
    await file.makePublic();
    return `https://storage.googleapis.com/${bucket.name}/${filePath}`;
  } catch (error) {
    logger.error('Error uploading to Google Storage:', error);
    throw new Error('Error al subir el archivo');
  }
};

const deleteFromStorage = async (fileUrl) => {
  try {
    const storage = new Storage({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });
    const bucket = storage.bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET);
    const pathMatch = fileUrl.match(/\/ia-lex-mundi-files\/(.+)$/);
    if (pathMatch) {
      const file = bucket.file(pathMatch[1]);
      await file.delete();
    }
  } catch (error) {
    logger.error('Error deleting from Google Storage:', error);
  }
};

module.exports = {
  extractTextFromImageBuffer,
  extractTextFromPdfUrl,
  uploadToStorage,
  deleteFromStorage,
};