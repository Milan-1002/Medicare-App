const express = require('express');
const router = express.Router();
const db = require('../models/database');

// Get dashboard statistics
router.get('/stats', (req, res) => {
  db.getDashboardStats((err, stats) => {
    if (err) {
      console.error('Error fetching dashboard stats:', err);
      return res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
    }
    
    res.json(stats);
  });
});

// Get today's reminders
router.get('/reminders/today', (req, res) => {
  db.getTodayReminders((err, reminders) => {
    if (err) {
      console.error('Error fetching today\'s reminders:', err);
      return res.status(500).json({ error: 'Failed to fetch today\'s reminders' });
    }
    
    res.json(reminders);
  });
});

// Mark reminder as completed
router.post('/reminders/:id/complete', (req, res) => {
  const { id } = req.params;
  
  db.markReminderCompleted(id, function(err) {
    if (err) {
      console.error('Error marking reminder as completed:', err);
      return res.status(500).json({ error: 'Failed to mark reminder as completed' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Reminder not found' });
    }
    
    res.json({ message: 'Reminder marked as completed' });
  });
});

// Get greeting based on time of day
router.get('/greeting', (req, res) => {
  const hour = new Date().getHours();
  let greeting;
  
  if (hour < 12) {
    greeting = 'Good morning';
  } else if (hour < 17) {
    greeting = 'Good afternoon';
  } else {
    greeting = 'Good evening';
  }
  
  res.json({ greeting });
});

module.exports = router;