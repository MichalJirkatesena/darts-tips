// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDEQHkG48bT_hucEuwVYwbzdArLzMFdMB8",
  authDomain: "darts-tips.firebaseapp.com",
  databaseURL: "https://darts-tips-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "darts-tips",
  storageBucket: "darts-tips.firebasestorage.app",
  messagingSenderId: "594538166952",
  appId: "1:594538166952:web:47a2b73063422f5567e09d",
  measurementId: "G-G3JPH3SKHD"
};


const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);