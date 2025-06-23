import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA-z0NP-wiSA1y-EuLZFjLAiedJJHWZKdg",
  authDomain: "christiananddimitra.firebaseapp.com",
  projectId: "christiananddimitra",
  storageBucket: "christiananddimitra.firebasestorage.app",
  messagingSenderId: "418992035856",
  appId: "1:418992035856:web:4e5265046333d9691d5295",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
