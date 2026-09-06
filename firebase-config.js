// ── Firebase project setup ──────────────────────────────────────────────
// 1. Go to https://console.firebase.google.com → create a project (free tier is enough).
// 2. In the project, click the "</>" (web) icon to register a web app.
// 3. Copy the config object it gives you and paste the values below.
// 4. In the left sidebar enable:
//      • Build → Firestore Database → Create database (start in "production mode")
//      • Build → Authentication → Sign-in method → enable "Anonymous"
// 5. Deploy the security rules in firestore.rules (see README.md for the command).
//
// These values are safe to expose in client-side code — Firebase's real
// security boundary is the rules file, not this config object.

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDeVFEiDJc9-qVnpOPEqaZ0lEyMxkbRw6o",
  authDomain: "guest-invitation-list.firebaseapp.com",
  projectId: "guest-invitation-list",
  storageBucket: "guest-invitation-list.firebasestorage.app",
  messagingSenderId: "933420062418",
  appId: "1:933420062418:web:f5b60a963cf13863ddff0b",
  measurementId: "G-LX2BZKJ39H"
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
