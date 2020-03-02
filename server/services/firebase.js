// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
const firebase = require('firebase/app')


// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");

const firebaseConfig = require('./firebase_config')

firebase.initializeApp(firebaseConfig)
firebase.analytics();

module.exports = firebase