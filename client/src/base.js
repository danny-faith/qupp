import Rebase from 're-base';
import firebase from 'firebase/app';
import 'firebase/database';

const {
    FIREBASE_API_KEY
} = process.env;

const firebaseApp = firebase.initializeApp({
    apiKey: FIREBASE_API_KEY,
    authDomain: "qupp-8353d.firebaseapp.com",
    databaseURL: "https://qupp-8353d.firebaseio.com"
});

const base = Rebase.createClass(firebaseApp.database());

export { firebaseApp };

export default base;