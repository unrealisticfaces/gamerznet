import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDJdkb1N-4B9nxEwYNevVzPLpmIygj0Gs0",
  authDomain: "gamerz-2d159.firebaseapp.com",
  databaseURL: "https://gamerz-2d159-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "gamerz-2d159",
  storageBucket: "gamerz-2d159.firebasestorage.app",
  messagingSenderId: "142970861175",
  appId: "1:142970861175:web:b3aef3f7d4184d8f12b872"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);