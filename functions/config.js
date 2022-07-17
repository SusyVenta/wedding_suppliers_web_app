const dotenv = require('dotenv');

dotenv.config();

const {
  API_KEY,
  AUTHDOMAIN,
  STORAGE_BUCKET,
  MESSAGING_SENDER,
  PROJECT_ID,
  APP_ID,
  MEASUREMENT_ID
} = process.env;

module.exports.firebaseConfig = {
    apiKey: API_KEY,
    authDomain: AUTHDOMAIN,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGING_SENDER,
    appId: APP_ID,
    measurementId: MEASUREMENT_ID
}
