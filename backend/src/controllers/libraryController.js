const Book = require('../models/Book');
const Payment = require('../models/Payment');
const { createOneTimePaymentIntent } = require('../services/stripeService');

const getBooks = async (req, res, next) => {
  try {
    const { category, search, featured, limit = 20, skip = 0, includePaid = true } = req.query;
    const query = {};

    if (category) query.category = category;
    if (featured === 'true') query.isFeatured = true;
    if (!includePaid || req.user.plan === 'free') query.price = 0;
    if (search) query.$text = { $search: search };

    const books = await Book.find(query)
      .sort({ isFeatured: -1, downloads: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const total = await Book.countDocuments(query);

    res.json({
      success: true,
      books: books.map(book => ({
        id: book._id,
        title: book.title,
        author: book.author,
        category: book.category,
        description: book.description?.substring(0, 200),
        price: book.price,
        coverUrl: book.coverUrl,
        isFree: book.price === 0,
        downloads: book.downloads,
        rating: book.averageRating,
      })),
      pagination: { total, limit: parseInt(limit), skip: parseInt(skip), hasMore: skip + parseInt(limit) < total },
    });
  } catch (error) {
    next(error);
  }
};

const getBookById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ success: false, error: 'Libro no encontrado' });

    let hasAccess = book.price === 0;
    if (!hasAccess && req.user.plan === 'premium') hasAccess = true;
    if (!hasAccess) {
      const purchase = await Payment.findOne({ user: userId, concept: 'book', referenceId: id, status: 'completed' });
      hasAccess = !!purchase;
    }

    res.json({
      success: true,
      book: {
        id: book._id,
        title: book.title,
        author: book.author,
        category: book.category,
        description: book.description,
        price: book.price,
        coverUrl: book.coverUrl,
        publisher: book.publisher,
        isbn: book.isbn,
        publicationDate: book.publicationDate,
        fileUrl: hasAccess ? book.fileUrl : null,
        hasAccess,
        downloads: book.downloads,
        rating: book.averageRating,
      },
    });
  } catch (error) {
    next(error);
  }
};

const purchaseBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ success: false, error: 'Libro no encontrado' });
    if (book.price === 0) return res.status(400).json({ success: false, error: 'Este libro es gratuito, no requiere compra' });

    const existingPurchase = await Payment.findOne({ user: userId, concept: 'book', referenceId: id, status: 'completed' });
    if (existingPurchase) return res.status(400).json({ success: false, error: 'Ya has comprado este libro' });

    const paymentIntent = await createOneTimePaymentIntent(book.price, 'mxn', { userId: userId.toString(), concept: 'book', referenceId: id, title: book.title });

    const payment = await Payment.create({
      user: userId,
      amount: book.price,
      concept: 'book',
      referenceId: id,
      paymentMethod: 'card',
      status: 'pending',
      stripePaymentIntentId: paymentIntent.id,
      metadata: { title: book.title },
    });

    book.downloads += 1;
    await book.save();

    res.json({ success: true, clientSecret: paymentIntent.client_secret, paymentId: payment._id, book: { id: book._id, title: book.title, price: book.price } });
  } catch (error) {
    next(error);
  }
};

const getUserPurchases = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const purchases = await Payment.find({ user: userId, concept: 'book', status: 'completed' }).sort({ paymentDate: -1 });
    const bookIds = purchases.map(p => p.referenceId);
    const books = await Book.find({ _id: { $in: bookIds } });

    res.json({
      success: true,
      purchases: books.map(book => ({
        id: book._id,
        title: book.title,
        author: book.author,
        coverUrl: book.coverUrl,
        purchasedAt: purchases.find(p => p.referenceId === book._id.toString())?.paymentDate,
        fileUrl: book.fileUrl,
      })),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBooks,
  getBookById,
  purchaseBook,
  getUserPurchases,
};