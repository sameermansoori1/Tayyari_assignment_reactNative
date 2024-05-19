import firebase from "firebase/compat/app";
import 'firebase/compat/firestore';

const firebaseConfig={
    apiKey: "AIzaSyCM2Pd64GC4WF2HO_nF7iM17hMwnAobi-8",
  authDomain: "tayyari-assignment-reactnative.firebaseapp.com",
  projectId: "tayyari-assignment-reactnative",
  storageBucket: "tayyari-assignment-reactnative.appspot.com",
  messagingSenderId: "131958401537",
  appId: "1:131958401537:web:04b06e57a19bb42b282e00",
  measurementId: "G-S53KWMDVSV"
}

if (!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}

export { firebase };