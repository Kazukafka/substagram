import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyCCBZsbDBDvMv0lJ8JZNjhuvCIMuKzzA7M",
  authDomain: "substagram-203ab.firebaseapp.com",
  projectId: "substagram-203ab",
  storageBucket: "substagram-203ab.appspot.com",
  messagingSenderId: "811762643919",
  appId: "1:811762643919:web:106b7cacb48891ecd318ba",
  measurementId: "G-1PB9GKMGX4"
})

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
