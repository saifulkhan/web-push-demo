/*jshint esversion: 8*/

const API_SERVER_URL = 'http://localhost:4000/subscription';
const VAPID_PUB_KEY = 'BDJMUrcGrQ-B8JEh9dtdGNLTjOblV4JyBKVA5a4G_E_FBR2H2nueWTPT6dwdyBSfNioGEAAu0jhjP0OQvcKLxZM';

// urlB64ToUint8Array is a magic function that will encode the base64 public key
// to Array buffer which is needed by the subscription option
const urlB64ToUint8Array = (base64String) => {
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


//
// Listener event handlers
//

// This will be called only once when the service worker is installed for first time.
self.addEventListener("install", (event) => {
  console.log('service-worker.js: install ->');
});

// This will be called only once when the service worker is activated.
self.addEventListener('activate', async () => {
  console.log('service-worker.js: activate ->');

  const applicationServerKey = urlB64ToUint8Array(VAPID_PUB_KEY);
  const options = {
    applicationServerKey,
    userVisibleOnly: true
  };

  try {
    const subscription = await self.registration.pushManager.subscribe(options);
    const response = await fetch(API_SERVER_URL, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(subscription)
    });

    console.log('service-worker.js: activate -> subscription = ', JSON.stringify(subscription));
  } catch (err) {
    console.log('service-worker.js: activate -> error = ', err);
  }
});


// This will be called when data is received
self.addEventListener("push", (event) => {
  console.log('service-worker.js: push ->');

  if (event.data) {
    showLocalNotification("Notification Received", event.data.text(), self.registration);
    console.log('service-worker.js: push -> data = ', event.data.text());
  } else {
    console.log('service-worker.js: push -> data = ');
  }
});



function showLocalNotification(title, body, swRegistration) {
  const options = {
    body
    // here you can add more properties like icon, image, vibrate, etc.
  };
  swRegistration.showNotification(title, options);
}