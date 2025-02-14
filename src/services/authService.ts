import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { UserRole } from "@/types/firebase.types";

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
    const userData = userDoc.data();
    return {
      id: userCredential.user.uid,
      email: userCredential.user.email,
      role: userData?.role as UserRole,
    };
  } catch (error) {
    throw error;
  }
};

export const signUp = async (email: string, password: string, role: UserRole) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email: email,
      role: role,
    });
    return {
      id: userCredential.user.uid,
      email: userCredential.user.email,
      role: role,
    };
  } catch (error) {
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};
