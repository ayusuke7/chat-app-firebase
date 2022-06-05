import { FirebaseApp, initializeApp } from "firebase/app";
import { Database, getDatabase } from "firebase/database";
import {
  User,
  Auth,
  getAuth,
  signInWithPopup,
  getRedirectResult,
  GoogleAuthProvider,
} from "firebase/auth";

const app: FirebaseApp = initializeApp({
  apiKey: "AIzaSyBlpexurl1JFu9Mu-J8pi3OD86H5TPh2Ug",
  authDomain: "maisigrejas-309914.firebaseapp.com",
  databaseURL: "https://maisigrejas-309914-default-rtdb.firebaseio.com",
  projectId: "maisigrejas-309914",
  storageBucket: "maisigrejas-309914.appspot.com",
  messagingSenderId: "682672102837",
  appId: "1:682672102837:web:5ea915d3daa93e57200dfc",
  measurementId: "G-LTS3C092TY",
});

class FirebaseUtils {
  private provider = new GoogleAuthProvider();
  public database: Database;
  public auth: Auth;

  constructor() {
    this.auth = getAuth(app);
    this.database = getDatabase(app);
  }

  async getUser(): Promise<User | null> {
    const credential = await getRedirectResult(this.auth);

    if (credential) return credential.user;

    return null;
  }

  async signIn(): Promise<User> {
    const credential = await signInWithPopup(this.auth, this.provider);
    return credential.user;
  }

  async signOut(): Promise<void> {
    if (this.auth.currentUser) {
      return this.auth.signOut();
    }
  }
}

export default new FirebaseUtils();
