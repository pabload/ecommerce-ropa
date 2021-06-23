import * as firebase from  'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const app = firebase.initializeApp({
    apiKey: "AIzaSyBsH3YXxiMBtxvPX2tWk9nmBSZMHBYNkZc",
    authDomain: "bd-ecommerce-ropa.firebaseapp.com",
    databaseURL: "https://bd-ecommerce-ropa.firebaseio.com",
    projectId: "bd-ecommerce-ropa",
    storageBucket: "bd-ecommerce-ropa.appspot.com",
    messagingSenderId: "375116391304",
    appId: "1:375116391304:web:2915764d30305c04c8103d",
    measurementId: "G-KZSLK6Y2V4"

})
const emailAuthProvider = new firebase.auth.EmailAuthProvider();
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
const db = app.firestore();
const storage = app.storage();
const auth = app.auth();
export {emailAuthProvider,db,storage,auth}