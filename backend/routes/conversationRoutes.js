const express = require('express');
const router = express.Router();
const { getOrCreateConversation, getConversations } = require('../controllers/conversationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getConversations);
router.post('/', protect, getOrCreateConversation);

module.exports = router;
