import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCjiP3PeMAddHf4hm3iMvRxlSf-nEQ_hR4",
    authDomain: "pets-d53ec.firebaseapp.com",
    projectId: "pets-d53ec",
    storageBucket: "pets-d53ec.appspot.com",
    messagingSenderId: "586476947275",
    appId: "1:586476947275:web:486b9b055175ef501a0ace"
  };
  export const firebaseApp = firebase.initializeApp(firebaseConfig);