// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
// import "firebase/firestore";
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDpjZKhQvvUpNvRNa22knWpnfYjYFHjncE",
  authDomain: "nomination-whist-f2997.firebaseapp.com",
  projectId: "nomination-whist-f2997",
  storageBucket: "nomination-whist-f2997.appspot.com",
  messagingSenderId: "1085691363712",
  appId: "1:1085691363712:web:f466c99f5b804057d08165"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
// initializeApp(firebaseConfig);



// const db = getFirestore();
const db = getFirestore(app);
// let thing = collection(db, "round-data")

// const docRef = addDoc(thing, {name: "james"})

export default db;