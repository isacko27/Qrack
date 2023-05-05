import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-Yt8cVo-JNgh9451OBhry7BOEe_4ryAU",
  authDomain: "qrcodegenerator-8083f.firebaseapp.com",
  projectId: "qrcodegenerator-8083f",
  storageBucket: "qrcodegenerator-8083f.appspot.com",
  messagingSenderId: "320290904805",
  appId: "1:320290904805:web:1b0988b217a1cb1f05520c",
  measurementId: "G-KYX8BJGV2P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, app};