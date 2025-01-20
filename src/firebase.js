import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyDQJzLxcFNlVLLrAM2Q3hSQ4XXhvXOkbzk",
//   authDomain: "react-blog-c4bc8.firebaseapp.com",
//   projectId: "react-blog-c4bc8",
//   storageBucket: "react-blog-c4bc8.firebasestorage.app",
//   // storageBucket: "react-blog-c4bc8.appspot.com",
//   messagingSenderId: "1011372741332",
//   appId: "1:1011372741332:web:6b0ca9e23e8aa9d8356141",
// };

const firebaseConfig = {
  apiKey: "AIzaSyCkpJAA33RO2oZ8TnQifJeWFQd1REK6Mm8",
  authDomain: "react-blog-app-c9c57.firebaseapp.com",
  projectId: "react-blog-app-c9c57",
  storageBucket: "react-blog-app-c9c57.firebasestorage.app",
  messagingSenderId: "181138401911",
  appId: "1:181138401911:web:555d6fd85008daffbcf472",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
