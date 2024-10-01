// src/firebase.ts

import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getAnalytics, logEvent, setUserProperties } from 'firebase/analytics';
import i18n from './i18n';

import packageJson from '../../../package.json';

// Your Firebase configuration (replace with your actual config)
const firebaseConfig = {
  apiKey: 'AIzaSyBZ0V6V43EW3NHE-z0fZZnlpe22mE55uqQ', // Replace with your API key
  authDomain: 'bonbon-browser.firebaseapp.com', // Replace with your Auth domain
  databaseURL:
    'https://bonbon-browser-default-rtdb.europe-west1.firebasedatabase.app', // Replace with your Database URL
  projectId: 'bonbon-browser', // Replace with your Project ID
  storageBucket: 'bonbon-browser.appspot.com', // Replace with your Storage Bucket
  messagingSenderId: '313574192651', // Replace with your Messaging Sender ID
  appId: '1:313574192651:web:d1fa0e4916ea7a2782f90e', // Replace with your App ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and Auth
const database = getDatabase(app);
const auth = getAuth(app);

const analytics = getAnalytics();
setUserProperties(analytics, {
  app_version: packageJson.version,
  language: i18n.language,
});

// Sign in anonymously
signInAnonymously(auth)
  .then(() => {
    console.log('Signed in anonymously to Firebase Auth');
    logEvent(analytics, 'firebase_signin_anonymous');
  })
  .catch((error) => {
    console.error('Firebase Auth Error:', error);
    logEvent(analytics, 'firebase_signin_anonymous_error');
  });

setInterval(() => {
  logEvent(analytics, 'ping');
}, 60000);

export { database, analytics };
