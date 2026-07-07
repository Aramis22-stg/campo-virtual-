// Configuración de Firebase (Portal del Estudiante ST)
const firebaseConfig = {
  apiKey: "AIzaSyBH3Bwr3bBRO0nAajdRrs0b0BMhvVB8HeY",
  authDomain: "aramis-68245.firebaseapp.com",
  databaseURL: "https://aramis-68245-default-rtdb.firebaseio.com",
  projectId: "aramis-68245",
  storageBucket: "aramis-68245.firebasestorage.app",
  messagingSenderId: "796058541482",
  appId: "1:796058541482:web:089ec9e3022f54fe921fd3"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();