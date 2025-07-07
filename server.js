const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const cron = require('node-cron');
const expressLayouts = require('express-ejs-layouts');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// EJS Layouts setup
app.use(expressLayouts);
app.set('layout', 'layout');

// Database setup
const db = require('./models/database');

// Routes
app.use('/', require('./routes/index'));
app.use('/api/medicines', require('./routes/medicines'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/notifications', require('./routes/notifications'));

// Initialize database
db.init();

// Schedule notifications check every minute
cron.schedule('* * * * *', () => {
  const notificationService = require('./utils/notificationService');
  notificationService.checkPendingNotifications();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`MediCare Web App running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser`);
});