// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyALRl49n68TQ4wnKU2pLY22D9I7QPkQdK8",
  authDomain: "phonehaven-ee773.firebaseapp.com",
  projectId: "phonehaven-ee773",
  storageBucket: "phonehaven-ee773.firebasestorage.app",
  messagingSenderId: "518285665801",
  appId: "1:518285665801:web:8552e4aa270ce1d779bad8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };
