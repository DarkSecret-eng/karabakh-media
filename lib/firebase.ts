import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBoiduHbsYAQFsUFcxVBAoUAJO0y3lqsUA",
  authDomain: "karabakh-media.firebaseapp.com",
  projectId: "karabakh-media",
  storageBucket: "karabakh-media.firebasestorage.app",
  messagingSenderId: "15050172462",
  appId: "1:15050172462:web:3cadb8a6e517fac0c157bf",
  measurementId: "G-RTZTNHHYHK"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
