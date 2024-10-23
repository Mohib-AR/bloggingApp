// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mernblog-bde33.firebaseapp.com",
  projectId: "mernblog-bde33",
  storageBucket: "mernblog-bde33.appspot.com",
  messagingSenderId: "826558631494",
  appId: "1:826558631494:web:0e158f2832fd86bea9c447",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
