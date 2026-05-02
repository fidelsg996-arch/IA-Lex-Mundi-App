const User = require('../models/User');
const Payment = require('../models/Payment');
const Analysis = require('../models/Analysis');
const Book = require('../models/Book');
const Course = require('../models/Course');
const Diploma = require('../models/Diploma');
const Procedure = require('../models/Procedure');

const getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeSubscriptions = await User.countDocuments({ subscriptionStatus: 'active', plan: { $ne: 'free' } });
    const totalPayments = await Payment.aggregate([{ $match: { status: 'completed' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]);
    const totalAnalyses = await Analysis.countDocuments();
    const freeUsers = await User.countDocuments({ plan: 'free' });
    const paidUsers = await User.countDocuments({ plan: { $ne: 'free' } });

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeSubscriptions,
        totalRevenue: totalPayments[0]?.total || 0,
        totalAnalyses,
        freeUsers,
        paidUsers,
        conversionRate: totalUsers > 0 ? (paidUsers / totalUsers * 100).toFixed(2) : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const { limit = 50, skip = 0, plan, search } = req.query;
    const query = {};

    if (plan) query.plan = plan;
    if (search) {
      query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
    }

    const users = await User.find(query).sort({ createdAt: -1 }).skip(parseInt(skip)).limit(parseInt(limit)).select('-password -__v');
    const total = await User.countDocuments(query);

    res.json({ success: true, users, pagination: { total, limit: parseInt(limit), skip: parseInt(skip), hasMore: skip + parseInt(limit) < total } });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { plan, subscriptionStatus, name, email } = req.body;

    const user = await User.findByIdAndUpdate(id, { plan, subscriptionStatus, name, email }, { new: true, runValidators: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, error: 'Usuario no encontrado' });

    await user.updateLimitsByPlan();

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

const createBook = async (req, res, next) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json({ success: true, book });
  } catch (error) {
    next(error);
  }
};

const updateBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const book = await Book.findByIdAndUpdate(id, req.body, { new: true });
    if (!book) return res.status(404).json({ success: false, error: 'Libro no encontrado' });
    res.json({ success: true, book });
  } catch (error) {
    next(error);
  }
};

const deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const book = await Book.findByIdAndDelete(id);
    if (!book) return res.status(404).json({ success: false, error: 'Libro no encontrado' });
    res.json({ success: true, message: 'Libro eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};

const createCourse = async (req, res, next) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({ success: true, course });
  } catch (error) {
    next(error);
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findByIdAndUpdate(id, req.body, { new: true });
    if (!course) return res.status(404).json({ success: false, error: 'Curso no encontrado' });
    res.json({ success: true, course });
  } catch (error) {
    next(error);
  }
};

const createDiploma = async (req, res, next) => {
  try {
    const diploma = await Diploma.create(req.body);
    res.status(201).json({ success: true, diploma });
  } catch (error) {
    next(error);
  }
};

const createProcedure = async (req, res, next) => {
  try {
    const procedure = await Procedure.create(req.body);
    res.status(201).json({ success: true, procedure });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};