import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyAiMw7-ArfVmXP1w7jOqMbqFDuA1nDi3SY",
  authDomain: "rc-test-aa5e0.firebaseapp.com",
  projectId: "rc-test-aa5e0",
  storageBucket: "rc-test-aa5e0.appspot.com",
  messagingSenderId: "975171902098",
  appId: "1:975171902098:web:9821cdaf79b0bfe39c244b",
  measurementId: "G-NV4M9NVP2D"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);