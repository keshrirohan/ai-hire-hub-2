require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const initSocket = require('./sockets/socketHandler');

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const milestoneRoutes = require('./routes/milestoneRoutes');
const aiRoutes = require('./routes/aiRoutes');
const walletRoutes = require('./routes/walletRoutes');
const chatRoutes = require('./routes/chatRoutes');

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Initialize socket
initSocket(io);

// Make io accessible to routes
app.set('io', io);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many auth attempts, please try again later.' },
});

app.use('/api/', limiter);
app.use('/api/auth', authLimiter);

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Sanitize data
app.use(mongoSanitize());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AI Hire Hub API is running! 🚀',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/chat', chatRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 AI Hire Hub server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = { app, server };
