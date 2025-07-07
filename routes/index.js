const express = require('express');
const router = express.Router();

// Main routes
router.get('/', (req, res) => {
  res.render('index', { 
    title: 'MediCare - Medication Reminder',
    page: 'home'
  });
});

router.get('/dashboard', (req, res) => {
  res.render('dashboard', { 
    title: 'Dashboard - MediCare',
    page: 'dashboard'
  });
});

router.get('/medicines', (req, res) => {
  res.render('medicines', { 
    title: 'My Medicines - MediCare',
    page: 'medicines'
  });
});

router.get('/add-medicine', (req, res) => {
  res.render('add-medicine', { 
    title: 'Add Medicine - MediCare',
    page: 'add-medicine'
  });
});

router.get('/ai-assistant', (req, res) => {
  res.render('ai-assistant', { 
    title: 'AI Assistant - MediCare',
    page: 'ai-assistant'
  });
});

router.get('/notifications', (req, res) => {
  res.render('notifications', { 
    title: 'Notifications - MediCare',
    page: 'notifications'
  });
});

module.exports = router;