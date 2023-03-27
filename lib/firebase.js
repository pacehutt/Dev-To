import { initializeApp } from "@firebase/app";
import firebase from "firebase/compat/app";
import { getStorage, ref } from "@firebase/storage";
import {
  getDoc,
  getDocs,
  getFirestore,
  limit,
  Timestamp,
} from "@firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { collection, query, where } from "firebase/firestore";
import { serverTimestamp as st } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBpruht-9lxhE2YBmvQNvFenqU4cs_4N-U",
  authDomain: "dev-to-pacehut.firebaseapp.com",
  projectId: "dev-to-pacehut",
  storageBucket: "dev-to-pacehut.appspot.com",
  messagingSenderId: "928638982170",
  appId: "1:928638982170:web:8180e7812b931b8ec399a3",
  measurementId: "G-FCZT6NNGS6",
};

if (!firebase.apps.length) {
  initializeApp(firebaseConfig);
}

export const googleAuthProvider = new GoogleAuthProvider();

export const auth = getAuth();

// Create a root reference

export const storage = getStorage();
export const db = getFirestore();

export async function getUserWithUsername(username) {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("username", "==", username), limit(1));
  const userDoc = (await getDocs(q)).docs[0];
  return userDoc;
}

export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data?.createdAt.toMillis() || 0,
    updatedAt: data?.updatedAt.toMillis() || 0,
  };
}

export const serverTimestamp = st;
export const fromMillis = Timestamp.fromMillis;
