const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const authRoutes = require('./routes/auth');

const app = express();
const PORT = 3000;

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; // Contains { id: userId }
    next();
  });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) throw err;
  console.log('✅ MySQL connected');
});

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Mount auth routes
app.use('/api/auth', authRoutes);

// POST route to upload lost item (with MySQL insert)
app.post('/api/lost-items', authenticateToken, upload.single('image'), (req, res) => {
  const { description, dateLost, location } = req.body;
  const userId = req.user.id;

  if (!req.file) {
    return res.status(400).json({ error: 'Image is required.' });
  }

  const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;

  const sql = 'INSERT INTO lost_items (description, date_lost, location, user_id, image_url) VALUES (?, ?, ?, ?, ?)';
  const values = [description, dateLost, location, userId, imageUrl];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('MySQL insert error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.status(201).json({
      id: result.insertId,
      description,
      date_lost: dateLost,                    
      location,
      user_id: userId,
      image_url: imageUrl
    });
  });
});

// GET route to fetch all lost items
app.get('/api/lost-items', (req, res) => {
  const sql = 'SELECT * FROM lost_items ORDER BY date_lost DESC';
  db.query(sql, (err, results) => {                                         
    if (err) {
      console.error('Fetch error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Test route
app.get('/', (req, res) => {
  res.send('Welcome to the backend API!');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

//Delete
app.delete('/api/lost-items/:id', authenticateToken, (req, res) => {
  const itemId = req.params.id;
  const userId = req.user.id;

  const sql = 'DELETE FROM lost_items WHERE id = ? AND user_id = ?';
  const values = [itemId, userId];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('MySQL delete error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item not found or not authorized' });
    }

    res.status(200).json({ message: 'Item deleted successfully' });
  });
});

//Imiss you na .·°՞(¯□¯)՞°·. 

app.put('/api/lost-items/:id/claim', authenticateToken, (req, res) => {
  const itemId = req.params.id;
  const userId = req.user.id;

  const sql = 'UPDATE lost_items SET claimed = 1 WHERE id = ? AND user_id = ?';
  const values = [itemId, userId];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('MySQL update error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item not found or not authorized' });
    }

    res.status(200).json({ message: 'Item marked as claimed' });
  });
});


// ✅ Add this route to fetch items uploaded by the authenticated user
app.get('/api/lost-items/user/:userId', authenticateToken, (req, res) => {
  const { userId } = req.params;

  // Only allow user to access their own items
  if (parseInt(userId) !== req.user.id) {
    return res.status(403).json({ error: 'Unauthorized access' });
  }

  const sql = 'SELECT * FROM lost_items WHERE user_id = ? ORDER BY date_lost DESC';
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('MySQL fetch user items error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.status(200).json(results);
  });
});
