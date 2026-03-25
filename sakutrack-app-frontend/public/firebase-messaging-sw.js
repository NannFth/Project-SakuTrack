importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyA2R6Nwlaj8AVBT8db27977nBJPxAbB-4M",
  authDomain: "sakutrack-f977a.firebaseapp.com",
  projectId: "sakutrack-f977a",
  storageBucket: "sakutrack-f977a.firebasestorage.app",
  messagingSenderId: "630551171385",
  appId: "1:630551171385:web:4cf544484305a868a118e8"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Notifikasi background diterima:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/vite.svg'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});