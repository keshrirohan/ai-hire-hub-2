const express = require('express');
const router = express.Router();
const { chat, generateProject, reviewWork } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.post('/chat', protect, chat);
router.post('/generate-project', protect, generateProject);
router.post('/review-work', protect, reviewWork);

module.exports = router;
