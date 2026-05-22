
import { initializeApp } from "firebase/app";
import { getAuth,GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "authenticationprepai.firebaseapp.com",
  projectId: "authenticationprepai",
  storageBucket: "authenticationprepai.firebasestorage.app",
  messagingSenderId: "44599066458",
  appId: "1:44599066458:web:d62d140c5527ba42383d63"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const  provider = new GoogleAuthProvider();

export {auth,provider}