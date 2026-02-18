import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth";
import { getFirebaseAuth } from "./config";

const googleProvider = new GoogleAuthProvider();

export async function signInWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(getFirebaseAuth(), email, password);
}

export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string,
) {
  const credential = await createUserWithEmailAndPassword(
    getFirebaseAuth(),
    email,
    password,
  );
  await updateProfile(credential.user, { displayName });
  return credential;
}

export async function signInWithGoogle() {
  return signInWithPopup(getFirebaseAuth(), googleProvider);
}

export async function signOut() {
  return firebaseSignOut(getFirebaseAuth());
}
