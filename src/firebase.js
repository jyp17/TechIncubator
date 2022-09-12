import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB793QFAjYLwlxVZCHuxfsvza1SMemM8wY",
  authDomain: "tech-incubator-8f501.firebaseapp.com",
  projectId: "tech-incubator-8f501",
  storageBucket: "tech-incubator-8f501.appspot.com",
  messagingSenderId: "233356350540",
  appId: "1:233356350540:web:15f3be1b08d5b07b3ed0e9"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);