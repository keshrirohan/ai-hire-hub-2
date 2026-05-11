const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');

const initSocket = (io) => {
  // Map of userId -> socketId
  const onlineUsers = new Map();

  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth.token ||
        socket.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket) => {
    const userId = socket.user._id.toString();
    onlineUsers.set(userId, socket.id);

    console.log(`✅ User connected: ${socket.user.name} (${userId})`);

    // Update online status
    await User.findByIdAndUpdate(userId, { isOnline: true });
    io.emit('userOnline', { userId });

    // Join personal room
    socket.join(userId);

    // Send online users list
    socket.emit('onlineUsers', Array.from(onlineUsers.keys()));

    // Handle send message
    socket.on('sendMessage', async (data) => {
      try {
        const { receiverId, content, projectId, type } = data;

        const conversationId = [userId, receiverId].sort().join('_');

        const message = await Message.create({
          conversationId,
          senderId: userId,
          receiverId,
          content,
          projectId: projectId || null,
          type: type || 'text',
        });

        await message.populate('senderId', 'name avatar');
        await message.populate('receiverId', 'name avatar');

        // Send to receiver if online
        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverId).emit('newMessage', message);
        }

        // Send back to sender
        socket.emit('messageSent', message);
      } catch (error) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing
    socket.on('typing', ({ receiverId, isTyping }) => {
      io.to(receiverId).emit('typing', { senderId: userId, isTyping });
    });

    // Handle mark as read
    socket.on('markRead', async ({ senderId }) => {
      const conversationId = [userId, senderId].sort().join('_');
      await Message.updateMany(
        { conversationId, receiverId: userId, isRead: false },
        { isRead: true, readAt: new Date() }
      );
      io.to(senderId).emit('messagesRead', { by: userId });
    });

    // Handle join project room
    socket.on('joinProject', (projectId) => {
      socket.join(`project_${projectId}`);
    });

    // Handle project notifications
    socket.on('projectUpdate', (data) => {
      io.to(`project_${data.projectId}`).emit('projectUpdated', data);
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      onlineUsers.delete(userId);
      await User.findByIdAndUpdate(userId, {
        isOnline: false,
        lastSeen: new Date(),
      });
      io.emit('userOffline', { userId });
      console.log(`❌ User disconnected: ${socket.user.name}`);
    });
  });

  return io;
};

module.exports = initSocket;
