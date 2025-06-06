// Cấu hình cho API endpoints
const API_BASE = import.meta.env.VITE_API_URL || 'https://apichatbot.andyanh.id.vn';

export const API_URL = API_BASE;

export const API_ENDPOINTS = {
  NEW_SESSION: `${API_URL}/new_session`,
  CHAT: `${API_URL}/chat`,
  CHAT_HISTORY: `${API_URL}/chat_history`,
  CHAT_SESSION: (sessionId: string) => `${API_URL}/chat/${sessionId}`,
};

// Cấu hình request headers mặc định
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};

// Thông tin ứng dụng
export const APP_INFO = {
  NAME: import.meta.env.VITE_APP_NAME || 'Chatbot FIT-HCMUTE',
  DESCRIPTION: import.meta.env.VITE_APP_DESCRIPTION || 'Chatbot trả lời các câu hỏi, thắc mắc liên quan đến Khoa CNTT SPKT TPHCM',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  URL: import.meta.env.VITE_APP_URL || 'https://chatbot.andyanh.id.vn',
}; 