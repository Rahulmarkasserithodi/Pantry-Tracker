// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkx2zNCYKFgZkxs_HBMyGjNXIqn_AR6Ug",
  authDomain: "rmpantryapp.firebaseapp.com",
  projectId: "rmpantryapp",
  storageBucket: "rmpantryapp.appspot.com",
  messagingSenderId: "325811769774",
  appId: "1:325811769774:web:29d1bcd468bd0b425cb83f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { app, firestore };
