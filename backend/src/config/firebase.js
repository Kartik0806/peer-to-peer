import { initializeApp } from "firebase/app";
import admin from "firebase-admin";
// import serviceAccount from "./firebaseService.json" assert { type: "json" };

const serviceAccountPath = '/etc/secrets/firebaseService.json';
import {
    getAuth,
} from "firebase/auth";

import dotenv from "dotenv";
dotenv.config();


admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
});

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export {
    auth,
    admin
};
