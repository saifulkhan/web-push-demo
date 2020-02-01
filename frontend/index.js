/*jshint esversion: 8 */

let serviceWorker;
let permission;



async function init() {
  console.log('Init');

  // Step 1: Check browser support
  checkBrowserSupport();

  // Step 2: Request for permission - pop-up a notification in browser asking for allowing permission for showing notification
  permission = await requestNotificationPermission();
  console.log('Init: permission = ', permission);

  // Step 3: Register service worker
  if (permission === 'granted') {
    //window.addEventListener('load', async () => {
    serviceWorker = await registerServiceWorker();
    //});
  }
}


function checkBrowserSupport() {
  if (!("serviceWorker" in navigator)) {
    throw new Error("No Service Worker support!");
  }
  if (!("PushManager" in window)) {
    throw new Error("No Push API Support!");
  }
}

async function registerServiceWorker() {
  const serviceWorker = await navigator.serviceWorker.register('./service-worker.js');
  console.log('index.js: init(): serviceWorker = ', serviceWorker);
  return serviceWorker;

}

async function requestNotificationPermission() {
  const permission = await window.Notification.requestPermission();
  // value of permission can be 'granted', 'default', 'denied'
  // granted: user has accepted the request
  // default: user has dismissed the notification permission popup by clicking on x
  // denied: user has denied the request.
  if (permission !== "granted") {
    throw new Error("Permission not granted for Notification");
  }
  return permission;
}