import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// Config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyChF7yp-2ZGCzheMxT0LxvXXJ10EnOlFk0",
  authDomain: "fpttickethub.firebaseapp.com",
  projectId: "fpttickethub",
  storageBucket: "fpttickethub.appspot.com",
  messagingSenderId: "732153710958",
  appId: "1:732153710958:web:56d129fe6e9cbfb564197f"
};

// Firebase initial
const app = initializeApp(firebaseConfig);

// Initial Firebase Storage
const storage = getStorage(app);

export { storage };
