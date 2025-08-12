// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
firebase.initializeApp({
  apiKey: "AIzaSyC4gVCVBuL83FyVgR2DFZF0HYPrnF-h-aE",
  authDomain: "mostasmer-c0ad8.firebaseapp.com",
  projectId: "mostasmer-c0ad8",
  storageBucket: "mostasmer-c0ad8.firebasestorage.app",
  messagingSenderId: "889356531778",
  appId: "1:889356531778:web:4ffb743522434f2a1ed5db",
  measurementId: "G-JSKHHMYGGJ",
  // Note: measurementId is not needed for messaging
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

// Add this to ensure the service worker stays active
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message:", {
    title: payload.notification.title,
    body: payload.notification.body,
    data: payload.data,
  });

  const notificationTitle = payload.notification.title || "New Notification";
  const notificationOptions = {
    body: payload.notification.body || "You have a new notification",
    icon: "/favicon.ico",
    badge: "/badge-icon.png",
    tag: payload.data?.tag || "default",
    data: payload.data,
    requireInteraction: true,
    vibrate: [200, 100, 200],
    silent: false, // Ensure notification makes sound
    renotify: false, // Always notify even if same tag
    actions: [
      {
        action: "open",
        title: "Open App",
      },
      {
        action: "close",
        title: "Dismiss",
      },
    ],
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  console.log(
    "[firebase-messaging-sw.js] Notification clicked:",
    event.notification.title
  );

  event.notification.close();

  if (event.action === "open" || !event.action) {
    const urlToOpen = event.notification.data?.route || "";
    const origin = self.location.origin;

    const fullUrl = urlToOpen
      ? `/${urlToOpen}`.replace(/\/+/g, "/")
      : `${origin}/`;

    clients.openWindow(fullUrl);
  }
});
