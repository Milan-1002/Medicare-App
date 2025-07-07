const express = require('express');
const router = express.Router();
const db = require('../models/database');
const Medicine = require('../models/Medicine');

// Get all medicines
router.get('/', (req, res) => {
  db.getAllMedicines((err, medicines) => {
    if (err) {
      console.error('Error fetching medicines:', err);
      return res.status(500).json({ error: 'Failed to fetch medicines' });
    }
    
    const medicineObjects = medicines.map(medicine => new Medicine(medicine));
    res.json(medicineObjects);
  });
});

// Get medicine by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  db.getMedicineById(id, (err, medicine) => {
    if (err) {
      console.error('Error fetching medicine:', err);
      return res.status(500).json({ error: 'Failed to fetch medicine' });
    }
    
    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }
    
    const medicineObject = new Medicine(medicine);
    res.json(medicineObject);
  });
});

// Add new medicine
router.post('/', (req, res) => {
  const medicineData = req.body;
  const medicine = new Medicine(medicineData);
  
  // Validate medicine data
  const errors = medicine.validate();
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  
  db.addMedicine(medicine, function(err) {
    if (err) {
      console.error('Error adding medicine:', err);
      return res.status(500).json({ error: 'Failed to add medicine' });
    }
    
    medicine.id = this.lastID;
    res.status(201).json(medicine);
  });
});

// Update medicine
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const medicineData = req.body;
  const medicine = new Medicine(medicineData);
  
  // Validate medicine data
  const errors = medicine.validate();
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  
  db.updateMedicine(id, medicine, function(err) {
    if (err) {
      console.error('Error updating medicine:', err);
      return res.status(500).json({ error: 'Failed to update medicine' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Medicine not found' });
    }
    
    medicine.id = parseInt(id);
    res.json(medicine);
  });
});

// Delete medicine
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  db.deleteMedicine(id, function(err) {
    if (err) {
      console.error('Error deleting medicine:', err);
      return res.status(500).json({ error: 'Failed to delete medicine' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Medicine not found' });
    }
    
    res.json({ message: 'Medicine deleted successfully' });
  });
});

// Get medicine frequencies and types
router.get('/meta/options', (req, res) => {
  res.json({
    frequencies: Medicine.frequencies,
    types: Medicine.types
  });
});

module.exports = router;