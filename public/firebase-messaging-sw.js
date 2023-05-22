/* eslint-disable no-undef */

importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts(
    'https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js'
);

firebase.initializeApp({
    apiKey: 'AIzaSyCANqO6D4SlhG1CrGRksD3p2SIA4Pg-nX8',
    authDomain: 'health-circles-bf71b.firebaseapp.com',
    projectId: 'health-circles-bf71b',
    storageBucket: 'health-circles-bf71b.appspot.com',
    messagingSenderId: '470834296777',
    appId: '1:470834296777:web:8947c4648082386d5c5a18',
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
firebase.messaging();