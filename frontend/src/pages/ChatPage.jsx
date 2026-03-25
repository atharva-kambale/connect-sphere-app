import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import * as api from '../services/api';
import { io } from 'socket.io-client';
import { FiSend, FiArrowLeft } from 'react-icons/fi';

const ChatPage = () => {
  const { userId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const conversationIdRef = useRef(null);

  // Scroll only the message container — not the page
  const scrollToBottom = useCallback((behavior = 'smooth') => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, []);

  // Socket setup — send JWT token for authentication
  useEffect(() => {
    const token = user?.token || localStorage.getItem('token');
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    socketRef.current = io(socketUrl, {
      auth: { token },
    });
    socketRef.current.emit('join_room', user?._id);

    socketRef.current.on('receive_message', (msg) => {
      const msgSender = msg.sender?._id || msg.sender;
      const msgReceiver = msg.receiver?._id || msg.receiver;
      if (
        (msgSender === userId && msgReceiver === user?._id) ||
        (msgSender === user?._id && msgReceiver === userId)
      ) {
        setMessages((prev) => {
          // Deduplicate by _id
          if (msg._id && prev.some(m => m._id === msg._id)) return prev;
          // Replace optimistic messages (those without _id)
          const withoutOptimistic = prev.filter(m => m._id);
          return [...withoutOptimistic, msg];
        });
      }
    });

    socketRef.current.on('user_typing', (data) => {
      if (data.sender === userId) setIsTyping(true);
    });
    socketRef.current.on('user_stop_typing', (data) => {
      if (data.sender === userId) setIsTyping(false);
    });

    return () => socketRef.current?.disconnect();
  }, [user, userId]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Get or create conversation (backend expects { participantId })
        let convId = null;
        try {
          const convRes = await api.getOrCreateConversation({ participantId: userId });
          convId = convRes.data._id;
          conversationIdRef.current = convId;
        } catch (err) {
          console.warn('Could not get/create conversation:', err.message);
        }

        // 2. Fetch messages and mark them read
        if (convId) {
          try {
            const msgRes = await api.getMessages(convId);
            setMessages(Array.isArray(msgRes.data) ? msgRes.data : []);
            // Mark as read so the unread badge clears
            await api.markMessagesRead(convId).catch(() => {});
          } catch {
            setMessages([]);
          }
        } else {
          // Fallback to legacy chat history (by sender/receiver)
          try {
            const chatRes = await api.getChatHistory(userId);
            setMessages(Array.isArray(chatRes.data) ? chatRes.data : []);
          } catch {
            setMessages([]);
          }
        }

        // 3. Get other user profile
        try {
          const profileRes = await api.getPublicProfile(userId);
          setOtherUser(profileRes.data.user || profileRes.data);
        } catch {
          setOtherUser({ name: 'User' });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId, user]);

  useEffect(() => {
    scrollToBottom('auto');
  }, [messages, scrollToBottom]);

  const handleTyping = useCallback(() => {
    socketRef.current?.emit('typing', { sender: user?._id, receiver: userId });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit('stop_typing', { sender: user?._id, receiver: userId });
    }, 2000);
  }, [user, userId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const content = newMessage.trim();
    if (!content) return;

    // Optimistic update
    const optimistic = {
      content,
      sender: { _id: user._id, name: user.name },
      receiver: userId,
      createdAt: new Date().toISOString(),
      optimistic: true,
    };
    setMessages(prev => [...prev, optimistic]);
    setNewMessage('');

    // Ensure conversation exists before sending
    let convId = conversationIdRef.current;
    if (!convId) {
      try {
        const convRes = await api.getOrCreateConversation({ participantId: userId });
        convId = convRes.data._id;
        conversationIdRef.current = convId;
      } catch (err) {
        console.error('Failed to create conversation:', err.message);
      }
    }

    // Emit via socket with the valid conversationId
    socketRef.current?.emit('send_message', {
      sender: user._id,
      receiver: userId,
      content,
      conversationId: convId,
    });
    socketRef.current?.emit('stop_typing', { sender: user?._id, receiver: userId });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      sendMessage(e);
    }
  };

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0f1e' }}>
      <div style={{ width: '44px', height: '44px', border: '3px solid rgba(99,102,241,0.3)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{
      height: 'calc(100vh - 68px)',
      display: 'flex',
      flexDirection: 'column',
      background: '#0a0f1e',
      overflow: 'hidden',
      maxWidth: '900px',
      margin: '0 auto',
      width: '100%',
    }}>

      {/* Chat Header */}
      <div style={{
        background: 'rgba(10,15,30,0.97)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        flexShrink: 0,
      }}>
        <Link to="/inbox" style={{ color: 'rgba(148,163,184,0.7)', textDecoration: 'none', padding: '8px', borderRadius: '10px', transition: 'all 0.2s', display: 'flex', alignItems: 'center' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#60a5fa'; e.currentTarget.style.background = 'rgba(96,165,250,0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(148,163,184,0.7)'; e.currentTarget.style.background = 'transparent'; }}
        >
          <FiArrowLeft size={20} />
        </Link>

        <div style={{
          width: '42px', height: '42px', borderRadius: '50%',
          background: otherUser?.avatar ? `url(${otherUser.avatar}) center/cover no-repeat` : 'linear-gradient(135deg, #3b82f6, #6366f1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: 700, fontSize: '1rem', flexShrink: 0, overflow: 'hidden',
        }}>
          {!otherUser?.avatar && (otherUser?.name?.charAt(0) || 'U')}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontWeight: 700, color: '#e2e8f0', margin: 0, fontSize: '0.95rem' }}>{otherUser?.name || 'User'}</p>
          <p style={{ fontSize: '0.75rem', margin: '2px 0 0', color: isTyping ? '#34d399' : 'rgba(148,163,184,0.5)', transition: 'color 0.3s' }}>
            {isTyping ? '✎ typing...' : (otherUser?.university || 'Student')}
          </p>
        </div>

        <Link to={`/profile/${userId}`} style={{ fontSize: '0.75rem', color: '#60a5fa', textDecoration: 'none', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(96,165,250,0.2)', background: 'rgba(96,165,250,0.06)', transition: 'all 0.2s', flexShrink: 0 }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(96,165,250,0.12)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(96,165,250,0.06)'}
        >
          View Profile
        </Link>
      </div>

      {/* Messages Area */}
      <div ref={messagesContainerRef} style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 8px', display: 'flex', flexDirection: 'column', gap: '8px', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.08) transparent' }}>
        {messages.length === 0 && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>💬</div>
            <p style={{ color: 'rgba(148,163,184,0.6)', fontSize: '0.95rem' }}>No messages yet. Say hello!</p>
          </div>
        )}

        {messages.map((msg, i) => {
          const isMine = (msg.sender?._id || msg.sender) === user?._id;
          const isOptimistic = msg.optimistic;
          return (
            <div key={msg._id || `opt-${i}`} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
              {!isMine && (
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0, alignSelf: 'flex-end', marginRight: '8px' }}>
                  {otherUser?.name?.charAt(0) || 'U'}
                </div>
              )}
              <div style={{ maxWidth: 'min(70%, 480px)' }}>
                <div style={{
                  padding: '10px 16px',
                  borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: isMine ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : 'rgba(255,255,255,0.08)',
                  border: isMine ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  opacity: isOptimistic ? 0.7 : 1,
                  transition: 'opacity 0.3s',
                }}>
                  <p style={{ fontSize: '0.9rem', color: isMine ? 'white' : '#e2e8f0', margin: 0, lineHeight: 1.5, wordBreak: 'break-word' }}>{msg.content}</p>
                </div>
                <p style={{ fontSize: '0.65rem', marginTop: '3px', color: 'rgba(148,163,184,0.4)', textAlign: isMine ? 'right' : 'left' }}>
                  {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : isOptimistic ? 'Sending...' : ''}
                </p>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0 }}>{otherUser?.name?.charAt(0) || 'U'}</div>
            <div style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)', padding: '10px 16px', borderRadius: '18px 18px 18px 4px', display: 'flex', gap: '4px', alignItems: 'center' }}>
              {[0, 1, 2].map(j => (<span key={j} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(148,163,184,0.5)', animation: `typingDot 1.4s ease-in-out infinite ${j * 0.2}s` }} />))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ background: 'rgba(10,15,30,0.97)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '14px 20px', flexShrink: 0 }}>
        <form onSubmit={sendMessage} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
          <textarea
            value={newMessage}
            onChange={(e) => { setNewMessage(e.target.value); handleTyping(); }}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (Enter to send)"
            rows={1}
            style={{
              flex: 1, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '14px', padding: '12px 18px', color: '#f1f5f9', fontSize: '0.9rem',
              outline: 'none', resize: 'none', maxHeight: '120px', overflowY: 'auto',
              lineHeight: 1.5, fontFamily: 'inherit', transition: 'all 0.2s',
            }}
            onFocus={e => { e.target.style.border = '1px solid rgba(96,165,250,0.4)'; e.target.style.boxShadow = '0 0 0 3px rgba(96,165,250,0.08)'; }}
            onBlur={e => { e.target.style.border = '1px solid rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
            onInput={e => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'; }}
          />
          <button type="submit" disabled={!newMessage.trim()} style={{
            width: '46px', height: '46px', borderRadius: '14px', border: 'none',
            cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
            background: newMessage.trim() ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : 'rgba(255,255,255,0.07)',
            color: newMessage.trim() ? 'white' : 'rgba(148,163,184,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s', flexShrink: 0,
            boxShadow: newMessage.trim() ? '0 4px 14px rgba(99,102,241,0.35)' : 'none',
          }}>
            <FiSend size={18} />
          </button>
        </form>
      </div>

      <style>{`
        @keyframes typingDot { 0%, 60%, 100% { opacity: 0.3; transform: translateY(0); } 30% { opacity: 1; transform: translateY(-4px); } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>
    </div>
  );
};
export default ChatPage;
