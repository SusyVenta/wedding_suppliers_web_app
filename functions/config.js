const dotenv = require('dotenv');
const {testConfig} = require('./firebaseConfig');
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

if (API_KEY != null){
  module.exports.firebaseConfig = {
    apiKey: API_KEY,
    authDomain: AUTHDOMAIN,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGING_SENDER,
    appId: APP_ID,
    measurementId: MEASUREMENT_ID
  }
} else{
  if (API_KEY == null){
    const API_KEY = testConfig.apiKey;
    const AUTHDOMAIN = testConfig.authDomain;
    const STORAGE_BUCKET = testConfig.storageBucket;
    const MESSAGING_SENDER = testConfig.messagingSenderId;
    const PROJECT_ID = testConfig.projectId;
    const APP_ID = testConfig.appId;
    const MEASUREMENT_ID = testConfig.measurementId;

    module.exports.firebaseConfig = {
      apiKey: API_KEY,
      authDomain: AUTHDOMAIN,
      projectId: PROJECT_ID,
      storageBucket: STORAGE_BUCKET,
      messagingSenderId: MESSAGING_SENDER,
      appId: APP_ID,
      measurementId: MEASUREMENT_ID
    }
  } 
}