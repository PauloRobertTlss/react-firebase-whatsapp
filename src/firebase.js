import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAmVgCTgYzmyPYMQqxqu66RquoORzULu28",
  authDomain: "whatsappmba-33c7b.firebaseapp.com",
  projectId: "whatsappmba-33c7b",
  storageBucket: "whatsappmba-33c7b.appspot.com",
  messagingSenderId: "562341503336",
  appId: "1:562341503336:web:ab723bc8351535f40676dd"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;
