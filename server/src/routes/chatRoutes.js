const express = require('express');
const router = express.Router();
const { getMessages, sendMessage, getConversations } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/conversations', protect, getConversations);
router.get('/:userId', protect, getMessages);
router.post('/send', protect, upload.single('file'), sendMessage);

module.exports = router;
