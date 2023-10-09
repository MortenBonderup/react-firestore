// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCv3pxK9GU5TIps92J4rO3jA2CKJsr4-Po",
  authDomain: "react-firestore-final.firebaseapp.com",
  projectId: "react-firestore-final",
  storageBucket: "react-firestore-final.appspot.com",
  messagingSenderId: "166982986776",
  appId: "1:166982986776:web:1422cd02bd059dbc7da76d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
