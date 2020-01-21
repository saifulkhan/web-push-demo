/*jshint esversion: 8*/

const API_SERVER_URL = 'http://localhost:4000/subscription';
const VAPID_PUB_KEY = 'BDJMUrcGrQ-B8JEh9dtdGNLTjOblV4JyBKVA5a4G_E_FBR2H2nueWTPT6dwdyBSfNioGEAAu0jhjP0OQvcKLxZM';

// urlB64ToUint8Array is a magic function that will encode the base64 public key
// to Array buffer which is needed by the subscription option
const urlB64ToUint8Array = base64String => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const saveSubscription = async subscription => {
  const response = await fetch(API_SERVER_URL, {
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(subscription)
  });
  return response.json();
};

//
// Listener event handlers
//

// This will be called only once when the service worker is installed for first time.
self.addEventListener("install", async () => {
  try {
    const applicationServerKey = urlB64ToUint8Array(VAPID_PUB_KEY);
    const options = {
      applicationServerKey,
      userVisibleOnly: true
    };
    const subscription = await self.registration.pushManager.subscribe(options);
    const response = await saveSubscription(subscription);
    console.log('service.js: addEventListener install, response = ', response);
  } catch (err) {
    console.log("Error", err);
  }
});

// This will be called only once when the service worker is activated.
self.addEventListener('activate', async () => {
  try {
    const options = {};
    const subscription = await self.registration.pushManager.subscribe(options);
    console.log('service.js: addEventListener activate, subscription = ', JSON.stringify(subscription));
  } catch (err) {
    console.log('Error', err);
  }
});

const showLocalNotification = (title, body, swRegistration) => {
  const options = {
    body
    // here you can add more properties like icon, image, vibrate, etc.
  };
  swRegistration.showNotification(title, options);
};

// This will be called when data is received
self.addEventListener("push", (event) => {
  if (event.data) {
    console.log("service.js: Push notification received, data = ", event.data.text());
    showLocalNotification("Notification Received", event.data.text(), self.registration);
  } else {
    console.log("service.js: Push notification received, but no data.");
  }
});