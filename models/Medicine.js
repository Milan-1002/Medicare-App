class Medicine {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.dosage = data.dosage;
    this.frequency = data.frequency;
    this.type = data.type;
    this.times = typeof data.times === 'string' ? JSON.parse(data.times) : data.times;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.notes = data.notes;
    this.isActive = data.isActive !== undefined ? data.isActive : 1;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static frequencies = [
    'Once daily',
    'Twice daily',
    'Three times daily',
    'Four times daily',
    'Every other day',
    'Weekly',
    'As needed'
  ];

  static types = [
    'Tablet',
    'Capsule',
    'Liquid',
    'Injection',
    'Inhaler',
    'Cream/Ointment',
    'Drops',
    'Patch',
    'Softgel',
    'Powder'
  ];

  static getDefaultTimes(frequency) {
    const timeMap = {
      'Once daily': ['08:00'],
      'Twice daily': ['08:00', '20:00'],
      'Three times daily': ['08:00', '14:00', '20:00'],
      'Four times daily': ['08:00', '12:00', '16:00', '20:00'],
      'Every other day': ['08:00'],
      'Weekly': ['08:00'],
      'As needed': []
    };
    
    return timeMap[frequency] || [];
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      dosage: this.dosage,
      frequency: this.frequency,
      type: this.type,
      times: this.times,
      startDate: this.startDate,
      endDate: this.endDate,
      notes: this.notes,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  validate() {
    const errors = [];
    
    if (!this.name || this.name.trim().length === 0) {
      errors.push('Medicine name is required');
    }
    
    if (!this.dosage || this.dosage.trim().length === 0) {
      errors.push('Dosage is required');
    }
    
    if (!this.frequency || !Medicine.frequencies.includes(this.frequency)) {
      errors.push('Valid frequency is required');
    }
    
    if (!this.type || !Medicine.types.includes(this.type)) {
      errors.push('Valid medicine type is required');
    }
    
    if (!this.times || this.times.length === 0) {
      errors.push('At least one reminder time is required');
    }
    
    if (!this.startDate) {
      errors.push('Start date is required');
    }
    
    // Validate time format
    if (this.times) {
      const timePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      this.times.forEach(time => {
        if (!timePattern.test(time)) {
          errors.push(`Invalid time format: ${time}. Use HH:MM format.`);
        }
      });
    }
    
    return errors;
  }

  getNextReminderTime() {
    if (!this.times || this.times.length === 0) {
      return null;
    }
    
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);
    
    // Find next reminder time today
    const nextToday = this.times.find(time => time > currentTime);
    
    if (nextToday) {
      return new Date(`${today}T${nextToday}:00`);
    } else {
      // Return first reminder time tomorrow
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowDate = tomorrow.toISOString().split('T')[0];
      return new Date(`${tomorrowDate}T${this.times[0]}:00`);
    }
  }
}

module.exports = Medicine;