const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// @desc    Get or create a conversation between two users
// @route   POST /api/conversations
const getOrCreateConversation = async (req, res) => {
  try {
    const { participantId, listingId } = req.body;
    const userId = req.user._id;

    if (!participantId) {
      return res.status(400).json({ message: 'participantId is required' });
    }

    // Find ALL conversations between these two users (to handle duplicates)
    const conversations = await Conversation.find({
      participants: { $all: [userId, participantId] }
    }).sort({ updatedAt: -1 });

    let conversation;

    if (conversations.length > 1) {
      // Merge duplicates: keep the most recent, move messages from others
      conversation = conversations[0]; // keep the newest
      const duplicateIds = conversations.slice(1).map(c => c._id);

      // Move all messages from duplicate conversations to the primary one
      await Message.updateMany(
        { conversation: { $in: duplicateIds } },
        { conversation: conversation._id }
      );

      // Delete duplicate conversations
      await Conversation.deleteMany({ _id: { $in: duplicateIds } });
      console.log(`Merged ${duplicateIds.length} duplicate conversations for users ${userId} and ${participantId}`);
    } else if (conversations.length === 1) {
      conversation = conversations[0];
    } else {
      // Create new
      conversation = await Conversation.create({
        participants: [userId, participantId],
        listing: listingId || undefined
      });
    }

    // Populate and return
    conversation = await conversation.populate('participants', 'name avatar university');
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all conversations for logged-in user (inbox)
// @route   GET /api/conversations
const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id
    })
      .populate('participants', 'name avatar university')
      .populate('listing', 'title images')
      .sort({ updatedAt: -1 });

    // Deduplicate by other participant (keep only the most recent conversation per user pair)
    const seen = new Set();
    const deduped = [];
    for (const conv of conversations) {
      const otherUser = conv.participants?.find(p => p._id.toString() !== req.user._id.toString());
      const key = otherUser?._id?.toString() || conv._id.toString();
      if (!seen.has(key)) {
        seen.add(key);
        deduped.push(conv);
      }
    }

    res.json(deduped);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getOrCreateConversation, getConversations };

