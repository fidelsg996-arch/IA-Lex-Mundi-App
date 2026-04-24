const admin = require('firebase-admin');
const logger = require('../utils/logger');

let firebaseApp = null;
let storage = null;
let auth = null;

const initializeFirebase = () => {
  if (!firebaseApp) {
    try {
      if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        firebaseApp = admin.initializeApp({
          credential: admin.credential.applicationDefault(),
          projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || 'ia-lex-mundi',
          storageBucket: process.env.GOOGLE_CLOUD_STORAGE_BUCKET,
        });
      } else if (process.env.FIREBASE_PROJECT_ID) {
        firebaseApp = admin.initializeApp({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          storageBucket: process.env.GOOGLE_CLOUD_STORAGE_BUCKET,
        });
      } else {
        logger.warn('Firebase no configurado');
        return null;
      }

      storage = admin.storage(firebaseApp);
      auth = admin.auth(firebaseApp);
      logger.info('✅ Firebase inicializado correctamente');
    } catch (error) {
      logger.error('Error inicializando Firebase:', error);
      return null;
    }
  }
  return firebaseApp;
};

const getStorage = () => {
  if (!storage && !firebaseApp) initializeFirebase();
  return storage;
};

const getAuth = () => {
  if (!auth && !firebaseApp) initializeFirebase();
  return auth;
};

const getBucket = () => {
  const storageInstance = getStorage();
  return storageInstance ? storageInstance.bucket() : null;
};

module.exports = {
  initializeFirebase,
  getStorage,
  getAuth,
  getBucket,
};