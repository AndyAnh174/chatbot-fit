// Cấu hình cho API endpoints
export const API_URL = 'http://localhost:8000';

export const API_ENDPOINTS = {
  NEW_SESSION: `${API_URL}/new_session`,
  CHAT: `${API_URL}/chat`,
  CHAT_HISTORY: `${API_URL}/chat_history`,
  CHAT_SESSION: (sessionId: string) => `${API_URL}/chat/${sessionId}`,
}; 