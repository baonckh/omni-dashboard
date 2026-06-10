import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDLFfLJvXnehrovdg_xVK6CMN899HFzMSI",
  authDomain: "omni-ai-745ac.firebaseapp.com",
  projectId: "omni-ai-745ac",
  storageBucket: "omni-ai-745ac.firebasestorage.app",
  messagingSenderId: "526789618041",
  appId: "1:526789618041:web:4041f704d5862e419827a8",
};

const app = firebase.apps.length === 0 ? firebase.initializeApp(firebaseConfig) : firebase.app();
const auth = firebase.auth(app);
const googleProvider = new firebase.auth.GoogleAuthProvider();

export async function signInWithGoogle(): Promise<string | null> {
  try {
    const result = await auth.signInWithPopup(googleProvider);
    const idToken = await result.user?.getIdToken();
    return idToken ?? null;
  } catch (error: unknown) {
    const code = error && typeof error === "object" && "code" in error ? error.code : null;
    if (code === "auth/popup-closed-by-user") return null;
    if (code === "auth/cancelled-popup-request") return null;
    console.error("[FIREBASE] Google sign-in error:", error);
    return null;
  }
}

export { auth };
