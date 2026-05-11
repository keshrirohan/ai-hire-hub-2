const Message = require('../models/Message');

// @desc    Get conversation messages
// @route   GET /api/chat/:userId
exports.getMessages = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Create consistent conversation ID
    const conversationId = [req.user.id, userId].sort().join('_');

    const total = await Message.countDocuments({ conversationId });
    const messages = await Message.find({ conversationId })
      .populate('senderId', 'name avatar isOnline')
      .populate('receiverId', 'name avatar isOnline')
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Mark messages as read
    await Message.updateMany(
      {
        conversationId,
        receiverId: req.user.id,
        isRead: false,
      },
      { isRead: true, readAt: new Date() }
    );

    res.status(200).json({
      success: true,
      messages,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send message
// @route   POST /api/chat/send
exports.sendMessage = async (req, res, next) => {
  try {
    const { receiverId, content, projectId, type } = req.body;

    const conversationId = [req.user.id, receiverId].sort().join('_');

    const messageData = {
      conversationId,
      senderId: req.user.id,
      receiverId,
      content,
      type: type || 'text',
    };

    if (projectId) messageData.projectId = projectId;
    if (req.file) {
      messageData.fileUrl = req.file.path;
      messageData.fileName = req.file.originalname;
      messageData.type = 'file';
    }

    const message = await Message.create(messageData);
    await message.populate('senderId', 'name avatar');
    await message.populate('receiverId', 'name avatar');

    res.status(201).json({ success: true, message });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all conversations
// @route   GET /api/chat/conversations
exports.getConversations = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: require('mongoose').Types.ObjectId.createFromHexString(userId) },
            { receiverId: require('mongoose').Types.ObjectId.createFromHexString(userId) },
          ],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$conversationId',
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $eq: [
                        '$receiverId',
                        require('mongoose').Types.ObjectId.createFromHexString(userId),
                      ],
                    },
                    { $eq: ['$isRead', false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { 'lastMessage.createdAt': -1 } },
    ]);

    // Populate user info
    const Message_model = require('../models/Message');
    const populatedConvs = await Message_model.populate(conversations, [
      { path: 'lastMessage.senderId', select: 'name avatar isOnline' },
      { path: 'lastMessage.receiverId', select: 'name avatar isOnline' },
    ]);

    res.status(200).json({ success: true, conversations: populatedConvs });
  } catch (error) {
    next(error);
  }
};
