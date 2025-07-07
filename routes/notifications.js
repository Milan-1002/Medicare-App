const express = require('express');
const router = express.Router();
const webpush = require('web-push');

// Configure web push (you'll need to generate VAPID keys)
const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY || 'YOUR_PUBLIC_VAPID_KEY_HERE',
  privateKey: process.env.VAPID_PRIVATE_KEY || 'YOUR_PRIVATE_VAPID_KEY_HERE'
};

// Only set VAPID details if we have valid keys
if (vapidKeys.publicKey !== 'YOUR_PUBLIC_VAPID_KEY_HERE' && vapidKeys.privateKey !== 'YOUR_PRIVATE_VAPID_KEY_HERE') {
  try {
    webpush.setVapidDetails(
      'mailto:your-email@example.com',
      vapidKeys.publicKey,
      vapidKeys.privateKey
    );
  } catch (error) {
    console.warn('VAPID configuration failed:', error.message);
  }
}

// Store subscriptions (in production, use database)
const subscriptions = [];

// Subscribe to notifications
router.post('/subscribe', (req, res) => {
  const subscription = req.body;
  
  // Store subscription
  subscriptions.push(subscription);
  
  res.status(201).json({ message: 'Subscription added successfully' });
});

// Send notification
router.post('/send', (req, res) => {
  const { title, message, icon } = req.body;
  
  const notificationPayload = {
    title: title || 'MediCare Reminder',
    message: message || 'Time to take your medicine',
    icon: icon || '/images/pill-icon.png',
    badge: '/images/badge-icon.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  
  // Check if web-push is properly configured
  if (vapidKeys.publicKey === 'YOUR_PUBLIC_VAPID_KEY_HERE') {
    return res.status(400).json({ 
      error: 'Web push notifications not configured. Please set up VAPID keys.' 
    });
  }
  
  const promises = subscriptions.map(subscription => {
    return webpush.sendNotification(subscription, JSON.stringify(notificationPayload))
      .catch(error => {
        console.error('Error sending notification:', error);
      });
  });
  
  Promise.all(promises)
    .then(() => res.json({ message: 'Notifications sent successfully' }))
    .catch(error => {
      console.error('Error sending notifications:', error);
      res.status(500).json({ error: 'Failed to send notifications' });
    });
});

// Get VAPID public key
router.get('/vapid-public-key', (req, res) => {
  res.json({ publicKey: vapidKeys.publicKey });
});

// Test notification endpoint
router.post('/test', (req, res) => {
  const testNotification = {
    title: 'Test Notification',
    message: 'This is a test notification from MediCare',
    icon: '/images/pill-icon.png'
  };
  
  req.body = testNotification;
  
  // Call the send notification endpoint
  const sendRouter = require('./notifications');
  sendRouter.handle(req, res);
});

module.exports = router;