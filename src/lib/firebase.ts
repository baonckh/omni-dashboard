import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDLFfLJvXnehrovdg_xVK6CMN899HFzMSI",
  authDomain: "omni-ai-745ac.firebaseapp.com",
  projectId: "omni-ai-745ac",
  storageBucket: "omni-ai-745ac.firebasestorage.app",
  messagingSenderId: "526789618041",
  appId: "1:526789618041:web:4041f704d5862e419827a8",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle(): Promise<string | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();
    return idToken;
  } catch (error: any) {
    if (error?.code === "auth/popup-closed-by-user") return null;
    if (error?.code === "auth/cancelled-popup-request") return null;
    console.error("[FIREBASE] Google sign-in error:", error);
    return null;
  }
}

export { auth };
