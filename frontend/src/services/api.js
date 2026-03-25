import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API = axios.create({ baseURL: API_BASE_URL });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const verifyOTP = (data) => API.post('/auth/verify-otp', data);
export const resendOTP = (data) => API.post('/auth/resend-otp', data);
export const forgotPassword = (data) => API.post('/auth/forgot-password', data);
export const resetPassword = (data) => API.post('/auth/reset-password', data);

// Listings
export const getListings = (params) => API.get('/listings', { params });
export const getFeaturedListings = () => API.get('/listings/featured');
export const getListingById = (id) => API.get(`/listings/${id}`);
export const createListing = (data) => API.post('/listings', data);
export const updateListing = (id, data) => API.put(`/listings/${id}`, data);
export const deleteListing = (id) => API.delete(`/listings/${id}`);
export const updateListingStatus = (id, status) => API.put(`/listings/${id}/status`, { status });

// Users
export const getUserProfile = () => API.get('/users/profile');
export const updateUserProfile = (data) => API.put('/users/profile', data);
export const getPublicProfile = (id) => API.get(`/users/${id}`);
export const sendContactMessage = (data) => API.post('/users/contact', data);
export const subscribeNewsletter = (data) => API.post('/users/subscribe', data);

// Chat (legacy)
export const getInbox = () => API.get('/chat');
export const getChatHistory = (userId) => API.get(`/chat/${userId}`);

// Conversations
export const getConversations = () => API.get('/conversations');
export const getOrCreateConversation = (data) => API.post('/conversations', data);

// Messages
export const getMessages = (conversationId) => API.get(`/messages/${conversationId}`);
export const sendMessage = (data) => API.post('/messages', data);
export const markMessagesRead = (conversationId) => API.put(`/messages/read/${conversationId}`);

// Reviews
export const createReview = (data) => API.post('/reviews', data);
export const getReviewsForUser = (userId) => API.get(`/reviews/${userId}`);

// Notifications
export const getNotifications = () => API.get('/notifications');
export const markNotificationRead = (id) => API.put(`/notifications/${id}/read`);
export const markAllNotificationsRead = () => API.put('/notifications/read-all');

// Upload
export const uploadImages = (formData) => API.post('/upload', formData);

export default API;
