const Document = require('../models/Document');
const Case = require('../models/Case');
const { uploadFile, deleteFile, calculateUserStorage } = require('../services/storageService');
const { extractTextFromImageBuffer, extractTextFromPdfUrl } = require('../services/googleVisionService');
const { sendNotification } = require('../services/notificationService');
const logger = require('../utils/logger');

const processOCR = async (documentId) => {
  try {
    const document = await Document.findById(documentId);
    if (!document || document.ocrStatus !== 'Pending') return;

    document.ocrStatus = 'Processing';
    await document.save();

    let extractedText = '';
    if (document.fileType === 'PDF') {
      extractedText = await extractTextFromPdfUrl(document.fileUrl);
    }

    document.extractedText = extractedText;
    document.ocrStatus = extractedText ? 'Completed' : 'Failed';
    await document.save();

    await sendNotification(document.user, 'system_alert', 'Documento procesado', `El documento "${document.fileName}" ha sido procesado.`, { documentId: document._id });
  } catch (error) {
    logger.error(`OCR processing failed for document ${documentId}:`, error);
    await Document.findByIdAndUpdate(documentId, { ocrStatus: 'Failed' });
  }
};

const uploadDocument = async (req, res, next) => {
  try {
    const { caseId, documentType, documentDate, fileName, fileBuffer, mimeType } = req.body;
    const userId = req.user._id;

    const storageUsed = await calculateUserStorage(userId);
    if (storageUsed >= req.user.storageLimitMB) {
      return res.status(429).json({ success: false, error: `Has alcanzado tu límite de almacenamiento (${req.user.storageLimitMB} MB)` });
    }

    if (caseId) {
      const caseExists = await Case.findOne({ _id: caseId, user: userId });
      if (!caseExists) return res.status(404).json({ success: false, error: 'Expediente no encontrado' });
    }

    const fileData = Buffer.from(fileBuffer, 'base64');
    const uploadResult = await uploadFile(fileData, fileName, mimeType, 'documents');

    const document = await Document.create({
      user: userId,
      case: caseId,
      fileName,
      fileUrl: uploadResult.url,
      fileType: mimeType.split('/')[1].toUpperCase(),
      documentType,
      documentDate: documentDate || new Date(),
      fileSizeBytes: fileData.length,
      ocrStatus: 'Pending',
    });

    req.user.totalDocuments += 1;
    await req.user.save();

    if (['JPG', 'PNG', 'TIFF', 'PDF'].includes(document.fileType)) {
      processOCR(document._id).catch(err => logger.error(`Error processing OCR: ${err}`));
    }

    res.status(201).json({ success: true, document: document.toPublicJSON(), message: 'Documento subido correctamente' });
  } catch (error) {
    logger.error('Error uploading document:', error);
    next(error);
  }
};

const getUserDocuments = async (req, res, next) => {
  try {
    const { limit = 20, skip = 0, caseId, documentType } = req.query;
    const userId = req.user._id;

    const query = { user: userId };
    if (caseId) query.case = caseId;
    if (documentType) query.documentType = documentType;

    const documents = await Document.find(query)
      .sort({ uploadDate: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate('case', 'name caseNumber');

    const total = await Document.countDocuments(query);

    res.json({
      success: true,
      documents: documents.map(d => d.toPublicJSON()),
      pagination: { total, limit: parseInt(limit), skip: parseInt(skip), hasMore: skip + parseInt(limit) < total },
    });
  } catch (error) {
    next(error);
  }
};

const getDocumentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const document = await Document.findOne({ _id: id, user: userId }).populate('case', 'name caseNumber matter');
    if (!document) return res.status(404).json({ success: false, error: 'Documento no encontrado' });

    res.json({ success: true, document: { ...document.toPublicJSON(), extractedText: document.extractedText, ocrStatus: document.ocrStatus, fullFileUrl: document.fileUrl } });
  } catch (error) {
    next(error);
  }
};

const deleteDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const document = await Document.findOne({ _id: id, user: userId });
    if (!document) return res.status(404).json({ success: false, error: 'Documento no encontrado' });

    await deleteFile(document.fileUrl);
    await document.deleteOne();

    req.user.totalDocuments -= 1;
    await req.user.save();

    res.json({ success: true, message: 'Documento eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};

const toggleFavorite = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const document = await Document.findOne({ _id: id, user: userId });
    if (!document) return res.status(404).json({ success: false, error: 'Documento no encontrado' });

    document.isFavorite = !document.isFavorite;
    await document.save();

    res.json({ success: true, isFavorite: document.isFavorite });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadDocument,
  getUserDocuments,
  getDocumentById,
  deleteDocument,
  toggleFavorite,
};