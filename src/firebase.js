import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

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
