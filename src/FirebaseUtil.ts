import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

import {
  getAuth,
  signInWithPopup,
  getRedirectResult,
  GoogleAuthProvider,
  User,
} from "firebase/auth";

const app = initializeApp({
  apiKey: "AIzaSyBlpexurl1JFu9Mu-J8pi3OD86H5TPh2Ug",
  authDomain: "maisigrejas-309914.firebaseapp.com",
  databaseURL: "https://maisigrejas-309914-default-rtdb.firebaseio.com",
  projectId: "maisigrejas-309914",
  storageBucket: "maisigrejas-309914.appspot.com",
  messagingSenderId: "682672102837",
  appId: "1:682672102837:web:5ea915d3daa93e57200dfc",
  measurementId: "G-LTS3C092TY",
});

const database = getDatabase(app);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();

async function getUser(): Promise<User | null> {
  const credential = await getRedirectResult(auth);

  if (credential) return credential.user;

  return null;
}

async function signIn(): Promise<User> {
  const credential = await signInWithPopup(auth, provider);
  return credential.user;
}

async function signOut(): Promise<void> {
  if (auth.currentUser) {
    return auth.signOut();
  }
}

export { database, auth, signIn, signOut, getUser };
