const Analysis = require('../models/Analysis');
const { analyzeLegalDocument } = require('../services/openaiService');
const { sendAnalysisCompleteNotification } = require('../services/notificationService');
const logger = require('../utils/logger');

const createAnalysis = async (req, res, next) => {
  try {
    const { inputText, analysisType, caseId, documentId } = req.body;
    const userId = req.user._id;

    if (!req.user.hasConsultationQuota()) {
      return res.status(429).json({
        success: false,
        error: 'Has alcanzado tu límite de consultas IA para este mes',
        quotaUsed: req.user.consultationsUsedThisMonth,
        quotaLimit: req.user.consultationLimit,
      });
    }

    let modelType = 'mini';
    if (req.user.plan === 'free' || req.user.plan === 'basic') modelType = 'nano';
    else if (req.user.plan === 'professional') modelType = 'mini';
    else if (req.user.plan === 'premium') modelType = 'pro';

    const analysisResult = await analyzeLegalDocument(inputText, analysisType, modelType);

    const analysis = await Analysis.create({
      user: userId,
      case: caseId,
      document: documentId,
      analysisType,
      inputText: inputText.substring(0, 5000),
      risks: analysisResult.risks || [],
      problematicClauses: analysisResult.problematicClauses || [],
      recommendations: analysisResult.recommendations || [],
      riskLevel: analysisResult.riskLevel || 5,
      legalBasis: analysisResult.legalBasis || [],
      fullResponse: JSON.stringify(analysisResult),
      aiModelUsed: modelType === 'nano' ? 'gpt-5.4-nano' : modelType === 'mini' ? 'gpt-5.4-mini' : 'gpt-5.4',
      consumedCredit: true,
    });

    await req.user.consumeConsultation();

    sendAnalysisCompleteNotification(userId, analysis._id, 'Documento').catch(err => logger.error('Error sending notification:', err));

    res.status(201).json({
      success: true,
      analysis: analysis.toPublicJSON(),
      details: {
        risks: analysis.risks,
        problematicClauses: analysis.problematicClauses,
        recommendations: analysis.recommendations,
        riskLevel: analysis.riskLevel,
        legalBasis: analysis.legalBasis,
      },
      quotaRemaining: req.user.consultationLimit - req.user.consultationsUsedThisMonth,
    });
  } catch (error) {
    next(error);
  }
};

const getUserAnalyses = async (req, res, next) => {
  try {
    const { limit = 20, skip = 0, caseId } = req.query;
    const userId = req.user._id;

    const query = { user: userId };
    if (caseId) query.case = caseId;

    const analyses = await Analysis.find(query)
      .sort({ analysisDate: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate('case', 'name caseNumber')
      .populate('document', 'fileName');

    const total = await Analysis.countDocuments(query);

    res.json({
      success: true,
      analyses: analyses.map(a => ({
        id: a._id,
        analysisType: a.analysisType,
        analysisDate: a.analysisDate,
        riskLevel: a.riskLevel,
        case: a.case ? { id: a.case._id, name: a.case.name, caseNumber: a.case.caseNumber } : null,
        documentName: a.document?.fileName,
        summary: a.recommendations?.[0] || null,
      })),
      pagination: { total, limit: parseInt(limit), skip: parseInt(skip), hasMore: skip + parseInt(limit) < total },
    });
  } catch (error) {
    next(error);
  }
};

const getAnalysisById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const analysis = await Analysis.findOne({ _id: id, user: userId })
      .populate('case', 'name caseNumber matter')
      .populate('document', 'fileName fileType');

    if (!analysis) return res.status(404).json({ success: false, error: 'Análisis no encontrado' });

    res.json({ success: true, analysis: {
      id: analysis._id,
      analysisType: analysis.analysisType,
      analysisDate: analysis.analysisDate,
      risks: analysis.risks,
      problematicClauses: analysis.problematicClauses,
      recommendations: analysis.recommendations,
      riskLevel: analysis.riskLevel,
      legalBasis: analysis.legalBasis,
      case: analysis.case,
      document: analysis.document,
      aiModelUsed: analysis.aiModelUsed,
    } });
  } catch (error) {
    next(error);
  }
};

const deleteAnalysis = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const analysis = await Analysis.findOneAndDelete({ _id: id, user: userId });
    if (!analysis) return res.status(404).json({ success: false, error: 'Análisis no encontrado' });

    res.json({ success: true, message: 'Análisis eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAnalysis,
  getUserAnalyses,
  getAnalysisById,
  deleteAnalysis,
};