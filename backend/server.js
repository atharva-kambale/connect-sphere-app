const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db');
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');
const { globalLimiter } = require('./middleware/rateLimiter');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Connect to Database
connectDB();

// Trust proxy (required for rate limiting behind reverse proxies like Render/Railway)
app.set('trust proxy', 1);

// Allowed origins for CORS
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,  // Disabled for development; enable & configure for production
}));
app.use(mongoSanitize());
app.use(hpp());
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global rate limiter
app.use(globalLimiter);

// Request logging (dev only)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
  });
}

// Route imports
const authRoutes = require('./routes/authRoutes');
const listingRoutes = require('./routes/listingRoutes');
const chatRoutes = require('./routes/chatRoutes');
const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const messageRoutes = require('./routes/messageRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Connect Sphere API is running', timestamp: new Date().toISOString() });
});

// Dev-only: Seed a dummy test user for testing all flows
if (process.env.NODE_ENV !== 'production') {
  app.get('/api/dev/seed', async (req, res) => {
    try {
      const User = require('./models/User');
      const testEmail = 'testuser@connectsphere.com';
      let user = await User.findOne({ email: testEmail });
      if (user) {
        return res.json({ message: 'Test user already exists', email: testEmail, password: 'Test@123' });
      }
      user = await User.create({
        name: 'Test User',
        email: testEmail,
        password: 'Test@123',
        university: 'Test University',
        campus: 'Main Campus',
        isVerified: true,
      });
      res.json({
        message: 'Test user created successfully',
        email: testEmail,
        password: 'Test@123',
        userId: user._id,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
}

// Socket.io Setup — with JWT authentication
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Socket.io authentication middleware — verify JWT on every connection
io.use((socket, next) => {
  const token = socket.handshake.auth?.token || socket.handshake.query?.token;
  if (!token) {
    return next(new Error('Authentication required'));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (err) {
    return next(new Error('Invalid or expired token'));
  }
});

const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id} (user: ${socket.userId})`);

  // Auto-join the user's own room using the authenticated userId
  socket.join(socket.userId);
  onlineUsers.set(socket.userId, socket.id);
  io.emit('online_users', Array.from(onlineUsers.keys()));

  socket.on('join_room', (userId) => {
    // Only allow joining your own room (prevent impersonation)
    if (userId === socket.userId) {
      socket.join(userId);
    }
  });

  socket.on('send_message', async (data) => {
    const Message = require('./models/Message');
    const Conversation = require('./models/Conversation');
    try {
      // Use the authenticated user's ID as the sender (prevent spoofing)
      const senderId = socket.userId;
      const receiverId = data.receiver;

      if (!receiverId) {
        socket.emit('message_error', { error: 'Receiver is required' });
        return;
      }

      let convId = data.conversationId || data.conversation;

      // Find or create conversation if convId is missing or invalid
      if (!convId && senderId && receiverId) {
        let conv = await Conversation.findOne({
          participants: { $all: [senderId, receiverId] }
        });
        if (!conv) {
          conv = await Conversation.create({
            participants: [senderId, receiverId],
          });
        }
        convId = conv._id;
      }

      if (!convId) {
        socket.emit('message_error', { error: 'Could not resolve conversation' });
        return;
      }

      // Verify conversation exists
      const convExists = await Conversation.findById(convId);
      if (!convExists) {
        const conv = await Conversation.findOne({
          participants: { $all: [senderId, receiverId] }
        });
        if (conv) {
          convId = conv._id;
        } else {
          const newConv = await Conversation.create({
            participants: [senderId, receiverId],
          });
          convId = newConv._id;
        }
      }

      const msg = await Message.create({
        conversation: convId,
        sender: senderId,
        receiver: receiverId,
        content: data.content,
      });

      // Update conversation lastMessage and unread count
      await Conversation.findByIdAndUpdate(convId, {
        lastMessage: { content: data.content, sender: senderId, timestamp: new Date() },
        $inc: { [`unreadCount.${receiverId}`]: 1 },
      });

      const populated = await msg.populate('sender', 'name avatar');
      io.to(receiverId).emit('receive_message', populated);
      io.to(senderId).emit('receive_message', populated);
    } catch (error) {
      console.error('Socket message error:', error.message);
      socket.emit('message_error', { error: error.message });
    }
  });

  socket.on('typing', (data) => {
    io.to(data.receiver).emit('user_typing', { sender: socket.userId });
  });

  socket.on('stop_typing', (data) => {
    io.to(data.receiver).emit('user_stop_typing', { sender: socket.userId });
  });

  socket.on('disconnect', () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    io.emit('online_users', Array.from(onlineUsers.keys()));
  });
});

// Error Handling (must be after all routes)
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
