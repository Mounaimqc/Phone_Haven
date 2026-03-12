// Phone Haven - Firebase Configuration
// Uses CDN imports — compatible with browser ES modules (no bundler needed)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
export const db = getFirestore(app);
export default firebaseConfig;