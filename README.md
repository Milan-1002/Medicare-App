# MediCare - Medication Reminder Web App

A comprehensive medication reminder web application built with Node.js, Express, and modern web technologies. MediCare helps users manage their medication schedules with smart reminders, AI assistance, and detailed health tracking.

![MediCare Logo](public/images/icon-192x192.png)

## 🚀 Features

### 📊 Dashboard
- **Personalized Greeting**: Time-based greetings and current status
- **Health Statistics**: Active medicines, daily reminders, adherence tracking
- **Quick Actions**: Fast access to key features
- **Real-time Updates**: Live medication and reminder data

### 💊 Medicine Management
- **Comprehensive Medicine Profiles**: Name, dosage, type, frequency, and notes
- **Flexible Scheduling**: Custom reminder times with smart defaults
- **Medicine Types**: Support for tablets, capsules, liquids, injections, and more
- **Search & Filter**: Find medicines by name, type, or frequency
- **Easy Management**: Add, edit, delete, and view detailed medicine information

### 🔔 Smart Notifications
- **Web Push Notifications**: Browser-based medication reminders
- **Customizable Schedule**: Set quiet hours and notification preferences
- **Progressive Web App**: Install on desktop and mobile devices
- **Offline Support**: Service worker for reliable notifications

### 🤖 AI Assistant
- **Medication Guidance**: Get information about your medicines
- **Health Questions**: Ask about side effects, interactions, and dosages
- **Context-Aware**: Responses based on your current medication list
- **Safety First**: Clear medical disclaimers and professional advice guidance

### 📈 Health Tracking
- **Adherence Monitoring**: Track your medication compliance
- **Statistics Dashboard**: Visual insights into your medication habits
- **Reminder History**: View completed and missed doses
- **Progress Reports**: Monitor your health journey

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: SQLite with structured schemas
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom medical-grade CSS with CSS Variables
- **PWA**: Service Worker, Web App Manifest
- **Notifications**: Web Push API, Web Notifications API
- **Icons**: Font Awesome 6
- **Templating**: EJS (Embedded JavaScript)

## 📋 Requirements

- Node.js 14.x or higher
- npm 6.x or higher
- Modern web browser with JavaScript enabled
- HTTPS (required for notifications in production)

## ⚡ Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Milan-1002/Medicare-App.git
cd Medicare-App
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev
# or
npm start
```

### 4. Open in Browser
Navigate to `http://localhost:3000` in your web browser.

## 🔧 Installation & Setup

### Development Setup
```bash
# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# The app will be available at http://localhost:3000
```

### Production Setup
```bash
# Install production dependencies only
npm install --production

# Start production server
npm start

# Set environment variables
export PORT=3000
export NODE_ENV=production
```

### Environment Variables
Create a `.env` file in the root directory:
```env
PORT=3000
NODE_ENV=development
DATABASE_PATH=./medicare.db
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
VAPID_EMAIL=your_email@example.com
```

## 📱 Progressive Web App (PWA)

MediCare is a fully-featured Progressive Web App that can be installed on desktop and mobile devices.

### Installation
1. Open the app in a supported browser
2. Look for the "Install" prompt or button
3. Follow the installation instructions
4. Access MediCare from your home screen or desktop

### Features
- **Offline Support**: Core functionality works without internet
- **Native Feel**: App-like experience with custom navigation
- **Push Notifications**: Receive medication reminders even when the app is closed
- **Fast Loading**: Cached resources for quick startup

## 🗄️ Database Schema

### Medicines Table
```sql
CREATE TABLE medicines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  type TEXT NOT NULL,
  times TEXT NOT NULL, -- JSON array of reminder times
  startDate TEXT NOT NULL,
  endDate TEXT,
  notes TEXT,
  isActive INTEGER DEFAULT 1,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Reminders Table
```sql
CREATE TABLE reminders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  medicineId INTEGER NOT NULL,
  reminderTime TEXT NOT NULL,
  isCompleted INTEGER DEFAULT 0,
  completedAt DATETIME,
  scheduledDate TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (medicineId) REFERENCES medicines (id)
);
```

### Notifications Table
```sql
CREATE TABLE notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  medicineId INTEGER NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  scheduledTime DATETIME NOT NULL,
  isSent INTEGER DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (medicineId) REFERENCES medicines (id)
);
```

## 🔗 API Endpoints

### Medicines API
- `GET /api/medicines` - Get all medicines
- `GET /api/medicines/:id` - Get medicine by ID
- `POST /api/medicines` - Add new medicine
- `PUT /api/medicines/:id` - Update medicine
- `DELETE /api/medicines/:id` - Delete medicine
- `GET /api/medicines/meta/options` - Get medicine options (types, frequencies)

### Dashboard API
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/reminders/today` - Get today's reminders
- `POST /api/dashboard/reminders/:id/complete` - Mark reminder as completed
- `GET /api/dashboard/greeting` - Get time-based greeting

### Notifications API
- `POST /api/notifications/subscribe` - Subscribe to push notifications
- `POST /api/notifications/send` - Send notification
- `POST /api/notifications/test` - Send test notification
- `GET /api/notifications/vapid-public-key` - Get VAPID public key

## 🎨 Customization

### Theming
The app uses CSS custom properties for easy theming. Modify `/public/css/style.css`:

```css
:root {
  --primary-blue: #0066CC;
  --primary-cyan: #00BCD4;
  --primary-purple: #6B46C1;
  /* Add your custom colors */
}
```

### Medicine Types & Frequencies
Update the options in `/models/Medicine.js`:

```javascript
static frequencies = [
  'Once daily',
  'Twice daily',
  // Add custom frequencies
];

static types = [
  'Tablet',
  'Capsule',
  // Add custom medicine types
];
```

## 🔒 Security Features

- **Input Validation**: Server-side validation for all user inputs
- **SQL Injection Protection**: Parameterized queries with SQLite
- **XSS Prevention**: Proper data sanitization and encoding
- **CSRF Protection**: Express security middleware
- **Data Privacy**: Local data storage, no external data transmission
- **Medical Disclaimers**: Clear warnings about consulting healthcare providers

## 🌐 Browser Support

### Recommended Browsers
- **Chrome/Chromium** 88+ (Best experience)
- **Firefox** 85+
- **Safari** 14+
- **Edge** 88+

### Required Features
- JavaScript ES6+
- CSS Custom Properties
- Fetch API
- Service Workers (for PWA features)
- Web Notifications API (for reminders)

## 🚀 Deployment

### Heroku Deployment
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create Heroku app
heroku create medicare-web-app

# Deploy
git push heroku main
```

### Netlify Deployment
1. Build the app: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure environment variables in Netlify dashboard

### Self-Hosted Deployment
```bash
# On your server
git clone https://github.com/Milan-1002/Medicare-App.git
cd Medicare-App
npm install --production
npm start
```

## 🧪 Testing

### Manual Testing
1. **Medicine Management**: Add, edit, delete medicines
2. **Notifications**: Test browser notifications and push notifications
3. **AI Assistant**: Try various health-related questions
4. **Dashboard**: Verify statistics and reminder tracking
5. **PWA**: Test installation and offline functionality

### Browser Testing
Test the app across different browsers and devices to ensure compatibility.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

### Development Guidelines
- Follow existing code style and conventions
- Add comments for complex functionality
- Test thoroughly across browsers
- Update documentation for new features
- Maintain medical disclaimers and safety warnings

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Medical Disclaimer

**IMPORTANT**: MediCare is designed to assist with medication management but should not replace professional medical advice. This application is for informational purposes only and is not intended to diagnose, treat, cure, or prevent any disease.

**Always consult your healthcare provider for:**
- Medical decisions and treatment plans
- Medication changes or interactions
- Emergency medical situations
- Professional medical advice

**Never:**
- Ignore professional medical advice because of information from this app
- Delay seeking medical treatment based on app information
- Use this app as a substitute for professional healthcare

## 📞 Support

For support, questions, or feedback:
- 📧 Email: support@medicare-app.com
- 🐛 Bug Reports: [GitHub Issues](https://github.com/Milan-1002/Medicare-App/issues)
- 💡 Feature Requests: [GitHub Discussions](https://github.com/Milan-1002/Medicare-App/discussions)

## 🙏 Acknowledgments

- **Font Awesome** for the comprehensive icon library
- **Express.js** for the robust web framework
- **SQLite** for the reliable database engine
- **The medical community** for inspiration and guidance on medication management

---

**Built with ❤️ for better health management**

*Remember: Your health is your wealth. Take your medicines on time!* 💊⏰
