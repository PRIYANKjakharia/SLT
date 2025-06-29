# SLT - Sign Language Translator

A web-based Sign Language Translator application with real-time translation capabilities and user authentication.

## Features

- **Real-time Sign Language Recognition**: Uses TensorFlow.js and Google's Teachable Machine for live sign language detection
- **User Authentication**: Secure login/signup system with JWT tokens
- **Translation History**: Track and view your previous translations
- **User Dashboard**: View statistics and manage your account
- **Responsive Design**: Works on desktop and mobile devices
- **British Sign Language (BSL) Support**: Currently supports BSL gestures

## Tech Stack

### Frontend
- HTML5, CSS3, JavaScript
- Tailwind CSS for styling
- Alpine.js for reactive components
- TensorFlow.js for machine learning
- Chart.js for data visualization

### Backend
- Node.js with Express.js
- SQLite database for data storage
- JWT for authentication
- bcryptjs for password hashing
- CORS enabled for cross-origin requests

## Setup Instructions

### Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone or download the project**
   ```bash
   # If you have git installed
   git clone <repository-url>
   cd SLT
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Rename `config.env` to `.env` (or create a new `.env` file)
   - Update the JWT secret in the `.env` file:
   ```
   PORT=3000
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

4. **Start the backend server**
   ```bash
   # For development (with auto-restart)
   npm run dev
   
   # For production
   npm start
   ```

5. **Access the application**
   - Open your browser and go to `http://localhost:3000`
   - The frontend will be served automatically by the backend

## Project Structure

```
SLT/
├── frontend/                 # Frontend HTML files
│   ├── homepage.html        # Landing page
│   ├── login.html           # Authentication page
│   ├── translator.html      # Main translation interface
│   ├── dashboard.html       # User dashboard
│   ├── about.html           # About page
│   ├── faq.html             # FAQ page
│   ├── feedback.html        # Feedback page
│   ├── accessibility.html   # Accessibility information
│   └── privacy-terms.html   # Privacy and terms
├── server.js                # Main backend server file
├── package.json             # Node.js dependencies
├── config.env               # Environment configuration
├── slt_database.db          # SQLite database (created automatically)
└── README.md               # This file
```

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

### User Management
- `GET /api/profile` - Get user profile (requires authentication)
- `GET /api/stats` - Get user statistics (requires authentication)

### Translation History
- `POST /api/translations` - Save translation (requires authentication)
- `GET /api/translations` - Get translation history (requires authentication)

## How to Use

1. **Register/Login**: Create an account or login with existing credentials
2. **Access Translator**: Navigate to the translator page
3. **Start Translation**: Click "Start Translating" to begin sign language recognition
4. **View History**: Check your dashboard to see translation history and statistics

## Development Notes

### Database
- Uses SQLite for simplicity (no additional database setup required)
- Database file (`slt_database.db`) is created automatically on first run
- Tables are created automatically:
  - `users`: Stores user account information
  - `translations`: Stores translation history

### Security Features
- Passwords are hashed using bcryptjs
- JWT tokens for session management
- Input validation on both frontend and backend
- CORS protection

### Machine Learning Model
- Uses Google's Teachable Machine model
- Model URL: `https://teachablemachine.withgoogle.com/models/oSqjKu4L7/`
- Currently trained for British Sign Language (BSL)

## Troubleshooting

### Common Issues

1. **Port already in use**
   - Change the PORT in your `.env` file
   - Or kill the process using the port: `npx kill-port 3000`

2. **Database errors**
   - Delete the `slt_database.db` file and restart the server
   - The database will be recreated automatically

3. **CORS errors**
   - Make sure the backend is running on the correct port
   - Check that the API_BASE URL in frontend files matches your backend URL

4. **Authentication issues**
   - Clear browser localStorage: `localStorage.clear()`
   - Check that JWT_SECRET is set in your `.env` file

### Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start

# Check for syntax errors
node -c server.js
```

## Contributing

This is a Digital Engineering (DE) project by Team 661025. For contributions or questions, please contact the team.

## License

MIT License - feel free to use this project for educational purposes.

## Team

**Team 661025** - Digital Engineering Project
- Sign Language Translator (SLT)
- Real-time translation with machine learning
- User authentication and history tracking
