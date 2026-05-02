const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  document: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
  },
  title: {
    type: String,
    required: true,
  },
  sourceText: {
    type: String,
    required: true,
  },
  keyConcepts: [String],
  numberOfQuestions: {
    type: Number,
    default: 10,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium',
  },
  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: Number,
      explanation: String,
    },
  ],
  generatedDate: {
    type: Date,
    default: Date.now,
    index: true,
  },
  attempts: {
    type: Number,
    default: 0,
  },
  bestScore: {
    type: Number,
    default: 0,
  },
  lastScore: {
    type: Number,
    default: 0,
  },
});

quizSchema.index({ user: 1, generatedDate: -1 });

quizSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    title: this.title,
    numberOfQuestions: this.numberOfQuestions,
    difficulty: this.difficulty,
    generatedDate: this.generatedDate,
    attempts: this.attempts,
    bestScore: this.bestScore,
    questions: this.questions.map(q => ({
      question: q.question,
      options: q.options,
      explanation: q.explanation,
    })),
  };
};

module.exports = mongoose.model('Quiz', quizSchema);