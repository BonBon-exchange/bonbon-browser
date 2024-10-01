// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBZ0V6V43EW3NHE-z0fZZnlpe22mE55uqQ',
  authDomain: 'bonbon-browser.firebaseapp.com',
  databaseURL:
    'https://bonbon-browser-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'bonbon-browser',
  storageBucket: 'bonbon-browser.appspot.com',
  messagingSenderId: '313574192651',
  appId: '1:313574192651:web:cbe8cd4ce4797d7c82f90e',
  measurementId: 'G-GVME8GLMGZ',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and Auth
const database = getFirestore(app);
const auth = getAuth(app);

// Sign in anonymously
signInAnonymously(auth)
  .then(() => {
    console.log('Signed in anonymously to Firebase Auth');
  })
  .catch((error) => {
    console.error('Firebase Auth Error:', error);
  });

export { database };
