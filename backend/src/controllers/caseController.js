const Case = require('../models/Case');

// Obtener todos los expedientes del usuario
const getCases = async (req, res, next) => {
  try {
    const { status, matter, search } = req.query;
    const query = { user: req.user._id };
    
    if (status) query.status = status;
    if (matter) query.matter = matter;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { caseNumber: { $regex: search, $options: 'i' } },
        { plaintiff: { $regex: search, $options: 'i' } },
        { defendant: { $regex: search, $options: 'i' } }
      ];
    }
    
    const cases = await Case.find(query).sort({ createdAt: -1 });
    res.json(cases);
  } catch (error) {
    next(error);
  }
};

// Obtener un expediente por ID
const getCaseById = async (req, res, next) => {
  try {
    const caseItem = await Case.findOne({ _id: req.params.id, user: req.user._id });
    if (!caseItem) {
      return res.status(404).json({ error: 'Expediente no encontrado' });
    }
    res.json(caseItem);
  } catch (error) {
    next(error);
  }
};

// Crear nuevo expediente
const createCase = async (req, res, next) => {
  try {
    const caseData = {
      ...req.body,
      user: req.user._id
    };
    
    const newCase = await Case.create(caseData);
    res.status(201).json(newCase);
  } catch (error) {
    next(error);
  }
};

// Actualizar expediente
const updateCase = async (req, res, next) => {
  try {
    const caseItem = await Case.findOne({ _id: req.params.id, user: req.user._id });
    if (!caseItem) {
      return res.status(404).json({ error: 'Expediente no encontrado' });
    }
    
    const updatedCase = await Case.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    res.json(updatedCase);
  } catch (error) {
    next(error);
  }
};

// Eliminar expediente
const deleteCase = async (req, res, next) => {
  try {
    const caseItem = await Case.findOne({ _id: req.params.id, user: req.user._id });
    if (!caseItem) {
      return res.status(404).json({ error: 'Expediente no encontrado' });
    }
    
    await Case.deleteOne({ _id: req.params.id });
    res.json({ message: 'Expediente eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};

// Agregar documento al expediente
const addDocument = async (req, res, next) => {
  try {
    const { name, url, type } = req.body;
    const caseItem = await Case.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!caseItem) {
      return res.status(404).json({ error: 'Expediente no encontrado' });
    }
    
    await caseItem.addDocument(name, url, type);
    res.json({ message: 'Documento agregado correctamente', case: caseItem });
  } catch (error) {
    next(error);
  }
};

// Agregar fecha importante
const addImportantDate = async (req, res, next) => {
  try {
    const { title, date, description } = req.body;
    const caseItem = await Case.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!caseItem) {
      return res.status(404).json({ error: 'Expediente no encontrado' });
    }
    
    await caseItem.addImportantDate(title, date, description);
    res.json({ message: 'Fecha importante agregada correctamente', case: caseItem });
  } catch (error) {
    next(error);
  }
};

// Obtener estadísticas de expedientes
const getCaseStats = async (req, res, next) => {
  try {
    const stats = await Case.countByStatus(req.user._id);
    const total = await Case.countDocuments({ user: req.user._id });
    const active = await Case.countDocuments({ user: req.user._id, status: 'activo' });
    const pending = await Case.countDocuments({ user: req.user._id, status: 'pendiente' });
    const urgent = await Case.countDocuments({ user: req.user._id, status: 'urgente' });
    const closed = await Case.countDocuments({ user: req.user._id, status: 'cerrado' });
    
    res.json({
      total,
      active,
      pending,
      urgent,
      closed,
      byMatter: stats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCases,
  getCaseById,
  createCase,
  updateCase,
  deleteCase,
  addDocument,
  addImportantDate,
  getCaseStats
};