const express = require('express');
const router = express.Router();
const { getMessages, sendMessage, markMessagesRead } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:conversationId', protect, getMessages);
router.post('/', protect, sendMessage);
router.put('/read/:conversationId', protect, markMessagesRead);

module.exports = router;
