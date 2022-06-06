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
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_IT,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
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
