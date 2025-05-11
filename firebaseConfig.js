// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from '@react-native-async-storage/async-storage'

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDRR5NNjskXkC401p2k5ybx95zEKllUU8M",
    authDomain: "chat-app-a27eb.firebaseapp.com",
    projectId: "chat-app-a27eb",
    storageBucket: "chat-app-a27eb.firebasestorage.app",
    messagingSenderId: "597871171682",
    appId: "1:597871171682:web:38bd3c872609241287d93b",
    measurementId: "G-NJ5MDEGNRJ"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp() ;

// Use `getAuth()` for initialization (prevents duplicate Auth initialization)
let auth;
if (!getApps().length) {
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
    });
} else {
    auth = getAuth(app); // ✅ Prevents reinitialization
}

// Initialize Firestore and Storage
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };