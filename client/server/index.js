require('dotenv').config();

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();

// ---------------- ENV VALIDATION ----------------
if (!process.env.JWT_SECRET) {
  throw new Error("❌ JWT_SECRET missing in .env");
}

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// ---------------- MIDDLEWARE ----------------
app.use(cors({
  origin: CLIENT_URL,
  credentials: true
}));

app.use(express.json({ limit: "10mb" }));

// ---------------- TEMP DATABASE ----------------
const users = [];
const sessions = [];

// ---------------- JWT MIDDLEWARE ----------------
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// ---------------- AUTH ROUTES ----------------

// REGISTER
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const userExists = users.find(user => user.email === email);
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword
    };

    users.push(newUser);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: newUser.id, name, email }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// LOGIN
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({
    message: 'Login successful',
    token,
    user: { id: user.id, name: user.name, email }
  });
});

// ---------------- DETECTION ROUTES ----------------

// SAVE SESSION
app.post('/api/detection/save', authenticateToken, (req, res) => {
  const { status, duration } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  const session = {
    username: req.user.email,
    status,
    duration: duration || 0,
    timestamp: new Date()
  };

  sessions.push(session);

  res.json({ message: "Session saved" });
});

// GET STATS
app.get('/api/detection/stats', authenticateToken, (req, res) => {
  const userSessions = sessions.filter(
    s => s.username === req.user.email
  );

  const totalSleep = userSessions.filter(s => s.status === "Sleeping").length;

  const totalDuration = userSessions.reduce(
    (acc, s) => acc + (s.duration || 0),
    0
  );

  res.json({
    sleep_count: totalSleep,
    duration: totalDuration,
    total_sessions: userSessions.length
  });
});

// ---------------- TEST ROUTE ----------------
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({
    message: "Protected route working ✅",
    user: req.user
  });
});

// ---------------- HEALTH CHECK ----------------
app.get('/', (req, res) => {
  res.send("Backend running 🚀");
});

// ---------------- SERVER ----------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Allowed Origin: ${CLIENT_URL}`);
});