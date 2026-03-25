const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

// @desc    Get messages for a conversation
// @route   GET /api/messages/:conversationId
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ conversation: req.params.conversationId })
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send a message in a conversation
// @route   POST /api/messages
const sendMessage = async (req, res) => {
  try {
    const { conversationId, receiver, content } = req.body;

    const message = await Message.create({
      conversation: conversationId,
      sender: req.user._id,
      receiver,
      content
    });

    // Update conversation's lastMessage
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: { content, sender: req.user._id, timestamp: new Date() },
      $inc: { [`unreadCount.${receiver}`]: 1 }
    });

    const populated = await message.populate('sender', 'name avatar');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark messages as read
// @route   PUT /api/messages/read/:conversationId
const markMessagesRead = async (req, res) => {
  try {
    await Message.updateMany(
      { conversation: req.params.conversationId, receiver: req.user._id, read: false },
      { read: true }
    );
    await Conversation.findByIdAndUpdate(req.params.conversationId, {
      [`unreadCount.${req.user._id}`]: 0
    });
    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMessages, sendMessage, markMessagesRead };
