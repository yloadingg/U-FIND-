const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const authRoutes = require('./routes/auth');

const app = express();
const http = require('http').createServer(app); // Use HTTP server
const io = require('socket.io')(http, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});
const PORT = 3000;

let onlineUsers = []; // 🟢 Track online users (user IDs)

// JWT middleware
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

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount auth routes
app.use('/api/auth', authRoutes);

// 🟢 Socket.IO handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('userOnline', (userId) => {
    if (!onlineUsers.includes(userId)) {
      onlineUsers.push(userId);
      console.log('User online:', userId);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    // No cleanup needed for now
  });
});

// GET online users
app.get('/api/online-users', (req, res) => {
  res.json(onlineUsers);
});

async function initDB() {
  try {
    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    console.log('✅ MySQL connected');

    // Routes that use async/await and the db connection

// 🟢 Updated POST route to include category
app.post('/api/lost-items', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { description, dateLost, location, category } = req.body; // 🟩 Add category
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ error: 'Image is required.' });
    }

    const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;

    // 🟢 Updated INSERT to include category
    const sql = 'INSERT INTO lost_items (description, date_lost, location, category, user_id, image_url) VALUES (?, ?, ?, ?, ?, ?)';
    const [result] = await db.execute(sql, [description, dateLost, location, category, userId, imageUrl]);

    res.status(201).json({
      id: result.insertId,
      description,
      date_lost: dateLost,
      location,
      category, // 🟩 Include in response
      user_id: userId,
      image_url: imageUrl
    });
  } catch (err) {
    console.error('MySQL insert error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});



    const jwt = require('jsonwebtoken');

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.execute(
      'SELECT id, username, email, profile_url FROM users WHERE email = ? AND password = ?',
      [email, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = rows[0];
    const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profile_url: user.profile_url  // ✅ include this
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


    // GET logged-in user's profile
    app.get('/api/profile', authenticateToken, async (req, res) => {
      try {
        const userId = req.user.id;
        const [rows] = await db.execute(
          'SELECT id, username, email, profile_url FROM users WHERE id = ?', 
          [userId]
        );
    
        if (rows.length === 0) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        res.json(rows[0]);
      } catch (err) {
        console.error('Fetch profile error:', err);
        res.status(500).json({ error: 'Database error' });
      }
    });
    


// PUT update profile picture
app.put('/api/profile/picture', authenticateToken, upload.single('profile'), async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const profileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    console.log("Updated profile URL:", profileUrl); // ✅ Now it's defined above

    await db.execute(
      'UPDATE users SET profile_url = ? WHERE id = ?',
      [profileUrl, userId]
    );

    res.json({ profile_url: profileUrl, message: 'Profile picture updated successfully' });
  } catch (err) {
    console.error('Profile upload error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});





    // GET all lost items
    app.get('/api/lost-items', async (req, res) => {
      try {
        const [results] = await db.execute(`
          SELECT 
            lost_items.*, 
            users.username AS poster_name,
            users.email AS poster_email
          FROM lost_items
          JOIN users ON lost_items.user_id = users.id
          ORDER BY lost_items.date_lost DESC
        `);
        res.json(results);
      } catch (err) {
        console.error('Fetch error:', err);
        res.status(500).json({ error: 'Database error' });
      }
    });
    
// Delete lost item
app.delete('/api/lost-items/:id', authenticateToken, async (req, res) => {
  const itemId = req.params.id;
  const userId = req.user.id;

  try {
    // Delete related comments first
    await db.execute('DELETE FROM comments WHERE item_id = ?', [itemId]);

    // Now delete the item
    const [result] = await db.execute(
      'DELETE FROM lost_items WHERE id = ? AND user_id = ?',
      [itemId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Item not found or unauthorized' });
    }

    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error('MySQL delete error:', err);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});


    // Claim lost item
    app.put('/api/lost-items/:id/claim', authenticateToken, async (req, res) => {
      try {
        const itemId = req.params.id;
        const dateClaimed = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
        const [result] = await db.execute(
          'UPDATE lost_items SET is_claimed = 1, date_claimed = ? WHERE id = ?',
          [dateClaimed, itemId]
        );
    
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Item not found or not authorized' });
        }
        res.status(200).json({ message: 'Item marked as claimed', date_claimed: dateClaimed });
      } catch (err) {
        console.error('MySQL update error:', err);
        res.status(500).json({ error: 'Database error' });
      }
    });
    

    // GET claimed items with poster's username
app.get('/api/claimed-items', async (req, res) => {
  try {
    const [results] = await db.execute(`
      SELECT
        lost_items.*,
        users.username AS poster_name  -- Alias the username from the users table as poster_name
      FROM lost_items
      JOIN users ON lost_items.user_id = users.id
      WHERE lost_items.is_claimed = 1
      ORDER BY lost_items.date_lost DESC
    `);
    res.json(results);
  } catch (err) {
    console.error('Fetch claimed items error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

    // GET lost items by user
    app.get('/api/lost-items/user/:userId', authenticateToken, async (req, res) => {
      try {
        const { userId } = req.params;
        if (parseInt(userId) !== req.user.id) {
          return res.status(403).json({ error: 'Unauthorized access' });
        }

        const [results] = await db.execute('SELECT * FROM lost_items WHERE user_id = ? ORDER BY date_lost DESC', [userId]);
        res.status(200).json(results);
      } catch (err) {
        console.error('MySQL fetch user items error:', err);
        res.status(500).json({ error: 'Database error' });
      }
    });

    // GET single lost item with user info
    app.get('/api/lost-items/:id', async (req, res) => {
      try {
        const itemId = req.params.id;
        const sql = `
          SELECT lost_items.*, users.username, users.email
          FROM lost_items
          JOIN users ON lost_items.user_id = users.id
          WHERE lost_items.id = ?
        `;
        const [results] = await db.execute(sql, [itemId]);

        if (results.length === 0) {
          return res.status(404).json({ error: 'Item not found' });
        }

        res.json(results[0]);
      } catch (err) {
        console.error('Fetch item error:', err);
        res.status(500).json({ error: 'Database error' });
      }
    });

    // GET comments for an item
    app.get('/api/comments/:itemId', async (req, res) => {
      try {
        const itemId = req.params.itemId;
        const sql = `
          SELECT comments.*, users.username
          FROM comments
          JOIN users ON comments.user_id = users.id
          WHERE comments.item_id = ?
          ORDER BY comments.created_at ASC
        `;
        const [results] = await db.execute(sql, [itemId]);
        res.json(results);
      } catch (err) {
        console.error('Fetch comments error:', err);
        res.status(500).json({ error: 'Database error' });
      }
    });

    // POST a comment + add notification
    app.post('/api/comments', authenticateToken, async (req, res) => {
      try {
        const { text, item_id } = req.body;
        const user_id = req.user.id;

        if (!text || !item_id) {
          return res.status(400).json({ error: 'Missing text or item_id' });
        }

        // Insert comment
        const [commentResult] = await db.execute(
          'INSERT INTO comments (item_id, user_id, text) VALUES (?, ?, ?)',
          [item_id, user_id, text]
        );

        // Get post owner
        const [postRows] = await db.execute(
          'SELECT user_id FROM lost_items WHERE id = ?',
          [item_id]
        );
        const postOwnerId = postRows[0]?.user_id;

        if (postOwnerId && postOwnerId !== user_id) {
          const message = `Someone commented on your post.`;
          await db.execute(
            'INSERT INTO notifications (user_id, post_id, commenter_id, message) VALUES (?, ?, ?, ?)',
            [postOwnerId, item_id, user_id, message]
          );
        }

        res.status(201).json({ message: 'Comment added', commentId: commentResult.insertId });
      } catch (err) {
        console.error('Insert comment error:', err);
        res.status(500).json({ error: 'Database error' });
      }
    });

// GET notifications for a user
app.get('/api/notifications/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    // ✅ Only allow the user to fetch their own notifications
    if (userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const [results] = await db.execute(`
      SELECT 
        n.id,
        n.user_id,
        n.post_id,
        n.commenter_id,
        u.username AS commenter_name,
        li.description AS item_description,  -- Instead of post title
        n.message,
        n.created_at
      FROM notifications n
      JOIN users u ON u.id = n.commenter_id
      JOIN lost_items li ON li.id = n.post_id
      WHERE n.user_id = ?
      ORDER BY n.created_at DESC
    `, [userId]);

    res.json(results);
  } catch (err) {
    console.error('Fetch notifications error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});


// DELETE all notifications for a user
app.delete('/api/notifications/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    // ✅ Only allow the user to delete their own notifications
    if (userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    // Delete all notifications for the user
    await db.execute('DELETE FROM notifications WHERE user_id = ?', [userId]);

    res.status(200).json({ message: 'All notifications cleared' });
  } catch (err) {
    console.error('Error clearing notifications:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.use('/admin', express.static(path.join(__dirname, 'admin-panel')));


    // Test route
    app.get('/', (req, res) => {
      res.send('Welcome to the backend API!');
    });

    // Start the server after DB is connected and routes are defined
    http.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to MySQL:', error);
  }
}

initDB();



    // Admin Dashboard Endpoints

// Count of currently online users
app.get('/api/online-users/count', (req, res) => {
  const onlineUsers = global.onlineUsers?.length || 0;
  res.json({ count: onlineUsers });
});

// Count of lost items (or missing items — choose one table name and use consistently)
app.get('/api/lost-items/count', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT COUNT(*) AS count FROM lost_items');
    res.json({ count: rows[0].count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Count of reported posts
app.get('/api/reported-posts/count', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT COUNT(*) AS count FROM reported_posts');
    res.json({ count: rows[0].count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Count of claimed items
app.get('/api/claimed-items/count', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT COUNT(*) AS count
      FROM lost_items
      WHERE is_claimed = 1
    `);
    res.json({ count: rows[0].count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//reported posts
app.post('/api/reports', authenticateToken, async (req, res) => {
  try {
    const { item_id, report_reason, reported_by } = req.body;

    const sql = 'INSERT INTO reported_posts (item_id, report_reason, reported_by) VALUES (?, ?, ?)';
    await db.execute(sql, [item_id, report_reason, reported_by]);

    res.status(200).json({ message: 'Report submitted successfully' });
  } catch (err) {
    console.error("Error inserting report:", err);
    res.status(500).json({ message: 'Failed to submit report' });
  }
});

app.get('/api/reported-posts/count', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT COUNT(*) AS count FROM reported_posts');
    res.json({ count: rows[0].count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/reported-posts/list', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        rp.id,
        rp.item_id,
        rp.report_reason,
        u.username AS reported_by_name,
        rp.created_at AS report_created_at,
        li.image_url,
        li.description AS item_description,     -- 🟢 Add item description
        owner.username AS posted_by_name        -- 🟢 Add posted by name
      FROM reported_posts rp
      JOIN lost_items li ON rp.item_id = li.id
      LEFT JOIN users u ON rp.reported_by = u.id
      LEFT JOIN users owner ON li.user_id = owner.id  -- 🟢 Get the post owner’s username
      ORDER BY rp.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching reported posts:", err);
    res.status(500).json({ message: 'Failed to fetch reported posts' });
  }
});

// DELETE lost item by admin (bypass user ownership check)
app.delete('/api/admin/lost-items/:id', async (req, res) => {
  const itemId = req.params.id;

  try {
    // Delete related comments first
    await db.execute('DELETE FROM comments WHERE item_id = ?', [itemId]);

    // Delete the lost item
    const [result] = await db.execute('DELETE FROM lost_items WHERE id = ?', [itemId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ message: 'Lost item deleted successfully.' });
  } catch (err) {
    console.error('Admin delete error:', err);
    res.status(500).json({ error: 'Failed to delete lost item.' });
  }
});


// GET all users (for admin dashboard)
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT id, username, email, profile_url FROM users ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Database error' });
  }
});


// GET count of registered users
app.get('/api/users/count', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT COUNT(*) AS count FROM users');
    res.json({ count: rows[0].count });
  } catch (err) {
    console.error('Error counting users:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/reports/monthly', async (req, res) => {
  try {
    const [users] = await db.execute(`
      SELECT COUNT(*) AS count FROM users
      WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())
    `);

    const [uploadedItems] = await db.execute(`
      SELECT COUNT(*) AS count FROM lost_items
      WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())
    `);

    const [claimedItems] = await db.execute(`
      SELECT COUNT(*) AS count FROM lost_items
      WHERE is_claimed = 1 AND MONTH(date_claimed) = MONTH(CURRENT_DATE()) AND YEAR(date_claimed) = YEAR(CURRENT_DATE())
    `);

    const [reportedPosts] = await db.execute(`
      SELECT COUNT(*) AS count FROM reported_posts
      WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())
    `);

    res.json({
      month: new Date().toLocaleString('default', { month: 'long' }),
      new_users: users[0].count,
      uploaded_items: uploadedItems[0].count,
      claimed_items: claimedItems[0].count,
      reported_posts: reportedPosts[0].count
    });
  } catch (err) {
    console.error('Error fetching monthly report:', err);
    res.status(500).json({ error: 'Database error' });
  }
});
  