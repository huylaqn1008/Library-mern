// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "library-mern-963b9.firebaseapp.com",
    projectId: "library-mern-963b9",
    storageBucket: "library-mern-963b9.appspot.com",
    messagingSenderId: "910783534622",
    appId: "1:910783534622:web:6613c4d0a4abf3f4ae800f"
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)