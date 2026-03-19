import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA2R6Nwlaj8AVBT8db27977nBJPxAbB-4M",
  authDomain: "sakutrack-f977a.firebaseapp.com",
  projectId: "sakutrack-f977a",
  storageBucket: "sakutrack-f977a.firebasestorage.app",
  messagingSenderId: "630551171385",
  appId: "1:630551171385:web:4cf544484305a868a118e8",
  measurementId: "G-7H105BBEVG"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);