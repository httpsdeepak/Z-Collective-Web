/**
 * Z Collective Pvt Ltd - Firebase Cloud Integration Config
 * Configured for Z Collective NewsAgency project.
 */

const firebaseConfig = {
    apiKey: "AIzaSyCmw2-5oVXLrudEfEu4gAuRRdAzHN4t30g",
    authDomain: "z-collective-newsagency.firebaseapp.com",
    projectId: "z-collective-newsagency",
    storageBucket: "z-collective-newsagency.firebasestorage.app",
    messagingSenderId: "582405221972",
    appId: "1:582405221972:web:84da93efc877fb0851c7c1"
};

let isFirebaseEnabled = false;
let db = null;
let storageRef = null;

try {
    if (typeof firebase !== 'undefined' && firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY") {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        storageRef = firebase.storage();
        isFirebaseEnabled = true;
        console.log("✅ Firebase Cloud Storage & Database Initialized Successfully for Z Collective NewsAgency!");
    } else {
        console.log("ℹ️ Firebase credentials not set. Running in browser LocalStorage fallback mode.");
    }
} catch (e) {
    console.warn("⚠️ Firebase initialization notice:", e.message);
    isFirebaseEnabled = false;
}
