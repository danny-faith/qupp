import Rebase from 're-base';
import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCIdDltj10KD8Tr6buAtmcmphzFT-BRQLI",
    authDomain: "qupp-8353d.firebaseapp.com",
    databaseURL: "https://qupp-8353d.firebaseio.com"
});

const base = Rebase.createClass(firebaseApp.database());

export { firebaseApp };

export default base;