import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBHAHPy4Hm7uMNXunI8ppr6Do4qMjsEQU8",
    authDomain: "libelo-feaf8.firebaseapp.com",
    projectId: "libelo-feaf8",
    storageBucket: "libelo-feaf8.firebasestorage.app",
    messagingSenderId: "1007947959455",
    appId: "1:1007947959455:web:dfa9f6db215028af0626aa",
    measurementId: "G-0JJTL1EZF0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
export { auth, googleProvider, signInWithPopup };
