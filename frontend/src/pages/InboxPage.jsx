import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import * as api from '../services/api';
import { motion } from 'framer-motion';

const InboxPage = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const { data } = await api.getConversations();
        setConversations(data.map(conv => {
          const otherUser = conv.participants?.find(p => p._id !== user?._id) || {};
          return {
            conversationId: conv._id,
            userId: otherUser._id,
            user: otherUser,
            lastMessage: conv.lastMessage?.content || '',
            lastMessageTime: conv.lastMessage?.timestamp || conv.updatedAt,
            unread: conv.unreadCount?.get?.(user?._id) || conv.unreadCount?.[user?._id] || 0,
          };
        }));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInbox();
  }, [user]);

  // Instantly clear badge in UI and mark read on backend, then navigate
  const handleConversationClick = async (conv) => {
    if (conv.unread > 0) {
      setConversations(prev =>
        prev.map(c => c.conversationId === conv.conversationId ? { ...c, unread: 0 } : c)
      );
      api.markMessagesRead(conv.conversationId).catch(() => {});
    }
    // ChatPage uses :userId param
    navigate(`/chat/${conv.userId || conv.conversationId}`);
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0f1e' }}>
      <div style={{ width: '44px', height: '44px', border: '3px solid rgba(99,102,241,0.3)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ background: '#0a0f1e', minHeight: '100vh', padding: 'clamp(24px,5vw,40px) 0' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 clamp(16px,4vw,24px)' }}>
        <h1 style={{ fontSize: 'clamp(1.6rem,5vw,2rem)', fontWeight: 900, color: '#e2e8f0', marginBottom: 'clamp(20px,4vw,32px)' }}>
          💬 Messages
        </h1>

        {conversations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(255,255,255,0.04)', borderRadius: '24px',
              padding: 'clamp(40px,8vw,60px)', textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <div style={{ fontSize: 'clamp(2.5rem,7vw,3.5rem)', marginBottom: '16px' }}>💬</div>
            <h3 style={{ fontSize: 'clamp(1.1rem,3.5vw,1.3rem)', fontWeight: 700, color: '#e2e8f0', marginBottom: '8px' }}>No conversations yet</h3>
            <p style={{ color: 'rgba(148,163,184,0.7)', marginBottom: '24px', fontSize: 'clamp(0.875rem,2.5vw,1rem)' }}>
              Browse listings and start chatting with sellers!
            </p>
            <Link to="/browse" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: 'white', padding: '12px 28px', borderRadius: '9999px', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>
              Browse Listings
            </Link>
          </motion.div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {conversations.map((conv, i) => (
              <motion.div
                key={`conv-${conv.conversationId || conv.userId}-${i}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <button
                  onClick={() => handleConversationClick(conv)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 'clamp(12px,3vw,16px)',
                    background: 'rgba(255,255,255,0.04)', borderRadius: '18px',
                    padding: 'clamp(14px,3vw,18px)', border: '1px solid rgba(255,255,255,0.07)',
                    width: '100%', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.border = '1px solid rgba(96,165,250,0.25)'; e.currentTarget.style.background = 'rgba(96,165,250,0.06)'; }}
                  onMouseLeave={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: 'clamp(44px,10vw,52px)', height: 'clamp(44px,10vw,52px)',
                    borderRadius: '50%',
                    background: conv.user?.avatar ? `url(${conv.user.avatar}) center/cover no-repeat` : 'linear-gradient(135deg, #3b82f6, #6366f1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 700, fontSize: 'clamp(1rem,3vw,1.2rem)', flexShrink: 0, overflow: 'hidden',
                  }}>
                    {!conv.user?.avatar && (conv.user?.name?.charAt(0) || 'U')}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <p style={{ fontWeight: conv.unread > 0 ? 800 : 700, color: '#e2e8f0', margin: 0, fontSize: 'clamp(0.875rem,2.5vw,1rem)' }}>
                        {conv.user?.name || 'User'}
                      </p>
                      {conv.lastMessageTime && (
                        <span style={{ fontSize: '0.75rem', color: 'rgba(148,163,184,0.5)', flexShrink: 0 }}>
                          {new Date(conv.lastMessageTime).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p style={{
                      fontSize: 'clamp(0.8rem,2vw,0.875rem)',
                      color: conv.unread > 0 ? 'rgba(226,232,240,0.85)' : 'rgba(148,163,184,0.65)',
                      fontWeight: conv.unread > 0 ? 600 : 400,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: '4px 0 0',
                    }}>
                      {conv.lastMessage || 'No messages yet'}
                    </p>
                  </div>

                  {/* Unread badge */}
                  {conv.unread > 0 && (
                    <span style={{
                      background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: 'white',
                      minWidth: '24px', height: '24px', borderRadius: '12px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.75rem', fontWeight: 700, flexShrink: 0, padding: '0 6px',
                    }}>
                      {conv.unread}
                    </span>
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default InboxPage;
