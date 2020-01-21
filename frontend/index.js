/*jshint esversion: 8 */

// Step 1: Check browser support
const checkBrowserSupport = () => {
  if (!("serviceWorker" in navigator)) {
    throw new Error("No Service Worker support!");
  }
  if (!("PushManager" in window)) {
    throw new Error("No Push API Support!");
  }
};

// Step -2: Register service worker
const registerServiceWorker = async () => {
  const swRegistration = await navigator.serviceWorker.register("service.js");
  return swRegistration;
};

// Step 3: Request for permission - pop-up a notification in browser asking for allowing permission for showing notification
const requestNotificationPermission = async () => {
  const permission = await window.Notification.requestPermission();
  // value of permission can be 'granted', 'default', 'denied'
  // granted: user has accepted the request
  // default: user has dismissed the notification permission popup by clicking on x
  // denied: user has denied the request.
  if (permission !== "granted") {
    throw new Error("Permission not granted for Notification");
  }
  return permission;
};

// Step 4: Show a local notification, just for test purpose
const showLocalNotification = (title, body, swRegistration) => {
  const options = {
      body,
      // here you can add more properties like icon, image, vibrate, etc.
  };
  swRegistration.showNotification(title, options);
};

const onClickAskPermission = async () => {
  console.log('index.js: onClickAskPermission:');
  
  checkBrowserSupport();
  const swRegistration = await registerServiceWorker();
  const permission = await requestNotificationPermission();

  console.log('index.js: onClickAskPermission: permission = ', permission);
  showLocalNotification('Local Notification', 'Permission ' + permission, swRegistration);
}
