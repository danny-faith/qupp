import Rebase from 're-base';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
require('dotenv').config();

const {
    REACT_APP_FIREBASE_API_KEY,
    REACT_APP_FIREBASE_AUTH_DOMAIN,
    REACT_APP_FIREBASE_DB_URL
} = process.env;

const firebaseApp = firebase.initializeApp({
    apiKey: REACT_APP_FIREBASE_API_KEY,
    authDomain: REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: REACT_APP_FIREBASE_DB_URL
});

// firebaseApp.auth().signInWithEmailAndPassword('daniel.e.blythe@gmail.com', 'TrebbleAFSD77').catch(function(error) {
//     // Handle Errors here.
//     var errorCode = error.code;
//     var errorMessage = error.message;
// });

const base = Rebase.createClass(firebaseApp.database());

export { firebaseApp };

export default base;