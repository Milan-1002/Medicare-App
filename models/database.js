const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.db = new sqlite3.Database(path.join(__dirname, '../medicare.db'));
  }

  init() {
    this.createTables();
    this.insertSampleData();
  }

  createTables() {
    const createMedicinesTable = `
      CREATE TABLE IF NOT EXISTS medicines (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        dosage TEXT NOT NULL,
        frequency TEXT NOT NULL,
        type TEXT NOT NULL,
        times TEXT NOT NULL,
        startDate TEXT NOT NULL,
        endDate TEXT,
        notes TEXT,
        isActive INTEGER DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const createRemindersTable = `
      CREATE TABLE IF NOT EXISTS reminders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        medicineId INTEGER NOT NULL,
        reminderTime TEXT NOT NULL,
        isCompleted INTEGER DEFAULT 0,
        completedAt DATETIME,
        scheduledDate TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (medicineId) REFERENCES medicines (id)
      )
    `;

    const createNotificationsTable = `
      CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        medicineId INTEGER NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        scheduledTime DATETIME NOT NULL,
        isSent INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (medicineId) REFERENCES medicines (id)
      )
    `;

    this.db.run(createMedicinesTable);
    this.db.run(createRemindersTable);
    this.db.run(createNotificationsTable);
  }

  insertSampleData() {
    const checkSampleData = `SELECT COUNT(*) as count FROM medicines`;
    
    this.db.get(checkSampleData, (err, row) => {
      if (err) {
        console.error('Error checking sample data:', err);
        return;
      }
      
      if (row.count === 0) {
        const sampleMedicines = [
          {
            name: 'Aspirin',
            dosage: '81mg',
            frequency: 'Once daily',
            type: 'Tablet',
            times: JSON.stringify(['08:00']),
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            notes: 'Take with food to reduce stomach irritation'
          },
          {
            name: 'Vitamin D3',
            dosage: '1000 IU',
            frequency: 'Once daily',
            type: 'Capsule',
            times: JSON.stringify(['09:00']),
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            notes: 'Best absorbed with a meal containing healthy fats'
          },
          {
            name: 'Omega-3',
            dosage: '1200mg',
            frequency: 'Twice daily',
            type: 'Softgel',
            times: JSON.stringify(['08:00', '20:00']),
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            notes: 'Take with meals for better absorption'
          }
        ];

        const insertMedicine = `
          INSERT INTO medicines (name, dosage, frequency, type, times, startDate, endDate, notes)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        sampleMedicines.forEach(medicine => {
          this.db.run(insertMedicine, [
            medicine.name,
            medicine.dosage,
            medicine.frequency,
            medicine.type,
            medicine.times,
            medicine.startDate,
            medicine.endDate,
            medicine.notes
          ]);
        });

        console.log('Sample data inserted successfully');
      }
    });
  }

  // Medicine operations
  getAllMedicines(callback) {
    const query = `SELECT * FROM medicines WHERE isActive = 1 ORDER BY createdAt DESC`;
    this.db.all(query, callback);
  }

  getMedicineById(id, callback) {
    const query = `SELECT * FROM medicines WHERE id = ? AND isActive = 1`;
    this.db.get(query, [id], callback);
  }

  addMedicine(medicine, callback) {
    const query = `
      INSERT INTO medicines (name, dosage, frequency, type, times, startDate, endDate, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    this.db.run(query, [
      medicine.name,
      medicine.dosage,
      medicine.frequency,
      medicine.type,
      JSON.stringify(medicine.times),
      medicine.startDate,
      medicine.endDate,
      medicine.notes
    ], callback);
  }

  updateMedicine(id, medicine, callback) {
    const query = `
      UPDATE medicines 
      SET name = ?, dosage = ?, frequency = ?, type = ?, times = ?, 
          startDate = ?, endDate = ?, notes = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    this.db.run(query, [
      medicine.name,
      medicine.dosage,
      medicine.frequency,
      medicine.type,
      JSON.stringify(medicine.times),
      medicine.startDate,
      medicine.endDate,
      medicine.notes,
      id
    ], callback);
  }

  deleteMedicine(id, callback) {
    const query = `UPDATE medicines SET isActive = 0 WHERE id = ?`;
    this.db.run(query, [id], callback);
  }

  // Dashboard statistics
  getDashboardStats(callback) {
    const queries = {
      activeMedicines: `SELECT COUNT(*) as count FROM medicines WHERE isActive = 1`,
      todayReminders: `SELECT COUNT(*) as count FROM reminders WHERE scheduledDate = date('now')`,
      completedToday: `SELECT COUNT(*) as count FROM reminders WHERE scheduledDate = date('now') AND isCompleted = 1`
    };

    const stats = {};
    let completed = 0;
    const total = Object.keys(queries).length;

    Object.keys(queries).forEach(key => {
      this.db.get(queries[key], (err, row) => {
        if (err) {
          console.error(`Error getting ${key}:`, err);
          return;
        }
        stats[key] = row.count;
        completed++;
        
        if (completed === total) {
          // Calculate adherence rate
          const adherenceRate = stats.todayReminders > 0 
            ? Math.round((stats.completedToday / stats.todayReminders) * 100) 
            : 0;
          stats.adherenceRate = adherenceRate;
          callback(null, stats);
        }
      });
    });
  }

  // Reminder operations
  addReminder(reminder, callback) {
    const query = `
      INSERT INTO reminders (medicineId, reminderTime, scheduledDate)
      VALUES (?, ?, ?)
    `;
    
    this.db.run(query, [
      reminder.medicineId,
      reminder.reminderTime,
      reminder.scheduledDate
    ], callback);
  }

  getTodayReminders(callback) {
    const query = `
      SELECT r.*, m.name, m.dosage, m.type 
      FROM reminders r 
      JOIN medicines m ON r.medicineId = m.id 
      WHERE r.scheduledDate = date('now') AND m.isActive = 1
      ORDER BY r.reminderTime ASC
    `;
    this.db.all(query, callback);
  }

  markReminderCompleted(id, callback) {
    const query = `
      UPDATE reminders 
      SET isCompleted = 1, completedAt = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;
    this.db.run(query, [id], callback);
  }

  close() {
    this.db.close();
  }
}

module.exports = new Database();