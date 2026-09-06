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

const firebaseConfig = {
  apiKey: "AIzaSyCuexcR7Fc-H-H2bOR6TnVcGQU5XS_OGnY",
  authDomain: "bill-splitter-tracker.firebaseapp.com",
  databaseURL: "https://bill-splitter-tracker-default-rtdb.firebaseio.com",
  projectId: "bill-splitter-tracker",
  storageBucket: "bill-splitter-tracker.firebasestorage.app",
  messagingSenderId: "961216833885",
  appId: "1:961216833885:web:92447ce7bf81ddd377a0b4",
  measurementId: "G-H8CT2B3L2L"
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
