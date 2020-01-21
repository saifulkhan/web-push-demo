import express from 'express'
import webpush from 'web-push';
import bodyParser from 'body-parser';
import * as path from 'path';
import cors from 'cors';

import config from 'config';

const app = express();

app.use(cors());
app.use(bodyParser.json());

const port = 4000

// Test the server
app.get('/health', (req, res) => res.send('Up and running!'))

const dummyDb = { subscription: null } //dummy in memory store
const saveToDatabase = async (subscription: any) => {
  // Since this is a demo app, I am going to save this in a dummy in memory store. Do not do this in your apps.
  // Here you should be writing your db logic to save it.
  dummyDb.subscription = subscription
}

// The new save subscription endpoint
app.post('/subscription', async (req, res) => {
  const subscription = req.body
  console.log('/subscription: subscription = ', subscription);

  // She subscription to database as needed when notification will be sent.
  await saveToDatabase(subscription)

  res.json({ message: 'success', key: vapidKeys.publicKey })
});

// Setting our previously generated VAPID keys

const vapidKeys = {
  publicKey: 'BDJMUrcGrQ-B8JEh9dtdGNLTjOblV4JyBKVA5a4G_E_FBR2H2nueWTPT6dwdyBSfNioGEAAu0jhjP0OQvcKLxZM',
  privateKey: 'fLumBoxWfLxnobMPLQ4ODnzmKF4XJJJ5UwRMooig9Mw',
}

// const vapidKeys = webpush.generateVAPIDKeys();

webpush.setVapidDetails(
  'mailto:saiful.etc@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
)

// Test send notification
// Send notification
app.get('/send-notification', (req, res) => {
  const subscription = dummyDb.subscription // get subscription from your databse here.
  const message = 'Hello World!'
  sendNotification(subscription, message)
  res.json({ message: 'message sent' })
})

//function to send the notification to the subscribed device
function sendNotification(subscription: any, dataToSend: string) {
  webpush.sendNotification(subscription, dataToSend)
}


app.listen(port, () => console.log(`Example app listening on port ${port}!`))