const express = require('express');
const router = express.Router();
const { getChatHistory, getInbox } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getInbox);
router.get('/:userId', protect, getChatHistory);

module.exports = router;
