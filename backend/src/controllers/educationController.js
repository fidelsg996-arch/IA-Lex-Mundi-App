const Course = require('../models/Course');
const CourseProgress = require('../models/CourseProgress');
const Diploma = require('../models/Diploma');
const DiplomaEnrollment = require('../models/DiplomaEnrollment');
const Payment = require('../models/Payment');
const { generateCertificatePDF } = require('../utils/pdfGenerator');
const { uploadFile } = require('../services/storageService');
const { sendCertificateEmail } = require('../services/emailService');
const { sendNotification } = require('../services/notificationService');
const { createOneTimePaymentIntent } = require('../services/stripeService');
const logger = require('../utils/logger');

const getCourses = async (req, res, next) => {
  try {
    const { level, limit = 20, skip = 0 } = req.query;
    const query = { isActive: true };
    if (level) query.level = level;

    const courses = await Course.find(query).sort({ createdAt: -1 }).skip(parseInt(skip)).limit(parseInt(limit));
    const total = await Course.countDocuments(query);

    res.json({ success: true, courses: courses.map(c => c.toPublicJSON()), pagination: { total, limit: parseInt(limit), skip: parseInt(skip), hasMore: skip + parseInt(limit) < total } });
  } catch (error) {
    next(error);
  }
};

const getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ success: false, error: 'Curso no encontrado' });

    let progress = null;
    if (userId) progress = await CourseProgress.findOne({ user: userId, course: id });

    res.json({ success: true, course: { ...course.toPublicJSON(), modules: course.modules, exam: course.exam, progress: progress ? progress.toPublicJSON() : null } });
  } catch (error) {
    next(error);
  }
};

const updateCourseProgress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { completedModuleIndex, examAnswers } = req.body;
    const userId = req.user._id;

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ success: false, error: 'Curso no encontrado' });

    let progress = await CourseProgress.findOne({ user: userId, course: id });
    if (!progress) progress = await CourseProgress.create({ user: userId, course: id, completedModules: [] });

    if (completedModuleIndex !== undefined && !progress.completedModules.includes(completedModuleIndex)) {
      progress.completedModules.push(completedModuleIndex);
    }

    progress.percentageCompleted = Math.round((progress.completedModules.length / course.modules.length) * 100);

    if (examAnswers && progress.percentageCompleted === 100) {
      let correctCount = 0;
      for (let i = 0; i < course.exam.length; i++) {
        if (examAnswers[i] === course.exam[i].correctAnswer) correctCount++;
      }
      const score = Math.round((correctCount / course.exam.length) * 100);
      progress.examScore = score;
      progress.examPassed = score >= course.passingScore;
    }

    if (progress.examPassed && !progress.certificateObtained) {
      progress.certificateObtained = true;
      progress.completedAt = new Date();

      const certificatePdf = await generateCertificatePDF({ name: req.user.name }, { title: course.title, durationHours: course.durationHours }, 'course');
      const uploadResult = await uploadFile(certificatePdf, `certificate_${userId}_${id}.pdf`, 'application/pdf', 'certificates');
      progress.certificateUrl = uploadResult.url;

      await sendCertificateEmail(req.user, course.title, uploadResult.url, 'course');
      await sendNotification(userId, 'course_completed', '¡Curso completado!', `Felicidades, has completado el curso "${course.title}".`, { courseId: id, certificateUrl: uploadResult.url });
    }

    await progress.save();

    res.json({ success: true, progress: progress.toPublicJSON(), certificateObtained: progress.certificateObtained, certificateUrl: progress.certificateUrl });
  } catch (error) {
    logger.error('Error updating course progress:', error);
    next(error);
  }
};

const getDiplomas = async (req, res, next) => {
  try {
    const { featured, limit = 20, skip = 0 } = req.query;
    const query = { isActive: true };
    if (featured === 'true') query.isFeatured = true;

    const diplomas = await Diploma.find(query).sort({ isFeatured: -1, createdAt: -1 }).skip(parseInt(skip)).limit(parseInt(limit));
    const total = await Diploma.countDocuments(query);

    res.json({ success: true, diplomas: diplomas.map(d => d.toPublicJSON()), pagination: { total, limit: parseInt(limit), skip: parseInt(skip), hasMore: skip + parseInt(limit) < total } });
  } catch (error) {
    next(error);
  }
};

const getDiplomaById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const diploma = await Diploma.findById(id);
    if (!diploma) return res.status(404).json({ success: false, error: 'Diplomado no encontrado' });

    let enrollment = null;
    if (userId) enrollment = await DiplomaEnrollment.findOne({ user: userId, diploma: id });

    const isIncluded = req.user.plan === 'premium' && diploma.includedInPremium;

    res.json({ success: true, diploma: { ...diploma.toPublicJSON(), isIncluded, enrolled: !!enrollment, enrollmentStatus: enrollment?.status, certificateUrl: enrollment?.certificateUrl } });
  } catch (error) {
    next(error);
  }
};

const enrollDiploma = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const diploma = await Diploma.findById(id);
    if (!diploma) return res.status(404).json({ success: false, error: 'Diplomado no encontrado' });

    const existingEnrollment = await DiplomaEnrollment.findOne({ user: userId, diploma: id });
    if (existingEnrollment) return res.status(400).json({ success: false, error: 'Ya estás inscrito en este diplomado' });

    if (diploma.capacity && diploma.enrolled >= diploma.capacity) {
      return res.status(400).json({ success: false, error: 'El diplomado ha alcanzado su cupo máximo' });
    }

    const isIncluded = req.user.plan === 'premium' && diploma.includedInPremium;

    let payment = null;
    if (!isIncluded) {
      const paymentIntent = await createOneTimePaymentIntent(diploma.price, 'mxn', { userId: userId.toString(), concept: 'diploma', referenceId: id, title: diploma.title });
      payment = await Payment.create({
        user: userId,
        amount: diploma.price,
        concept: 'diploma',
        referenceId: id,
        paymentMethod: 'card',
        status: 'pending',
        stripePaymentIntentId: paymentIntent.id,
        metadata: { title: diploma.title },
      });
    }

    const enrollment = await DiplomaEnrollment.create({
      user: userId,
      diploma: id,
      status: 'Active',
      amountPaid: isIncluded ? 0 : diploma.price,
      paymentId: payment?._id,
    });

    diploma.enrolled += 1;
    await diploma.save();

    res.json({ success: true, enrollment: enrollment.toPublicJSON(), requiresPayment: !isIncluded, paymentClientSecret: payment?.stripePaymentIntentId });
  } catch (error) {
    logger.error('Error enrolling in diploma:', error);
    next(error);
  }
};

const getUserCourses = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const progress = await CourseProgress.find({ user: userId }).populate('course');
    res.json({ success: true, courses: progress.map(p => ({ course: p.course.toPublicJSON(), progress: p.toPublicJSON() })) });
  } catch (error) {
    next(error);
  }
};

const getUserDiplomas = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const enrollments = await DiplomaEnrollment.find({ user: userId }).populate('diploma').sort({ enrollmentDate: -1 });
    res.json({
      success: true,
      diplomas: enrollments.map(e => ({
        id: e.diploma._id,
        title: e.diploma.title,
        instructor: e.diploma.instructor,
        durationHours: e.diploma.durationHours,
        enrollmentDate: e.enrollmentDate,
        completionDate: e.completionDate,
        status: e.status,
        certificateUrl: e.certificateUrl,
        fielSigned: e.fielSigned,
      })),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCourses,
  getCourseById,
  updateCourseProgress,
  getDiplomas,
  getDiplomaById,
  enrollDiploma,
  getUserCourses,
  getUserDiplomas,
};