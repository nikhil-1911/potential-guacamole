// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {initializeAuth, getReactNativePersistence} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, Timestamp, arrayUnion } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAsYryq-ib9iNB9nH3iIsT_VC_Wt4aajxE",
  authDomain: "movie-6b79b.firebaseapp.com",
  projectId: "movie-6b79b",
  storageBucket: "movie-6b79b.firebasestorage.app",
  messagingSenderId: "433746048985",
  appId: "1:433746048985:web:4b2c4bef0b00e58d578bc8",
  measurementId: "G-SZYFKX4S0H"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export { Timestamp, arrayUnion };