const db = require('../models/database');

class NotificationService {
  constructor() {
    this.isRunning = false;
  }

  // Check for pending notifications
  checkPendingNotifications() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    
    try {
      // Get current date and time
      const now = new Date();
      const currentDate = now.toISOString().split('T')[0];
      const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);
      
      // Query for reminders that need to be sent
      const query = `
        SELECT r.*, m.name, m.dosage, m.type 
        FROM reminders r 
        JOIN medicines m ON r.medicineId = m.id 
        WHERE r.scheduledDate = ? 
        AND r.reminderTime = ? 
        AND r.isCompleted = 0 
        AND m.isActive = 1
      `;
      
      db.db.all(query, [currentDate, currentTime], (err, reminders) => {
        if (err) {
          console.error('Error checking pending notifications:', err);
          return;
        }
        
        // Process each reminder
        reminders.forEach(reminder => {
          this.sendNotification(reminder);
        });
        
        this.isRunning = false;
      });
    } catch (error) {
      console.error('Error in checkPendingNotifications:', error);
      this.isRunning = false;
    }
  }

  // Send notification
  sendNotification(reminder) {
    const notification = {
      title: 'MediCare Reminder',
      message: `Time to take your ${reminder.name} (${reminder.dosage})`,
      icon: '/images/pill-icon.png',
      badge: '/images/badge-icon.png',
      timestamp: new Date().toISOString()
    };
    
    // Log notification (in production, this would send to push service)
    console.log('Sending notification:', notification);
    
    // Store notification in database
    this.storeNotification(reminder, notification);
  }

  // Store notification in database
  storeNotification(reminder, notification) {
    const query = `
      INSERT INTO notifications (medicineId, title, message, scheduledTime, isSent)
      VALUES (?, ?, ?, ?, 1)
    `;
    
    db.db.run(query, [
      reminder.medicineId,
      notification.title,
      notification.message,
      new Date().toISOString()
    ], function(err) {
      if (err) {
        console.error('Error storing notification:', err);
      } else {
        console.log(`Notification stored for medicine ${reminder.name}`);
      }
    });
  }

  // Schedule daily reminders
  scheduleDailyReminders() {
    const today = new Date().toISOString().split('T')[0];
    
    // Get all active medicines
    db.getAllMedicines((err, medicines) => {
      if (err) {
        console.error('Error getting medicines for scheduling:', err);
        return;
      }
      
      medicines.forEach(medicine => {
        const times = JSON.parse(medicine.times);
        
        times.forEach(time => {
          // Check if reminder already exists for today
          const checkQuery = `
            SELECT COUNT(*) as count 
            FROM reminders 
            WHERE medicineId = ? AND scheduledDate = ? AND reminderTime = ?
          `;
          
          db.db.get(checkQuery, [medicine.id, today, time], (err, row) => {
            if (err) {
              console.error('Error checking existing reminders:', err);
              return;
            }
            
            if (row.count === 0) {
              // Add new reminder
              const insertQuery = `
                INSERT INTO reminders (medicineId, reminderTime, scheduledDate)
                VALUES (?, ?, ?)
              `;
              
              db.db.run(insertQuery, [medicine.id, time, today], function(err) {
                if (err) {
                  console.error('Error creating reminder:', err);
                } else {
                  console.log(`Reminder created for ${medicine.name} at ${time}`);
                }
              });
            }
          });
        });
      });
    });
  }

  // Get notification statistics
  getNotificationStats(callback) {
    const queries = {
      totalSent: 'SELECT COUNT(*) as count FROM notifications WHERE isSent = 1',
      todaysSent: 'SELECT COUNT(*) as count FROM notifications WHERE isSent = 1 AND date(scheduledTime) = date("now")',
      pendingReminders: 'SELECT COUNT(*) as count FROM reminders WHERE isCompleted = 0 AND scheduledDate = date("now")'
    };
    
    const stats = {};
    let completed = 0;
    const total = Object.keys(queries).length;
    
    Object.keys(queries).forEach(key => {
      db.db.get(queries[key], (err, row) => {
        if (err) {
          console.error(`Error getting ${key}:`, err);
          return;
        }
        
        stats[key] = row.count;
        completed++;
        
        if (completed === total) {
          callback(null, stats);
        }
      });
    });
  }

  // Initialize service
  init() {
    console.log('Notification service initialized');
    
    // Schedule daily reminders at start
    this.scheduleDailyReminders();
    
    // Schedule daily reminders every day at midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    
    setTimeout(() => {
      this.scheduleDailyReminders();
      
      // Then schedule it to run every 24 hours
      setInterval(() => {
        this.scheduleDailyReminders();
      }, 24 * 60 * 60 * 1000);
    }, msUntilMidnight);
  }
}

module.exports = new NotificationService();