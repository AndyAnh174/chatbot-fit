// Cấu hình cho API endpoints
const API_BASE = import.meta.env.VITE_API_URL || 'https://chatbotapi.hcmutertic.com';

export const API_URL = API_BASE;

export const API_ENDPOINTS = {
  NEW_SESSION: `${API_URL}/new_session`,
  CHAT: `${API_URL}/chat`,
  CHAT_HISTORY: `${API_URL}/chat_history`,
  CHAT_SESSION: (sessionId: string) => `${API_URL}/chat/${sessionId}`,
  // Admin endpoints
  ADMIN_LOGIN: `${API_URL}/admin/login`,
  ADMIN_PROFILE: `${API_URL}/admin/profile`,
  ADMIN_CHANGE_PASSWORD: `${API_URL}/admin/change-password`,
  // Document endpoints
  UPLOAD: `${API_URL}/upload`,
  DOCUMENTS: `${API_URL}/documents`,
  DELETE_DOCUMENT: (docId: string) => `${API_URL}/documents/${docId}`,
  REINDEX: `${API_URL}/reindex`,
};

// Cấu hình request headers mặc định
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};

// Auth headers với token
export const getAuthHeaders = (token?: string) => ({
  ...DEFAULT_HEADERS,
  ...(token && { 'Authorization': `Bearer ${token}` }),
});
// Thông tin ứng dụng
export const APP_INFO = {
  NAME: import.meta.env.VITE_APP_NAME || 'RTIC Chatbot',
  DESCRIPTION: import.meta.env.VITE_APP_DESCRIPTION || 'HCM UTE Research on Technology and Innovation Club Chatbot',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  URL: import.meta.env.VITE_APP_URL || 'https://chatbot.hcmutertic.com',
}; 