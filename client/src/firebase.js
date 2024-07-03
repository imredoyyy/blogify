// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blogify-3989e.firebaseapp.com",
  projectId: "blogify-3989e",
  storageBucket: "blogify-3989e.appspot.com",
  messagingSenderId: "810499597974",
  appId: "1:810499597974:web:1bb505dfccef90689004b7",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
