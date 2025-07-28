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
  ADMIN_DOCUMENTS: `${API_URL}/admin/documents`,
  ADMIN_UPLOAD: `${API_URL}/admin/upload`,
  ADMIN_DELETE_DOCUMENT: (docId: string) => `${API_URL}/admin/documents/${docId}`,
  ADMIN_REINDEX: `${API_URL}/admin/reindex`,
};

// Cấu hình request headers mặc định
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// Function để tạo auth headers
export const getAuthHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    ...DEFAULT_HEADERS,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Thông tin ứng dụng
export const APP_INFO = {
  NAME: import.meta.env.VITE_APP_NAME || 'Chatbot FIT-HCMUTE',
  DESCRIPTION: import.meta.env.VITE_APP_DESCRIPTION || 'Chatbot trả lời các câu hỏi, thắc mắc liên quan đến Khoa CNTT SPKT TPHCM',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  URL: import.meta.env.VITE_APP_URL || 'https://chatbot.hcmutertic.com',
}; 