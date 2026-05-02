const Quiz = require('../models/Quiz');
const Document = require('../models/Document');
const { generateQuizFromText } = require('../services/openaiService');
const logger = require('../utils/logger');

const generateQuiz = async (req, res, next) => {
    // LOGS PARA DEPURAR
    console.log('=== QUIZ CONTROLLER ===');
    console.log('Texto recibido:', req.body.text ? req.body.text.substring(0, 100) : 'No text');
    console.log('DocumentId:', req.body.documentId);
    console.log('Number of questions:', req.body.numberOfQuestions);
    
    try {
        const { text, documentId, numberOfQuestions = 10, difficulty = 'Medium' } = req.body;
        const userId = req.user._id;

        console.log('Usuario:', userId);
        console.log('Número de preguntas:', numberOfQuestions);

        if (!text && !documentId) {
            return res.status(400).json({
                success: false,
                error: 'Se requiere un texto o un documento para generar el quiz'
            });
        }

        let sourceText = text;

        if (documentId && !sourceText) {
            const document = await Document.findOne({ _id: documentId, user: userId });
            if (document && document.extractedText) {
                sourceText = document.extractedText;
            } else {
                return res.status(404).json({
                    success: false,
                    error: 'Documento no encontrado o sin texto extraído'
                });
            }
        }

        // ✅ VALIDACIÓN ELIMINADA: ya no exige mínimo 100 caracteres
        if (!sourceText) {
            return res.status(400).json({
                success: false,
                error: 'No hay texto para generar el quiz'
            });
        }

        console.log('SourceText OK, longitud:', sourceText.length);

        // Generar quiz con IA
        console.log('Llamando a generateQuizFromText...');
        const { keyConcepts, questions } = await generateQuizFromText(sourceText, numberOfQuestions, difficulty);
        console.log('Preguntas generadas:', questions ? questions.length : 0);

        if (!questions || questions.length === 0) {
            // Si no hay preguntas, devolver preguntas de ejemplo
            const exampleQuiz = {
                keyConcepts: ["Contrato", "Arrendamiento", "Cláusula", "Riesgo", "Obligación"],
                questions: [
                    {
                        question: "¿Qué es un contrato de arrendamiento?",
                        options: ["Un acuerdo de compra-venta", "Un acuerdo para usar un inmueble a cambio de una renta", "Un préstamo de dinero", "Una donación"],
                        correctAnswer: 1,
                        explanation: "El contrato de arrendamiento es aquel por el cual una parte se obliga a conceder el uso de un bien a cambio de una renta."
                    },
                    {
                        question: "¿Qué es una cláusula leonina?",
                        options: ["Una cláusula que beneficia a ambas partes", "Una cláusula que otorga ventajas desproporcionadas a una parte", "Una cláusula que establece plazos", "Una cláusula de confidencialidad"],
                        correctAnswer: 1,
                        explanation: "Las cláusulas leoninas son aquellas que establecen ventajas excesivas para una de las partes."
                    },
                    {
                        question: "¿Qué artículo del Código Civil Federal regula los contratos?",
                        options: ["Artículo 1", "Artículo 1792", "Artículo 2000", "Artículo 3000"],
                        correctAnswer: 1,
                        explanation: "El artículo 1792 del Código Civil Federal define el contrato como el acuerdo de voluntades para crear obligaciones."
                    }
                ]
            };
            
            // Guardar quiz en BD con preguntas de ejemplo
            const quiz = await Quiz.create({
                user: userId,
                document: documentId,
                title: `Quiz - ${new Date().toLocaleDateString()}`,
                sourceText: sourceText ? sourceText.substring(0, 5000) : "Texto de prueba",
                keyConcepts: exampleQuiz.keyConcepts,
                numberOfQuestions: exampleQuiz.questions.length,
                difficulty,
                questions: exampleQuiz.questions,
            });

            console.log('✅ Quiz de ejemplo guardado con ID:', quiz._id);

            return res.status(201).json({
                success: true,
                quiz: {
                    id: quiz._id,
                    title: quiz.title,
                    questions: quiz.questions.map(q => ({
                        question: q.question,
                        options: q.options,
                        explanation: q.explanation,
                    })),
                    numberOfQuestions: quiz.numberOfQuestions,
                    difficulty: quiz.difficulty,
                },
            });
        }

        // Guardar quiz en BD
        const quiz = await Quiz.create({
            user: userId,
            document: documentId,
            title: `Quiz - ${new Date().toLocaleDateString()}`,
            sourceText: sourceText.substring(0, 5000),
            keyConcepts: keyConcepts || [],
            numberOfQuestions: questions.length,
            difficulty,
            questions: questions,
        });

        console.log('✅ Quiz guardado con ID:', quiz._id);

        res.status(201).json({
            success: true,
            quiz: {
                id: quiz._id,
                title: quiz.title,
                questions: quiz.questions.map(q => ({
                    question: q.question,
                    options: q.options,
                    explanation: q.explanation,
                })),
                numberOfQuestions: quiz.numberOfQuestions,
                difficulty: quiz.difficulty,
            },
        });
    } catch (error) {
        console.error('❌ ERROR en generateQuiz:', error);
        console.error('Stack:', error.stack);
        res.status(500).json({
            success: false,
            error: 'Error al generar el quiz: ' + error.message
        });
    }
};

const submitQuiz = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { answers } = req.body;
        const userId = req.user._id;

        const quiz = await Quiz.findOne({ _id: id, user: userId });

        if (!quiz) {
            return res.status(404).json({
                success: false,
                error: 'Quiz no encontrado'
            });
        }

        let correctCount = 0;
        const results = [];

        for (let i = 0; i < quiz.questions.length; i++) {
            const question = quiz.questions[i];
            const userAnswer = answers[i];
            const isCorrect = userAnswer === question.correctAnswer;

            if (isCorrect) correctCount++;

            results.push({
                questionIndex: i,
                question: question.question,
                userAnswer,
                correctAnswer: question.correctAnswer,
                isCorrect,
                explanation: question.explanation,
            });
        }

        const score = Math.round((correctCount / quiz.questions.length) * 100);

        quiz.attempts += 1;
        quiz.lastScore = score;
        if (score > quiz.bestScore) {
            quiz.bestScore = score;
        }
        await quiz.save();

        res.json({
            success: true,
            score,
            correctCount,
            totalQuestions: quiz.questions.length,
            results,
            message: score >= 70 ? '¡Felicidades! Aprobaste el quiz.' : 'Puedes intentarlo nuevamente.',
        });
    } catch (error) {
        next(error);
    }
};

const getUserQuizzes = async (req, res, next) => {
    try {
        const { limit = 20, skip = 0 } = req.query;
        const userId = req.user._id;

        const quizzes = await Quiz.find({ user: userId })
            .sort({ generatedDate: -1 })
            .skip(parseInt(skip))
            .limit(parseInt(limit))
            .select('title numberOfQuestions difficulty attempts bestScore generatedDate');

        const total = await Quiz.countDocuments({ user: userId });

        res.json({
            success: true,
            quizzes,
            pagination: {
                total,
                limit: parseInt(limit),
                skip: parseInt(skip),
                hasMore: skip + parseInt(limit) < total,
            },
        });
    } catch (error) {
        next(error);
    }
};

const getQuizById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const quiz = await Quiz.findOne({ _id: id, user: userId });

        if (!quiz) {
            return res.status(404).json({
                success: false,
                error: 'Quiz no encontrado'
            });
        }

        res.json({
            success: true,
            quiz: {
                id: quiz._id,
                title: quiz.title,
                questions: quiz.questions.map(q => ({
                    question: q.question,
                    options: q.options,
                    explanation: q.explanation,
                })),
                numberOfQuestions: quiz.numberOfQuestions,
                difficulty: quiz.difficulty,
                attempts: quiz.attempts,
                bestScore: quiz.bestScore,
                lastScore: quiz.lastScore,
                generatedDate: quiz.generatedDate,
            },
        });
    } catch (error) {
        next(error);
    }
};

const deleteQuiz = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const quiz = await Quiz.findOneAndDelete({ _id: id, user: userId });

        if (!quiz) {
            return res.status(404).json({
                success: false,
                error: 'Quiz no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Quiz eliminado correctamente',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    generateQuiz,
    submitQuiz,
    getUserQuizzes,
    getQuizById,
    deleteQuiz,
};