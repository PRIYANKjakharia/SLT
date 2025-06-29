const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

// Load environment variables from config.env if .env doesn't exist
if (!fs.existsSync('.env') && fs.existsSync('config.env')) {
    require('dotenv').config({ path: 'config.env' });
} else {
    require('dotenv').config();
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));

// Database setup
const db = new sqlite3.Database('./slt_database.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

// Initialize database tables
function initializeDatabase() {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Translation history table
    db.run(`CREATE TABLE IF NOT EXISTS translations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        translation_type TEXT NOT NULL,
        input_text TEXT,
        output_text TEXT,
        confidence REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    console.log('Database tables initialized');
}

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.error('JWT verification error:', err.message);
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
}

// Routes

// Serve frontend files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'homepage.html'));
});

// User registration
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Basic validation
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into database
        db.run(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword],
            function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(400).json({ error: 'Username or email already exists' });
                    }
                    return res.status(500).json({ error: 'Error creating user' });
                }

                // Create JWT token
                const token = jwt.sign(
                    { userId: this.lastID, username: username },
                    JWT_SECRET,
                    { expiresIn: '24h' }
                );

                res.status(201).json({
                    message: 'User registered successfully',
                    token: token,
                    user: { id: this.lastID, username: username, email: email }
                });
            }
        );
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// User login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) {
            console.error('Database error during login:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token: token,
            user: { id: user.id, username: user.username, email: user.email }
        });
    });
});

// Save translation history
app.post('/api/translations', authenticateToken, (req, res) => {
    const { translation_type, input_text, output_text, confidence } = req.body;
    const userId = req.user.userId;

    if (!translation_type) {
        return res.status(400).json({ error: 'Translation type is required' });
    }

    db.run(
        'INSERT INTO translations (user_id, translation_type, input_text, output_text, confidence) VALUES (?, ?, ?, ?, ?)',
        [userId, translation_type, input_text, output_text, confidence || null],
        function(err) {
            if (err) {
                console.error('Error saving translation:', err);
                return res.status(500).json({ error: 'Error saving translation' });
            }

            res.status(201).json({
                message: 'Translation saved successfully',
                translationId: this.lastID
            });
        }
    );
});

// Get user's translation history
app.get('/api/translations', authenticateToken, (req, res) => {
    const userId = req.user.userId;
    const limit = req.query.limit || 10;

    db.all(
        'SELECT * FROM translations WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
        [userId, limit],
        (err, translations) => {
            if (err) {
                console.error('Error fetching translations:', err);
                return res.status(500).json({ error: 'Error fetching translations' });
            }

            res.json({ translations: translations });
        }
    );
});

// Get user profile
app.get('/api/profile', authenticateToken, (req, res) => {
    const userId = req.user.userId;

    db.get(
        'SELECT id, username, email, created_at FROM users WHERE id = ?',
        [userId],
        (err, user) => {
            if (err) {
                console.error('Error fetching user profile:', err);
                return res.status(500).json({ error: 'Error fetching user profile' });
            }

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json({ user: user });
        }
    );
});

// Get translation statistics
app.get('/api/stats', authenticateToken, (req, res) => {
    const userId = req.user.userId;

    db.get(
        'SELECT COUNT(*) as total_translations FROM translations WHERE user_id = ?',
        [userId],
        (err, result) => {
            if (err) {
                console.error('Error fetching statistics:', err);
                return res.status(500).json({ error: 'Error fetching statistics' });
            }

            res.json({
                total_translations: result.total_translations,
                languages_used: 1 // Currently only BSL
            });
        }
    );
});

// Support/Feedback mailing endpoint
app.post('/api/support', async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    // Configure transporter (use your SMTP provider or Gmail for demo)
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER, // your email
            pass: process.env.SMTP_PASS  // your email app password
        }
    });

    const mailOptions = {
        from: email,
        to: 'priyankjakharia2005@gmail.com',
        subject: `SLT Support Message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: 'Support message sent successfully!' });
    } catch (error) {
        console.error('Error sending support email:', error);
        res.status(500).json({ error: 'Failed to send email. Please try again later.' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Frontend available at: http://localhost:${PORT}`);
    console.log(`🔗 API available at: http://localhost:${PORT}/api`);
    console.log(`🔐 JWT Secret: ${JWT_SECRET.substring(0, 10)}...`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed');
        }
        process.exit(0);
    });
}); 