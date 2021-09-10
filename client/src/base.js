import firebase from "firebase/app"
import "firebase/database"
import "firebase/auth"
import config from "./config.js"

const {
	REACT_APP_FIREBASE_API_KEY,
	REACT_APP_FIREBASE_AUTH_DOMAIN,
	REACT_APP_FIREBASE_DB_URL,
	REACT_APP_FIREBASE_PROJECT_ID,
} = config

const firebaseConfig = {
	apiKey: REACT_APP_FIREBASE_API_KEY,
	authDomain: REACT_APP_FIREBASE_AUTH_DOMAIN,
	databaseURL: REACT_APP_FIREBASE_DB_URL,
	projectId: REACT_APP_FIREBASE_PROJECT_ID,
}

function initFirebase() {
	if (!firebase.apps.length) {
		firebase.initializeApp(firebaseConfig)
	}
}

initFirebase()

export { firebase }
