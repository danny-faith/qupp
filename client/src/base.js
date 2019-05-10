import Rebase from 're-base';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
require('dotenv').config();

// const {
//     FIREBASE_API_KEY
// } = process.env;

// console.log('FIREBASE_API_KEY: ', FIREBASE_API_KEY);

const firebaseApp = firebase.initializeApp({
    // apiKey: FIREBASE_API_KEY,
    apiKey: 'AIzaSyCIdDltj10KD8Tr6buAtmcmphzFT-BRQLI',
    authDomain: "qupp-8353d.firebaseapp.com",
    databaseURL: "https://qupp-8353d.firebaseio.com"
});

// firebaseApp.auth().signInWithEmailAndPassword('daniel.e.blythe@gmail.com', 'TrebbleAFSD77').catch(function(error) {
//     // Handle Errors here.
//     var errorCode = error.code;
//     var errorMessage = error.message;
// });

const base = Rebase.createClass(firebaseApp.database());

export { firebaseApp };

export default base;