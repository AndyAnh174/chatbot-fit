import { useState, useEffect, useRef } from 'react';
import { FaRobot, FaPaperPlane, FaHistory, FaTrash, FaPlus, FaTimes, FaInfoCircle, FaCopy, FaCheck, FaKeyboard, FaBars, FaChevronLeft } from 'react-icons/fa';
import axios from 'axios';
import { API_ENDPOINTS, DEFAULT_HEADERS } from '../config';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

// CSS cho typing animation và thinking progress + scrollbar styling
const typingCSS = `
  .typing-indicator {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  .typing-indicator .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    animation: typing 1.4s infinite ease-in-out;
  }
  
  .typing-indicator .dot:nth-child(1) {
    animation-delay: -0.32s;
  }
  
  .typing-indicator .dot:nth-child(2) {
    animation-delay: -0.16s;
  }
  
  @keyframes typing {
    0%, 80%, 100% {
      opacity: 0.3;
      transform: scale(0.8);
    }
    40% {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes thinking-progress {
    0% {
      width: 20%;
      opacity: 0.6;
    }
    50% {
      width: 80%;
      opacity: 1;
    }
    100% {
      width: 20%;
      opacity: 0.6;
    }
  }

  .thinking-progress {
    animation: thinking-progress 2s ease-in-out infinite;
  }

  /* Hide scrollbar for quick actions */
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }

  /* Smooth animations */
  .fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Line clamp utility */
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* Mobile viewport stability fixes */
  @media screen and (max-width: 768px) {
    html, body {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      text-size-adjust: 100%;
      height: 100%;
      overflow: hidden;
      position: fixed;
      width: 100%;
    }
    
    #root {
      height: 100vh;
      height: 100dvh;
      overflow: hidden;
      position: fixed;
      width: 100%;
      top: 0;
      left: 0;
    }
    
    .chat-container {
      height: 100vh;
      height: 100dvh;
      overflow: hidden;
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
    }
    
    .chat-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
      overflow: hidden;
    }
    
    .messages-area {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    
    .messages-container {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      scroll-behavior: smooth;
    }
    
    /* Prevent zoom on input focus */
    input[type="text"], 
    input[type="email"], 
    input[type="search"], 
    textarea {
      font-size: 16px !important;
      transform: translateZ(0);
      -webkit-appearance: none;
      -webkit-user-select: text;
      user-select: text;
    }
    
    /* Stable layout during streaming */
    .streaming-message {
      will-change: contents;
      contain: layout style;
    }

    /* Fix mobile sidebar positioning */
    .mobile-sidebar {
      position: fixed;
      top: 0;
      left: 0;
      width: 80vw;
      max-width: 320px;
      height: 100vh;
      height: 100dvh;
      z-index: 50;
      transform: translateX(-100%);
      transition: transform 0.3s ease-in-out;
      background: white;
    }

    .mobile-sidebar.open {
      transform: translateX(0);
    }

    /* Improve touch targets */
    button {
      min-height: 44px;
      min-width: 44px;
    }

    /* Fix mobile input container - make it sticky */
    .mobile-input-container {
      position: sticky;
      bottom: 0;
      left: 0;
      right: 0;
      background: white;
      border-top: 1px solid #e5e7eb;
      z-index: 30;
      padding-bottom: env(safe-area-inset-bottom);
    }

    /* Prevent body scroll when sidebar is open */
    body.sidebar-open {
      overflow: hidden;
    }

    /* Fixed mobile header */
    .mobile-header {
      position: sticky;
      top: 0;
      left: 0;
      right: 0;
      z-index: 20;
      background: white;
      border-bottom: 1px solid #e5e7eb;
    }

    /* Ensure proper spacing for messages */
    .mobile-messages {
      padding: 1rem 0.75rem;
      padding-bottom: 2rem;
    }
  }

  /* Additional mobile stability for very small screens */
  @media screen and (max-width: 480px) {
    .chat-container {
      font-size: 14px;
    }
    
    /* Smaller message bubbles on very small screens */
    .user-message,
    .bot-message {
      max-width: 95% !important;
      font-size: 14px;
    }

    /* Compact mobile elements */
    .mobile-status {
      padding: 8px 12px;
      font-size: 12px;
    }

    .mobile-input {
      padding: 12px;
      font-size: 16px;
    }

    /* Smaller quick action buttons */
    .quick-action-mobile {
      padding: 6px 12px;
      font-size: 11px;
      min-height: 32px;
    }
  }

  /* Desktop sidebar scroll */
  @media screen and (min-width: 769px) {
    .sidebar-container {
      height: 100vh;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }
    
    .sidebar-content {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .sidebar-content .flex-1 { /* Scrollable history part */
      flex: 1;
      overflow-y: auto;
      min-height: 0;
    }

    /* Scrollbar styles for Desktop */
    .sidebar-content .flex-1::-webkit-scrollbar {
      width: 8px;
    }
    
    .sidebar-content .flex-1::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 4px;
    }
    
    .sidebar-content .flex-1::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }
    
    .sidebar-content .flex-1::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
  }
`;

// Inject CSS
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = typingCSS;
  document.head.appendChild(style);
}

interface Message {
  role: 'human' | 'ai';
  content: string;
  timestamp?: string;
  isStreaming?: boolean;
}

interface Session {
  session_id: string;
  title: string;
  timestamp: string;
  preview: string;
  last_message?: string;
}

// localStorage key cho lịch sử chat
const CHAT_HISTORY_STORAGE_KEY = 'chatbot_history';

// Hàm post-process để tìm và sửa emails bị chia thành nhiều phần
const postProcessEmails = (content: string): string => {
  let processedContent = content;
  
  // Chỉ unescape markdown characters, không xử lý emails ở đây
  processedContent = processedContent.replace(/\\_/g, '_');
  
  return processedContent;
};

// Hàm xử lý và làm sạch nội dung
const cleanContent = (content: string): string => {
  let processedContent = content;
  
  // Kiểm tra và trích xuất nội dung từ dạng JSON
  const jsonRegex = /\{"content"\s*:\s*"([^"]*?)"\s*,\s*"format_type"\s*:\s*"([^"]*?)"\}/g;
  const jsonMatch = jsonRegex.exec(processedContent);
  if (jsonMatch) {
    // Lấy chỉ phần nội dung từ JSON
    processedContent = jsonMatch[1];
  }
  
  // Thay thế ký tự xuống dòng
  processedContent = processedContent.replace(/\\n/g, '\n');
  
  // Unescape các ký tự markdown TRƯỚC KHI xử lý links
  processedContent = processedContent.replace(/\\_/g, '_');
  processedContent = processedContent.replace(/\\\*/g, '*');
  processedContent = processedContent.replace(/\\\[/g, '[');
  processedContent = processedContent.replace(/\\\]/g, ']');
  
  // KHÔNG xử lý emails ở đây để tránh duplicate
  
  return processedContent;
};

export function ChatbotPage() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [, setIsLoadingHistory] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [] = useState<Session[]>([]);
  const [localChatSessions, setLocalChatSessions] = useState<Session[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [] = useState(0);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteSessionId, setDeleteSessionId] = useState<string | null>(null);
  const [showClearAllModal, setShowClearAllModal] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [, setConnectionError] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  
  // New states for enhanced features
  const [currentTime, setCurrentTime] = useState(new Date());
  const [wordCount, setWordCount] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);


  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Track session start time
  useEffect(() => {
    if (!sessionStartTime && messages.length > 0) {
      setSessionStartTime(new Date());
    }
  }, [messages.length, sessionStartTime]);

  // Update word count when query changes
  useEffect(() => {
    const words = query.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length === 1 && words[0] === '' ? 0 : words.length);
  }, [query]);

  // Lưu lịch sử chat vào localStorage
  const saveLocalChatHistory = (sessionId: string, messages: Message[]) => {
    try {
      if (!sessionId || messages.length === 0) return;

      // Lấy lịch sử chat hiện tại từ localStorage
      const storedHistory = localStorage.getItem(CHAT_HISTORY_STORAGE_KEY);
      let chatHistory: Record<string, Message[]> = storedHistory ? JSON.parse(storedHistory) : {};

      // Cập nhật hoặc thêm mới phiên chat hiện tại
      chatHistory[sessionId] = messages;

      // Lưu trở lại localStorage
      localStorage.setItem(CHAT_HISTORY_STORAGE_KEY, JSON.stringify(chatHistory));

      // Cập nhật danh sách phiên chat của người dùng
      updateLocalChatSessions();
    } catch (error) {
      console.error('Error saving chat history to localStorage:', error);
    }
  };

  // Tải lịch sử chat từ localStorage
  const loadLocalChatHistory = (sessionId: string): Message[] => {
    try {
      const storedHistory = localStorage.getItem(CHAT_HISTORY_STORAGE_KEY);
      if (!storedHistory) return [];

      const chatHistory: Record<string, Message[]> = JSON.parse(storedHistory);
      return chatHistory[sessionId] || [];
    } catch (error) {
      console.error('Error loading chat history from localStorage:', error);
      return [];
    }
  };

  // Cập nhật danh sách phiên chat từ localStorage
  const updateLocalChatSessions = () => {
    try {
      const storedHistory = localStorage.getItem(CHAT_HISTORY_STORAGE_KEY);
      if (!storedHistory) {
        setLocalChatSessions([]);
        return;
      }

      const chatHistory: Record<string, Message[]> = JSON.parse(storedHistory);
      const sessions: Session[] = Object.keys(chatHistory).map(sessionId => {
        const messages = chatHistory[sessionId];
        const lastMessage = messages[messages.length - 1];
        const firstUserMessage = messages.find(msg => msg.role === 'human');
        
        // Xử lý trường hợp content có thể là undefined
        const previewContent = firstUserMessage?.content || '';
        const preview = previewContent.substring(0, 50) + (previewContent.length > 50 ? '...' : '');
        
        return {
          session_id: sessionId,
          title: `Trò chuyện ${new Date(messages[0].timestamp || new Date()).toLocaleString()}`,
          timestamp: messages[0].timestamp || new Date().toISOString(),
          preview: preview || 'Cuộc trò chuyện mới',
          last_message: lastMessage?.content || ''
        };
      });

      // Sắp xếp theo thời gian gần nhất
      sessions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setLocalChatSessions(sessions);
    } catch (error) {
      console.error('Error updating local chat sessions:', error);
    }
  };

  // Tải danh sách phiên chat khi tải trang
  useEffect(() => {
    updateLocalChatSessions();
    // Removed fetchChatSessions() call since it's defined later
  }, []);

  // Auto-focus input khi component mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Lưu lịch sử chat vào localStorage khi messages thay đổi
  useEffect(() => {
    if (sessionId && messages.length > 0) {
      saveLocalChatHistory(sessionId, messages);
    }
  }, [messages, sessionId]);

  // Theo dõi trạng thái kết nối mạng
  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
      if (navigator.onLine) {
        setConnectionError(false);
      }
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  // Add effect to handle mobile sidebar body scroll
  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }

    return () => {
      document.body.classList.remove('sidebar-open');
    };
  }, [isMobileSidebarOpen]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter để gửi tin nhắn
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (query.trim() && !isLoading) {
          sendMessage();
        }
      }
      
      // Ctrl/Cmd + K để focus vào input
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
      
      // Ctrl/Cmd + N để tạo chat mới
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        createNewSession();
      }
      
      // Ctrl/Cmd + B để toggle sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setSidebarCollapsed(!sidebarCollapsed);
      }
      
      // Escape để đóng modal
      if (e.key === 'Escape') {
        setShowDeleteModal(false);
        setShowClearAllModal(false);
        setShowKeyboardShortcuts(false);
      }
      
      // ? để hiện keyboard shortcuts
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          setShowKeyboardShortcuts(true);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [query, isLoading, sidebarCollapsed]);

  // Theo dõi sự kiện cuộn
  useEffect(() => {
    const handleScroll = () => {
      if (messagesContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
        // Nếu ở gần cuối, cho phép auto-scroll
        setShouldAutoScroll(scrollHeight - scrollTop - clientHeight < 100);
        setShowScrollToBottom(scrollHeight - scrollTop - clientHeight >= 100 && messages.length > 0);
      }
    };

    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      // Khi component mount, đặt vị trí cuộn ở cuối
      setTimeout(() => {
        if (container.scrollHeight > 0) {
          container.scrollTop = container.scrollHeight;
        }
      }, 100);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [messages.length]);

  // Auto scroll for new messages - chỉ khi shouldAutoScroll là true
  useEffect(() => {
    if (shouldAutoScroll && messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }
  }, [messages.length, shouldAutoScroll]);

  // Thêm hàm xử lý smooth scroll bằng requestAnimationFrame
  const smoothScrollToBottom = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      
      // Use setTimeout to ensure DOM has updated
      setTimeout(() => {
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;
        
        // Only scroll if content is taller than container
        if (scrollHeight > clientHeight) {
          container.scrollTo({
            top: scrollHeight,
            behavior: 'smooth'
          });
        }
      }, 50);
    }
  };

  // Hàm scroll to bottom manual
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
      setShouldAutoScroll(true);
    }
  };

  // Tạo phiên chat mới
  const createNewSession = async () => {
    try {
      // Tạo phiên chat mới từ server
      const response = await axios.post(API_ENDPOINTS.NEW_SESSION, {}, {
        headers: DEFAULT_HEADERS,
        withCredentials: true
      });
      
      const newSessionId = response.data.session_id;
      setSessionId(newSessionId);
      setMessages([]);
      
      // Thêm phiên này vào localStorage
      saveLocalChatHistory(newSessionId, []);
      
      // Đảm bảo đóng sidebar mobile khi tạo mới phiên chat
      setIsMobileSidebarOpen(false);
    } catch (error) {
      console.error('Error creating new session:', error);
      // Tạo phiên chat local nếu API lỗi
      const fallbackSessionId = `local_${new Date().getTime()}`;
      setSessionId(fallbackSessionId);
      setMessages([]);
      saveLocalChatHistory(fallbackSessionId, []);
    }
  };

  // Lấy lịch sử chat của một phiên cụ thể
  const loadChatSession = async (sessionId: string) => {
    try {
      setIsLoadingHistory(true);
      
      // Kiểm tra nếu session ID có trong localStorage
      const localMessages = loadLocalChatHistory(sessionId);
      if (localMessages && localMessages.length > 0) {
        setSessionId(sessionId);
        
        // Đóng sidebar mobile sau khi chọn phiên chat
        setIsMobileSidebarOpen(false);
        
        // Đặt shouldAutoScroll để cuộn xuống
        setShouldAutoScroll(true);
        
        // Đặt messages sau đó mới tắt loading
        setMessages(localMessages);
        
        // Đợi ngắn để DOM cập nhật trước khi cuộn xuống và tắt loading
        setTimeout(() => {
          smoothScrollToBottom();
          setIsLoadingHistory(false);
        }, 50);
        
        return;
      }
      
      // Nếu không có trong localStorage, tải từ server
      const response = await axios.get(API_ENDPOINTS.CHAT_SESSION(sessionId), {
        headers: DEFAULT_HEADERS,
        withCredentials: true
      });
      
      if (response.data.chat_history) {
        // Hàm xử lý và sửa nội dung từ lịch sử
        const fixHistoryContent = (content: string): string => {
          // Biểu thức chính quy để kiểm tra nếu nội dung là JSON
          const jsonRegex = /^\s*{.*"content"\s*:\s*"(.*)"\s*,\s*"format_type"\s*:\s*"(.*)"\s*}\s*$/;
          const match = content.match(jsonRegex);
          
          if (match) {
            // Nếu là JSON, lấy giá trị content
            let extractedContent = match[1];
            
            // Xử lý các ký tự đặc biệt
            extractedContent = extractedContent.replace(/\\n/g, '\n');
            extractedContent = extractedContent.replace(/\\"/g, '"');
            
            return extractedContent;
          }
          
          // Nếu không phải JSON, sử dụng hàm cleanContent đã định nghĩa
          return cleanContent(content);
        };

        // Debug để kiểm tra dữ liệu trả về
        console.log("Chat history data:", response.data.chat_history);

        // Hiển thị cuộc trò chuyện hai phía - sửa lỗi ánh xạ type
        const loadedMessages = response.data.chat_history.map((msg: any) => {
          // Mapping từ type và xác định đúng vai trò người gửi
          let msgType = msg.type || '';
          let sender = msgType;

          // Đảm bảo chuyển đổi đúng từ type/sender/role sang định dạng yêu cầu
          if (msg.sender) {
            sender = msg.sender;  // Nếu có trường sender thì ưu tiên sử dụng
          }

          // Kiểm tra nhiều trường hợp khác nhau của type/sender có thể có
          const isBot = 
            sender === 'ai' || 
            sender === 'assistant' || 
            msgType === 'ai' || 
            msgType === 'assistant' || 
            sender === 'bot';

          console.log(`Message processing: type=${msgType}, sender=${sender}, isBot=${isBot}`);
          
          return {
            // Đảm bảo mapping đúng giữa type/sender và role
            role: isBot ? 'ai' : 'human',
            content: fixHistoryContent(msg.content),
            timestamp: msg.timestamp || msg.created_at || new Date().toISOString(),
            // Đảm bảo tất cả tin nhắn cũ không ở trạng thái streaming
            isStreaming: false
          };
        });
        
        setMessages(loadedMessages);
        setSessionId(sessionId);
        // Đóng sidebar mobile sau khi chọn phiên chat
        setIsMobileSidebarOpen(false);
        
        // Lưu vào localStorage cho lần sau
        saveLocalChatHistory(sessionId, loadedMessages);
      }
    } catch (error) {
      console.error('Error loading chat session:', error);
      setIsLoadingHistory(false);
    }
  };

  // Sửa lại phần xử lý streaming từng chữ để khôi phục hiệu ứng typing
  const processStreamingText = async (text: string, currentContent: string) => {
    // Làm sạch nội dung trước khi hiển thị
    const cleanText = text;
    
    // Thay đổi cách thêm nội dung để tạo hiệu ứng typing
    const characters = cleanText.split('');
    let processedContent = currentContent;
    
    // Tạo hiệu ứng typing theo nhóm ký tự để tăng tốc độ hiển thị
    const chunkSize = characters.length > 300 ? 20 : 
                      characters.length > 150 ? 15 :
                      characters.length > 50 ? 8 : 3;
    
    for (let i = 0; i < characters.length; i += chunkSize) {
      // Thêm một nhóm ký tự cùng lúc
      const chunk = characters.slice(i, i + chunkSize).join('');
      processedContent += chunk;
      
      // Cập nhật nội dung - giảm tần suất update
      if (i % (chunkSize * 2) === 0 || i >= characters.length - chunkSize) {
        setMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage && lastMessage.isStreaming) {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = { ...lastMessage, content: processedContent };
            return newMessages;
          }
          return prev;
        });
        
        // Cuộn xuống nếu cần
        if (shouldAutoScroll) {
          // Use requestAnimationFrame for smoother scrolling during streaming
          requestAnimationFrame(() => {
            if (messagesContainerRef.current) {
              const container = messagesContainerRef.current;
              const scrollHeight = container.scrollHeight;
              const clientHeight = container.clientHeight;
              
              // Only scroll if content actually overflows and we're near bottom
              if (scrollHeight > clientHeight) {
                const currentScrollTop = container.scrollTop;
                const maxScroll = scrollHeight - clientHeight;
                const isNearBottom = maxScroll - currentScrollTop < 100;
                
                if (isNearBottom) {
                  container.scrollTop = scrollHeight;
                }
              }
            }
          });
        }
      }
      
      // Giảm độ trễ để tăng tốc
      if (characters.length > 500) {
        await new Promise(resolve => setTimeout(resolve, 1));
      } else if (characters.length > 200) {
        await new Promise(resolve => setTimeout(resolve, 3));
      } else if (characters.length > 50) {
        await new Promise(resolve => setTimeout(resolve, 5));
      } else {
        await new Promise(resolve => setTimeout(resolve, 8));
      }
    }
    
    // Cập nhật cuối cùng để đảm bảo nội dung hoàn chỉnh
    setMessages(prev => {
      const lastMessage = prev[prev.length - 1];
      if (lastMessage && lastMessage.isStreaming) {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { ...lastMessage, content: processedContent };
        return newMessages;
      }
      return prev;
    });
    
    return processedContent;
  };

  // Component hiển thị AI đang suy nghĩ - Enhanced Thinking Indicator
  const TypingIndicator = () => {
    return (
      <div className="group mb-6">
        {/* AI Thinking Header */}
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white rounded-lg flex items-center justify-center mr-3 shadow-md animate-pulse">
            <FaRobot size={14} />
          </div>
          <div className="flex items-center space-x-2">
           
            <span className="text-xs bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-2 py-1 rounded-full border border-blue-200 font-medium animate-pulse">
              Trợ lý ảo Khoa CNTT đang suy nghĩ
            </span>
            <span className="text-xs text-gray-400 font-medium">
              {new Date().toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>

        {/* AI Thinking Animation */}
        <div className="ml-11">
          <div className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
            {/* Thinking Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-blue-700">Đang xử lý yêu cầu của bạn</span>
              </div>
            </div>

            {/* Thinking Content */}
            <div className="p-4">
              <div className="flex items-center text-gray-600">
                <div className="flex items-center space-x-1 mr-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
                <span className="text-sm font-medium text-gray-700">AI đang phân tích và tạo phản hồi</span>
              </div>
              
              {/* Progress bar animation */}
              <div className="mt-3 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 rounded-full thinking-progress"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Gửi tin nhắn đến chatbot
  const sendMessage = async () => {
    if (!query.trim() || isLoading) return;

    // Tạo session ID mới nếu chưa có
    let currentSessionId = sessionId;
    if (!currentSessionId) {
      try {
        const response = await axios.post(API_ENDPOINTS.NEW_SESSION, {}, {
          headers: DEFAULT_HEADERS,
          withCredentials: true
        });
        currentSessionId = response.data.session_id;
        setSessionId(currentSessionId);
      } catch (error) {
        console.error('Error creating new session:', error);
        currentSessionId = `local_${new Date().getTime()}`;
        setSessionId(currentSessionId);
      }
    }

    // Lưu query hiện tại và clear input
    const currentQuery = query;
    setQuery('');

    // Auto-focus vào input ngay sau khi clear
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);

    // Thêm tin nhắn của người dùng vào danh sách
    const userMessage: Message = { 
      role: 'human', 
      content: currentQuery, 
      timestamp: new Date().toISOString() 
    };
    
    // Cập nhật messages với user message
    setMessages(prev => [...prev, userMessage]);
    
    // Bắt đầu hiển thị trạng thái đang suy nghĩ
    setIsLoading(true);
    setIsTyping(true);

    // Đảm bảo cuộn xuống sau khi thêm tin nhắn người dùng
    setShouldAutoScroll(true);
    
    try {
      // Gửi yêu cầu đến API
      const response = await fetch(API_ENDPOINTS.CHAT, {
        method: 'POST',
        headers: {
          ...DEFAULT_HEADERS,
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify({
          query: currentQuery,
          session_id: currentSessionId,
        }),
        credentials: 'include',
      });

      // Kiểm tra response
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
      }

      // Xử lý dữ liệu stream
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body reader not available');
      }

      let botResponse = '';
      let receivedFirstChunk = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Giải mã dữ liệu gửi về
        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.substring(6);
            
            // Bỏ qua nếu data rỗng
            if (!data.trim()) continue;
            
            try {
              const jsonData = JSON.parse(data);
              
              // Lấy session ID từ response đầu tiên
              if (jsonData.type === 'session_id') {
                currentSessionId = jsonData.session_id;
                setSessionId(currentSessionId);
                continue;
              }
              
              // Xử lý lỗi
              if (jsonData.type === 'error') {
                console.error('Error from server:', jsonData.message);
                throw new Error(jsonData.message);
              }
              
              // Khi nhận được dữ liệu đầu tiên, tắt trạng thái đang suy nghĩ và bắt đầu streaming
              if (!receivedFirstChunk) {
                receivedFirstChunk = true;
                setIsTyping(false);
                
                // Thêm message streaming
                setMessages(prev => {
                  const newMessages = [...prev, { 
                    role: 'ai' as const, 
                    content: '', 
                    isStreaming: true, 
                    timestamp: new Date().toISOString() 
                  }];
                  return newMessages;
                });
              }
              
              // Xử lý format trả về từ API
              if (jsonData.content && jsonData.format_type === 'markdown') {
                botResponse = await processStreamingText(jsonData.content, botResponse);
              } else if (jsonData.content) {
                botResponse = await processStreamingText(jsonData.content, botResponse);
              } else if (typeof jsonData === 'string') {
                botResponse = await processStreamingText(jsonData, botResponse);
              }
            } catch (parseError) {
              // Nếu không phải JSON hợp lệ, xử lý như text thường
              if (!receivedFirstChunk) {
                receivedFirstChunk = true;
                setIsTyping(false);
                
                // Thêm message streaming
                setMessages(prev => {
                  const newMessages = [...prev, { 
                    role: 'ai' as const, 
                    content: '', 
                    isStreaming: true, 
                    timestamp: new Date().toISOString() 
                  }];
                  return newMessages;
                });
              }
              
              // Xử lý data như text thường
              if (data && data.trim()) {
                botResponse = await processStreamingText(data, botResponse);
              }
            }
          }
        }
      }

      // Hoàn thành streaming và cập nhật tin nhắn cuối cùng
      setMessages(prev => 
        prev.map((msg, idx) => 
          idx === prev.length - 1 && msg.isStreaming 
            ? { 
                role: 'ai' as const, 
                content: cleanContent(postProcessEmails(botResponse)), 
                isStreaming: false, 
                timestamp: msg.timestamp || new Date().toISOString() 
              } 
            : msg
        )
      );

      // Tắt loading
      setIsLoading(false);
      setIsTyping(false);
      
      // Đảm bảo cuộn xuống sau khi hoàn thành
      setShouldAutoScroll(true);
      setTimeout(smoothScrollToBottom, 100);
      
      // Auto-focus vào input sau khi có lỗi
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 200);
      
      // Cập nhật danh sách phiên trò chuyện
      setTimeout(() => {
        updateLocalChatSessions();
      }, 500);
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Xóa tin nhắn đang streaming nếu có
      setMessages(prev => prev.filter(msg => !msg.isStreaming));
      
      // Tắt trạng thái đang suy nghĩ
      setIsTyping(false);
      setIsLoading(false);
      
      // Xác định loại lỗi và hiển thị thông báo phù hợp
      let errorMessage = 'Đã xảy ra lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.';
      
      if (!navigator.onLine) {
        errorMessage = 'Không có kết nối mạng. Vui lòng kiểm tra kết nối internet của bạn.';
        setConnectionError(true);
      } else if (error instanceof Error) {
        if (error.message.includes('Network') || error.message.includes('Failed to fetch')) {
          errorMessage = 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet và thử lại.';
          setConnectionError(true);
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Yêu cầu mất quá nhiều thời gian. Vui lòng thử lại.';
        }
      }
      
      // Thêm tin nhắn lỗi
      setMessages(prev => [...prev, { 
        role: 'ai' as const, 
        content: errorMessage, 
        timestamp: new Date().toISOString() 
      }]);
      
      // Lưu vào localStorage với messages hiện tại
      if (currentSessionId) {
        const currentMessages = [...messages, userMessage];
        saveLocalChatHistory(currentSessionId, currentMessages);
      }
      
      // Đảm bảo cuộn xuống
      setTimeout(smoothScrollToBottom, 100);
      
      // Auto-focus vào input sau khi có lỗi
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 200);
    }
  };

  // Bắt sự kiện nhấn Enter để gửi tin nhắn
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !isLoading) {
      sendMessage();
    }
  };

  // Cập nhật component MessageBubble để cải thiện hiển thị markdown
  const MessageBubble = ({ message, index, copyMessage, copiedMessageId }: { 
    message: Message; 
    index: number;
    copyMessage: (content: string, messageId: string) => Promise<void>;
    copiedMessageId: string | null;
  }) => {
    // Xử lý các liên kết đặc biệt trong nội dung hiển thị
    const processLinks = (content: string): string => {
      let processedContent = content;
      
      // Xử lý xuống dòng
      processedContent = processedContent.replace(/\\n/g, '\n');
      
      // CHỈ xử lý emails MỘT LẦN duy nhất ở đây
      processedContent = processedContent.replace(
        /\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/g, 
        '[$1](mailto:$1)'
      );
      
      return processedContent;
    };

    return (
      <div className="group mb-4">
        {/* Human Message - Modern Chat App Style */}
        {message.role === 'human' ? (
          <div className="flex justify-end">
            <div className="max-w-2xl w-full sm:w-auto">
              {/* User Message Bubble - WhatsApp/Discord Style */}
              <div className="relative group/message">
                {/* Message Content */}
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl rounded-tr-md px-3 sm:px-4 py-2 sm:py-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 cursor-pointer relative user-message"
                  onClick={() => copyMessage(message.content, `user-${index}`)}
                  title="Click to copy message"
                >
                  <p className="text-sm leading-relaxed font-medium break-words">{message.content}</p>
                  
                  {/* Copy indicator */}
                  {copiedMessageId === `user-${index}` && (
                    <div className="absolute -top-8 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md shadow-lg">
                      Đã copy!
                    </div>
                  )}
                  
                  {/* Subtle shine effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover/message:opacity-100 transition-opacity duration-300 rounded-2xl rounded-tr-md pointer-events-none"></div>
                  
                  {/* Copy icon on hover */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover/message:opacity-80 transition-opacity duration-200">
                    {copiedMessageId === `user-${index}` ? (
                      <FaCheck className="text-green-200 text-xs" />
                    ) : (
                      <FaCopy className="text-white/60 text-xs" />
                    )}
                  </div>
                </div>
                
                {/* Message Meta - Timestamp and Status */}
                <div className="flex items-center justify-end mt-1 mr-2 space-x-1 opacity-70 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="text-xs text-gray-500 font-medium">
                    {message.timestamp
                      ? new Date(message.timestamp).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : new Date().toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                    }
                  </span>
                  {/* Read status indicator - Animated */}
                  <div className="flex space-x-0.5">
                    <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* AI Message - Staggered Layout */
          <div className="w-full">
            <div className="max-w-4xl mx-auto">
              {/* AI Header */}
              <div className="flex items-center mb-2 sm:mb-3 ml-1 sm:ml-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white rounded-lg flex items-center justify-center mr-2 sm:mr-3 shadow-md">
                  <FaRobot size={12} className="sm:text-base" />
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2">
                 
                  <span className="text-xs bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-2 py-1 rounded-full border border-blue-200 font-medium shadow-sm">
                  Trợ lý AI
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    {message.timestamp
                      ? new Date(message.timestamp).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : new Date().toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                    }
                  </span>
                </div>
              </div>

              {/* AI Message Content - Staggered Card Layout */}
              <div className="ml-8 sm:ml-11">
                <div className={`bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden bot-message ${message.isStreaming ? 'streaming-message' : ''}`}>
                  {/* Content Header with subtle gradient */}
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-3 sm:px-4 py-2 border-b border-gray-100">
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium text-gray-700">Phản hồi từ AI</span>
                    </div>
                  </div>

                  {/* Main Content Area */}
                  <div className="p-3 sm:p-4">
                    {message.content ? (
                      <div className="prose prose-gray max-w-none">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeRaw, rehypeSanitize]}
                          components={{
                            a: ({node, href, children, ...props}) => {
                              // Xử lý href đơn giản
                              const finalHref = href || '';
                              const isEmail = finalHref.startsWith('mailto:');
                              const isExternalLink = finalHref.startsWith('http');
                              
                              return (
                                <a 
                                  href={finalHref}
                                  target={isExternalLink ? "_blank" : undefined}
                                  rel={isExternalLink ? "noopener noreferrer" : undefined}
                                  className={`inline-flex items-center gap-1 transition-all duration-200 font-medium px-2 py-1 rounded-md hover:underline decoration-2 underline-offset-2 ${
                                    isEmail 
                                      ? 'text-green-600 hover:text-green-800 hover:bg-green-50' 
                                      : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
                                  }`}
                                  {...props}
                                >
                                  {children}
                                  {isEmail && (
                                    <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                                    </svg>
                                  )}
                                  {isExternalLink && (
                                    <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
                                    </svg>
                                  )}
                                </a>
                              );
                            },
                            pre: ({node, ...props}) => (
                              <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl my-4 overflow-auto text-sm font-mono border shadow-md" {...props} />
                            ),
                            code: ({node, ...props}) => (
                              <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono border shadow-sm" {...props} />
                            ),
                            strong: ({node, ...props}) => (
                              <strong className="font-bold text-gray-900 bg-yellow-50 px-1 py-0.5 rounded" {...props} />
                            ),
                            ul: ({node, ...props}) => (
                              <div className="my-4">
                                <ul className="space-y-2" {...props} />
                              </div>
                            ),
                            ol: ({node, ...props}) => (
                              <div className="my-4">
                                <ol className="space-y-2" {...props} />
                              </div>
                            ),
                            li: ({node, ...props}) => (
                              <li className="flex items-start space-x-2 p-2 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors duration-200" {...props}>
                                <div className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                <div className="leading-relaxed text-gray-800 flex-1 text-xs">
                                  {props.children}
                                </div>
                              </li>
                            ),
                            p: ({node, ...props}) => (
                              <p className="mb-3 leading-relaxed text-gray-800 text-sm" {...props} />
                            ),
                            table: ({node, ...props}) => (
                              <div className="overflow-x-auto my-4 rounded-lg border border-gray-200 shadow-sm">
                                <table className="border-collapse w-full bg-white" {...props} />
                              </div>
                            ),
                            th: ({node, ...props}) => (
                              <th className="border border-gray-200 p-2 bg-gradient-to-r from-gray-50 to-blue-50 font-bold text-left text-gray-900 text-xs" {...props} />
                            ),
                            td: ({node, ...props}) => (
                              <td className="border border-gray-200 p-2 text-gray-800 hover:bg-gray-50 transition-colors duration-200 text-xs" {...props} />
                            ),
                            blockquote: ({node, ...props}) => (
                              <blockquote className="border-l-4 border-blue-500 pl-4 py-3 my-4 italic bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-800 rounded-r-lg shadow-sm" {...props} />
                            ),
                            h1: ({node, ...props}) => (
                              <h1 className="text-xl font-bold mb-4 text-gray-900 border-b-2 border-blue-200 pb-2" {...props} />
                            ),
                            h2: ({node, ...props}) => (
                              <h2 className="text-lg font-bold mb-3 text-gray-900 border-l-4 border-blue-500 pl-2" {...props} />
                            ),
                            h3: ({node, ...props}) => (
                              <h3 className="text-base font-bold mb-2 text-gray-900 bg-gray-50 px-2 py-1 rounded" {...props} />
                            ),
                          }}
                        >
                          {processLinks(message.content)}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <FaRobot className="text-gray-400 text-lg" />
                        </div>
                        <p className="text-gray-500 italic text-base">Không có nội dung</p>
                      </div>
                    )}
                  </div>

                  {/* Content Footer with actions */}
                  <div className="bg-gray-50 px-3 sm:px-4 py-2 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Được tạo bởi Trợ lý ảo Khoa CNTT</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => copyMessage(message.content, `message-${index}`)}
                          className="flex items-center space-x-1 p-1 hover:bg-gray-200 rounded transition-colors duration-200 text-gray-600 hover:text-gray-800 min-h-6 min-w-6"
                          title="Copy tin nhắn"
                        >
                          {copiedMessageId === `message-${index}` ? (
                            <>
                              <FaCheck size={10} className="text-green-600" />
                              <span className="text-green-600 hidden sm:inline">Đã copy</span>
                            </>
                          ) : (
                            <>
                              <FaCopy size={10} />
                              <span className="hidden sm:inline">Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Xóa một phiên chat cụ thể khỏi localStorage
  const deleteLocalChatSession = (sessionIdToDelete: string) => {
    try {
      const storedHistory = localStorage.getItem(CHAT_HISTORY_STORAGE_KEY);
      if (!storedHistory) return;

      const chatHistory: Record<string, Message[]> = JSON.parse(storedHistory);
      // Xóa phiên chat được chọn
      delete chatHistory[sessionIdToDelete];
      
      // Lưu lại lịch sử đã được cập nhật
      localStorage.setItem(CHAT_HISTORY_STORAGE_KEY, JSON.stringify(chatHistory));
      
      // Cập nhật danh sách phiên chat hiển thị
      updateLocalChatSessions();
      
      // Nếu đang ở phiên chat bị xóa, tạo phiên chat mới
      if (sessionId === sessionIdToDelete) {
        createNewSession();
      }
    } catch (error) {
      console.error('Error deleting chat session:', error);
    }
  };
  
  // Xóa tất cả lịch sử chat
  const clearAllLocalChatHistory = () => {
    try {
      // Xóa dữ liệu khỏi localStorage
      localStorage.removeItem(CHAT_HISTORY_STORAGE_KEY);
      
      // Cập nhật danh sách phiên chat
      setLocalChatSessions([]);
      
      // Tạo phiên chat mới
      createNewSession();
    } catch (error) {
      console.error('Error clearing all chat history:', error);
    }
  };

  // Hàm xác nhận và xóa phiên chat
  const confirmAndDeleteSession = (sessionIdToDelete: string) => {
    setDeleteSessionId(sessionIdToDelete);
    setShowDeleteModal(true);
  };

  // Hàm thực hiện xóa phiên chat
  const handleDeleteSession = () => {
    if (deleteSessionId) {
      deleteLocalChatSession(deleteSessionId);
      setDeleteSessionId(null);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (prompt: string) => {
    setQuery(prompt);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  // Copy message content
  const copyMessage = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };

  // Get dynamic greeting based on current time
  const getDynamicGreeting = () => {
    const currentHour = new Date().getHours();
    
    if (currentHour >= 5 && currentHour < 12) {
      return {
        text: "Chào buổi sáng",
        emoji: "🌻"
      };
    } else if (currentHour >= 12 && currentHour < 18) {
      return {
        text: "Chào buổi chiều", 
        emoji: "🌅"
      };
    } else {
      return {
        text: "Chào buổi tối",
        emoji: "🌙"
      };
    }
  };

  // Component Modal xác nhận đẹp
  const ConfirmModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    confirmText = "Xác nhận", 
    cancelText = "Hủy bỏ",
    isDestructive = false 
  }: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-white bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-xs w-full transform transition-all duration-300 scale-100 hover:scale-[1.02]">
          {/* Header với icon */}
          <div className="p-6 pb-3 text-center">
            <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 ${
              isDestructive ? 'bg-red-50 border-4 border-red-100' : 'bg-blue-50 border-4 border-blue-100'
            }`}>
              {isDestructive ? (
                <FaTrash className="text-red-500 text-lg" />
              ) : (
                <FaInfoCircle className="text-blue-500 text-lg" />
              )}
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 leading-relaxed text-xs">{message}</p>
          </div>

          {/* Actions */}
          <div className="p-4 pt-2 flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl transition-all duration-200 font-semibold text-xs"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 py-3 px-4 rounded-xl transition-all duration-200 font-semibold text-xs ${
                isDestructive 
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-red-200' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-blue-200'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Keyboard Shortcuts Modal
  const KeyboardShortcutsModal = () => {
    if (!showKeyboardShortcuts) return null;

    return (
      <div className="fixed inset-0 bg-white bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300">
          <div className="p-6 pb-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Phím tắt</h3>
              <button
                onClick={() => setShowKeyboardShortcuts(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes size={14} />
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Gửi tin nhắn</span>
                <div className="flex items-center space-x-1">
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">Ctrl</kbd>
                  <span className="text-xs text-gray-500">+</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">Enter</kbd>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Focus vào ô nhập</span>
                <div className="flex items-center space-x-1">
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">Ctrl</kbd>
                  <span className="text-xs text-gray-500">+</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">K</kbd>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Chat mới</span>
                <div className="flex items-center space-x-1">
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">Ctrl</kbd>
                  <span className="text-xs text-gray-500">+</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">N</kbd>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Tắt/mở thanh bên</span>
                <div className="flex items-center space-x-1">
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">Ctrl</kbd>
                  <span className="text-xs text-gray-500">+</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">B</kbd>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Đóng cửa sổ</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">Esc</kbd>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Hiện phím tắt</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">?</kbd>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 chat-container relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmNWY1ZjUiIGZpbGwtb3BhY2l0eT0iMC4zIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>
      
      {/* Professional White Layout */}
      <div className="flex h-screen relative z-10 max-w-full overflow-hidden">
        
        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* Sidebar - Enhanced Mobile Support */}
        <div className={`${isMobileSidebarOpen ? 'mobile-sidebar open' : 'mobile-sidebar'} lg:block lg:relative lg:transform-none ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-72 xl:w-80'} bg-white border-r border-gray-200 shadow-sm flex flex-col transition-all duration-300 overflow-hidden`}>
          {/* Sidebar Header */}
          <div className="p-3 md:p-4 border-b border-gray-100">
            {!sidebarCollapsed ? (
              <>
                <div className="flex items-center mb-3 md:mb-4">
                  <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-2 shadow-md">
                    <FaRobot className="text-white text-sm md:text-base" />
                  </div>
                  <div>
                    <h2 className="font-bold text-sm md:text-base text-gray-800">Trợ lý ảo Khoa CNTT</h2>
                    <p className="text-xs text-gray-500">Trợ lý ảo thông minh</p>
                  </div>
                </div>
                <button
                  onClick={createNewSession}
                  className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 text-gray-700 py-2 md:py-2.5 px-3 rounded-lg transition-all duration-200 flex items-center justify-center font-medium hover:shadow-sm text-xs md:text-sm"
                >
                  <FaPlus className="mr-2" size={10} />
                  Cuộc trò chuyện mới
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center space-y-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                  <FaRobot className="text-white text-base" />
                </div>
                <button
                  onClick={createNewSession}
                  className="w-10 h-10 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 text-gray-700 rounded-lg transition-all duration-200 flex items-center justify-center hover:shadow-sm"
                  title="Cuộc trò chuyện mới"
                >
                  <FaPlus size={12} />
                </button>
              </div>
            )}
          </div>

          {/* Enhanced Chat History */}
          <div className="flex-1 overflow-y-auto p-3 md:p-4">
            {!sidebarCollapsed && (
              <div className="flex items-center justify-between mb-3 md:mb-4 px-1 md:px-2">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 md:w-5 md:h-5 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                    <FaHistory className="text-blue-600 text-xs" />
                  </div>
                  <span className="text-xs md:text-sm font-bold text-gray-700">Lịch sử trò chuyện</span>
                </div>
                <div className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">
                  {localChatSessions.length}
                </div>
              </div>
            )}
            
            {localChatSessions.length === 0 ? (
              !sidebarCollapsed && (
                <div className="text-center py-8 md:py-12 px-2">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-lg">
                    <FaHistory className="text-gray-400 text-lg md:text-2xl" />
                  </div>
                  <h3 className="font-bold text-gray-700 text-sm md:text-base mb-2">Không có cuộc trò chuyện nào</h3>
                  <p className="text-gray-500 text-xs md:text-sm leading-relaxed px-2">
                    Bắt đầu cuộc trò chuyện đầu tiên<br />
                    để xây dựng lịch sử trò chuyện của bạn
                  </p>
                  <button
                    onClick={createNewSession}
                    className="mt-3 md:mt-4 px-3 md:px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg md:rounded-xl text-xs md:text-sm font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Bắt đầu trò chuyện
                  </button>
                </div>
              )
            ) : (
              <div className="space-y-1.5 md:space-y-2">
                {(showAllHistory ? localChatSessions : localChatSessions.slice(0, 2)).map((session, sessionIndex) => {
                  const isActive = sessionId === session.session_id;
                  const sessionDate = new Date(session.timestamp);
                  const now = new Date();
                  const isToday = sessionDate.toDateString() === now.toDateString();
                  const isYesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString() === sessionDate.toDateString();
                  let timeLabel = '';
                  if (isToday) {
                    timeLabel = sessionDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
                  } else if (isYesterday) {
                    timeLabel = 'Yesterday';
                  } else {
                    timeLabel = sessionDate.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' });
                  }
                  // Đã xóa hoàn toàn badge huy chương
                  return (
                    <div
                      key={session.session_id}
                      className={`group relative ${sidebarCollapsed ? 'p-2 md:p-3 justify-center' : 'p-3 md:p-4'} rounded-xl md:rounded-2xl cursor-pointer transition-all duration-300 ${
                        isActive 
                          ? 'bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200/60 shadow-lg shadow-blue-100/40 scale-[1.01] md:scale-[1.02]' 
                          : 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/30 border-2 border-transparent hover:border-gray-200/60 hover:shadow-md hover:scale-[1.005] md:hover:scale-[1.01]'
                      } ${sessionIndex === 0 ? 'ring-1 md:ring-2 ring-blue-100/50' : ''}`}
                      onClick={() => loadChatSession(session.session_id)}
                      title={sidebarCollapsed ? session.preview || 'New conversation' : undefined}
                    >
                      {/* Đã xóa hoàn toàn phần badge huy chương */}
                      <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''}`}>
                        {/* Enhanced Session Icon */}
                        <div className={`${sidebarCollapsed ? 'w-8 h-8 md:w-10 md:h-10' : 'w-9 h-9 md:w-11 md:h-11'} bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-xl md:rounded-2xl flex items-center justify-center ${sidebarCollapsed ? '' : 'mr-3 md:mr-4'} flex-shrink-0 shadow-lg group-hover:shadow-xl transition-all duration-300 ${isActive ? 'ring-1 md:ring-2 ring-blue-300/60' : ''}`}>
                          <FaRobot className="text-white text-sm md:text-base" />
                        </div>
                        {!sidebarCollapsed && (
                          <div className="flex-1 min-w-0">
                            {/* Session Title */}
                            <div className="flex items-center justify-between mb-1">
                              <h4 className={`text-sm font-bold truncate pr-2 ${isActive ? 'text-blue-700' : 'text-gray-800'}`}>{session.preview || 'New conversation'}</h4>
                              <span className={`text-xs font-medium px-2 py-1 rounded-full ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>{timeLabel}</span>
                            </div>
                            {/* Session Metadata */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-300'}`}></div>
                                <span className="text-xs text-gray-500 font-medium">{sessionDate.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric', year: sessionDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined })}</span>
                              </div>
                              {/* Action Buttons */}
                              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                {isActive && (
                                  <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                  </div>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    confirmAndDeleteSession(session.session_id);
                                  }}
                                  className="w-8 h-8 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200 flex items-center justify-center group/delete"
                                  title="Delete conversation"
                                >
                                  <FaTrash size={12} className="group-hover/delete:scale-110 transition-transform duration-200" />
                                </button>
                              </div>
                            </div>
                            {/* Preview Text */}
                            <div className="mt-2 px-3 py-2 bg-white/60 rounded-lg border border-gray-100">
                              <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{session.preview || 'No preview available'}</p>
                            </div>
                          </div>
                        )}
                      </div>
                      {/* Hover Effect Overlay */}
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${isActive ? 'opacity-20' : ''}`}></div>
                    </div>
                  );
                })}
                {/* Nút Xem thêm/Ẩn bớt */}
                {localChatSessions.length > 2 && (
                  <div className="flex justify-center mt-2">
                    <button
                      className="px-3 py-1 bg-gray-100 hover:bg-blue-100 text-blue-700 rounded-full text-xs font-medium border border-blue-100 transition-all duration-200"
                      onClick={() => {
                        if (window.innerWidth >= 1024) {
                          setShowHistoryModal(true);
                        } else {
                          setShowAllHistory(v => !v);
                        }
                      }}
                    >
                      {showAllHistory || showHistoryModal ? 'Ẩn bớt' : `Xem thêm (${localChatSessions.length - 2} cuộc trò chuyện...)`}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-100">
            {/* Connection Status */}
            {!isOnline && !sidebarCollapsed && (
              <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center text-red-600 text-xs">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                  Không có kết nối mạng
                </div>
              </div>
            )}
            
            {/* Toggle Button */}
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 hover:bg-gray-100 hover:text-gray-700 rounded-lg transition-all duration-200 text-gray-500"
                title={sidebarCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
              >
                {sidebarCollapsed ? <FaBars size={14} /> : <FaChevronLeft size={14} />}
              </button>
              {!sidebarCollapsed && (
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setShowKeyboardShortcuts(true)}
                    className="p-1 hover:bg-gray-100 hover:text-gray-700 rounded-lg transition-all duration-200 text-gray-500"
                    title="Xem phím tắt (nhấn ?)"
                  >
                    <FaKeyboard size={12} />
                  </button>
                  {localChatSessions.length > 0 && (
                    <button
                      onClick={() => {
                        setShowClearAllModal(true);
                      }}
                      className="p-1 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200"
                      title="Xóa tất cả cuộc trò chuyện"
                    >
                      <FaTrash size={12} />
                    </button>
                  )}
                </div>
              )}
            </div>
            
            {!sidebarCollapsed && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full mr-2 shadow-sm overflow-hidden">
                    <img src="/FIT.jpg" alt="FIT Logo" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-800">HCMUTE</p>
                    <p className="text-xs text-gray-500">Khoa Công nghệ Thông tin</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Close Button */}
          <button
            className="lg:hidden absolute top-4 right-4 w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all duration-200 shadow-sm"
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <FaTimes size={14} />
          </button>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-white chat-main">
          {/* Enhanced Status Bar */}
          <div className="hidden lg:flex bg-gradient-to-r from-gray-50 to-blue-50/30 border-b border-gray-200/60 px-6 py-3 items-center justify-between shadow-sm">
            <div className="flex items-center space-x-6">
              {/* Real-time Clock */}
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">
                  {currentTime.toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </span>
                <span className="text-xs text-gray-500">
                  {currentTime.toLocaleDateString('vi-VN', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              
              {/* Session Info */}
              {sessionStartTime && (
                <div className="flex items-center space-x-2 px-3 py-1 bg-white/60 rounded-lg border border-gray-200/60">
                  <span className="text-xs text-gray-600">Phiên trò chuyện:</span>
                  <span className="text-xs font-medium text-blue-600">
                    {Math.floor((currentTime.getTime() - sessionStartTime.getTime()) / 60000)}m
                  </span>
                </div>
              )}
              
              {/* Message Count */}
              <div className="flex items-center space-x-2 px-3 py-1 bg-white/60 rounded-lg border border-gray-200/60">
                <span className="text-xs text-gray-600">Tin nhắn:</span>
                <span className="text-xs font-medium text-indigo-600">{messages.length}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* AI Status */}
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  isLoading || isTyping ? 'bg-amber-400 animate-pulse' : 
                  messages.some(msg => msg.isStreaming) ? 'bg-blue-400 animate-pulse' : 
                  'bg-green-400'
                }`}></div>
                <span className="text-xs font-medium text-gray-700">
                  {isLoading || isTyping ? 'AI đang suy nghĩ...' : 
                   messages.some(msg => msg.isStreaming) ? 'AI đang trả lời...' : 
                   'Sẵn sàng trò chuyện'}
                </span>
              </div>
              
              {/* Connection Status */}
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className="text-xs font-medium text-gray-700">
                  {isOnline ? 'Trực tuyến' : 'Ngoại tuyến'}
                </span>
              </div>
            </div>
          </div>

          {/* Enhanced Mobile Header */}
          <div className="lg:hidden bg-gradient-to-r from-gray-50 to-blue-50/30 border-b border-gray-200/60 p-3 sm:p-4 flex items-center justify-between shadow-sm mobile-header">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2.5 sm:p-3 rounded-xl bg-white/80 hover:bg-white border border-gray-200/60 transition-all duration-200 shadow-sm active:scale-95 min-h-11 min-w-11"
            >
              <FaHistory size={14} className="text-gray-600" />
            </button>
            <div className="text-center flex-1 mx-4">
              <h1 className="font-bold text-base sm:text-lg text-gray-800">Trợ lý ảo Khoa CNTT</h1>
              <div className="flex items-center justify-center space-x-2 mt-1">
                <div className={`w-1.5 h-1.5 rounded-full ${
                  isLoading || isTyping ? 'bg-amber-400 animate-pulse' : 
                  messages.some(msg => msg.isStreaming) ? 'bg-blue-400 animate-pulse' : 
                  'bg-green-400'
                }`}></div>
                <p className="text-xs text-gray-600">
                  {isLoading || isTyping ? 'AI thinking...' : 
                   messages.some(msg => msg.isStreaming) ? 'AI responding...' : 
                   'Ready to chat'}
                </p>
              </div>
            </div>
            <button
              onClick={createNewSession}
              className="p-2.5 sm:p-3 rounded-xl bg-white/80 hover:bg-white border border-gray-200/60 transition-all duration-200 shadow-sm active:scale-95 min-h-11 min-w-11"
            >
              <FaPlus size={14} className="text-gray-600" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
            {/* Scrollable Messages Container */}
            <div 
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto overflow-x-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50 messages-container"
              style={{ 
                WebkitOverflowScrolling: 'touch',
                scrollBehavior: 'smooth'
              }}
            >
              {messages.length === 0 ? (
                /* Welcome Screen - Simple Centered Design */
                <div className="flex flex-col items-center justify-center min-h-full px-4 py-8 mobile-messages">
                  {/* Beta Notification - Move to top */}
                  <div className="w-full max-w-3xl mb-6 bg-amber-50 border border-amber-200 rounded-lg p-3 shadow-sm">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mr-2 flex-shrink-0">
                        <FaInfoCircle className="text-amber-600 text-base" />
                      </div>
                      <div>
                        <h3 className="font-bold text-amber-800 mb-1 text-sm">Phiên bản Beta</h3>
                        <p className="text-amber-700 leading-relaxed text-xs">
                          Chào mừng bạn đến với Trợ lý ảo Khoa Công nghệ Thông tin - Trợ lý AI tiên tiến của Khoa Công nghệ Thông tin - HCMUTE. 
                          Đây là phiên bản thử nghiệm, vui lòng góp ý qua{' '}
                          <a 
                            href="https://forms.gle/Kz7WFbVmEhMjkMB3A" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="underline hover:text-amber-800 font-medium transition-colors"
                          >
                            biểu mẫu phản hồi
                          </a>.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Main Welcome Content */}
                  <div className="flex-1 flex flex-col items-center justify-center max-w-3xl w-full">
                    {/* Greeting */}
                    <div className="text-center mb-8">
                      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-500 mb-3">
                        {getDynamicGreeting().text} {getDynamicGreeting().emoji}
                      </h1>
                    </div>

                    {/* Suggested Questions */}
                    <div className="w-full max-w-3xl">
                      <div className="flex items-center mb-4">
                        <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center mr-2">
                          <span className="text-orange-500 text-xs">✨</span>
                        </div>
                        <h3 className="text-gray-600 font-medium text-sm">Các câu hỏi phổ biến</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3">
                        <button
                          onClick={() => handleSuggestionClick("Tôi muốn biết về học bổng của trường")}
                          className="flex items-center p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left group"
                        >
                          <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                            <span className="text-yellow-600 text-base">💡</span>
                          </div>
                          <span className="text-gray-700 group-hover:text-blue-600 transition-colors text-sm">
                            Tôi muốn biết về học bổng của trường
                          </span>
                        </button>

                        <button
                          onClick={() => handleSuggestionClick("Có nên học ở HCMUTE không?")}
                          className="flex items-center p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left group"
                        >
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                            <span className="text-blue-600 text-base">🎓</span>
                          </div>
                          <span className="text-gray-700 group-hover:text-blue-600 transition-colors text-sm">
                            Có nên học ở HCMUTE không?
                          </span>
                        </button>

                        <button
                          onClick={() => handleSuggestionClick("Điểm chuẩn các ngành năm trước là bao nhiêu?")}
                          className="flex items-center p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left group"
                        >
                          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                            <span className="text-red-600 text-base">⚠️</span>
                          </div>
                          <span className="text-gray-700 group-hover:text-blue-600 transition-colors text-sm">
                            Điểm chuẩn các ngành năm trước là bao nhiêu?
                          </span>
                        </button>

                        <button
                          onClick={() => handleSuggestionClick("Ngành Công nghệ thông tin học những gì?")}
                          className="flex items-center p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left group"
                        >
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                            <span className="text-green-600 text-base">💻</span>
                          </div>
                          <span className="text-gray-700 group-hover:text-blue-600 transition-colors text-sm">
                            Ngành Công nghệ thông tin học những gì?
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Chat Messages */
                <div className="w-full">
                  <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-1 mobile-messages">
                    {/* Add some top padding for better visual hierarchy */}
                    <div className="h-2 sm:h-4"></div>
                    
                    {messages.map((msg, index) => (
                      <MessageBubble key={index} message={msg} index={index} copyMessage={copyMessage} copiedMessageId={copiedMessageId} />
                    ))}
                    {/* Only show TypingIndicator when thinking, not when streaming */}
                    {(isTyping || isLoading) && !messages.some(msg => msg.isStreaming) && <TypingIndicator />}
                    
                    {/* Add bottom padding for better scrolling experience */}
                    <div className="h-6 sm:h-8"></div>
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              )}
              
              {/* Scroll to Bottom Button */}
              {showScrollToBottom && (
                <div className="fixed bottom-24 sm:bottom-32 right-4 sm:right-8 z-10">
                  <button
                    onClick={scrollToBottom}
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center transform hover:scale-105 active:scale-95"
                    title="Cuộn xuống tin nhắn mới nhất"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Fixed Input Area */}
          <div className="border-t border-gray-200/60 bg-gradient-to-r from-white to-gray-50/30 shadow-lg backdrop-blur-sm mobile-input-container">
            {/* Quick Actions Bar */}
            {messages.length > 0 && (
              <div className="max-w-4xl mx-auto px-4 pt-3">
                {/* Desktop: Hiển thị các nút như cũ */}
                <div className="hidden md:flex items-center space-x-2 overflow-x-auto scrollbar-hide">
                  <span className="text-xs text-gray-500 font-medium whitespace-nowrap mr-2">Hành động nhanh:</span>
                  <button onClick={() => setQuery("Giải thích điều này một cách đơn giản")} className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs rounded-full border border-blue-200/60 transition-all duration-200 whitespace-nowrap min-h-8">🔍 Giải thích đơn giản</button>
                  <button onClick={() => setQuery("Cung cấp thêm chi tiết về điều này")} className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs rounded-full border border-indigo-200/60 transition-all duration-200 whitespace-nowrap min-h-8">📚 Thêm chi tiết</button>
                  <button onClick={() => setQuery("Đâu là ưu và nhược điểm?")} className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs rounded-full border border-purple-200/60 transition-all duration-200 whitespace-nowrap min-h-8">⚖️ Ưu & Nhược điểm</button>
                  <button onClick={() => setQuery("Bạn có thể tóm tắt điều này không?")} className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-xs rounded-full border border-green-200/60 transition-all duration-200 whitespace-nowrap min-h-8">📝 Tóm tắt</button>
                  <button onClick={createNewSession} className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs rounded-full border border-gray-200/60 transition-all duration-200 whitespace-nowrap min-h-8">🔄 Cuộc trò chuyện mới</button>
                </div>
                {/* Mobile: Dropdown */}
               
              </div>
            )}
            
            <div className="max-w-4xl mx-auto p-3 sm:p-4">
              {/* Enhanced typing indicator for active chat */}
              {messages.length > 0 && isTyping && (
                <div className="mb-3 sm:mb-4 text-center">
                  <div className="inline-flex items-center space-x-2 bg-blue-50/80 px-3 sm:px-4 py-2 rounded-full border border-blue-200/60">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                    </div>
                    <p className="text-xs sm:text-sm text-blue-700 font-medium">Trợ lý ảo đang phản hồi...</p>
                  </div>
                </div>
              )}
              
              <div className="relative flex items-center bg-white border-2 border-gray-300/60 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl hover:border-blue-400/60 focus-within:border-blue-500/60 focus-within:shadow-xl transition-all duration-300 mobile-input">
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                  onChange={(e) => {
                    if (e.target.value.length <= 1000) {
                      setQuery(e.target.value);
                    }
                  }}
                    onKeyPress={handleKeyPress}
                  placeholder={!isOnline ? "Không có kết nối internet..." : "Hỏi Trợ lý ảo Khoa Công nghệ Thông tin bất cứ điều gì..."}
                  className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-transparent border-0 focus:outline-none text-gray-800 placeholder-gray-500 text-sm sm:text-base min-h-12"
                  disabled={isLoading || !isOnline}
                />
                
                {/* Enhanced Input Statistics */}
                <div className="hidden sm:flex items-center space-x-3 mr-4 text-sm">
                  {/* Word Count */}
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-400">Từ:</span>
                    <span className={`text-xs font-semibold ${
                      wordCount > 50 ? 'text-amber-500' : 'text-gray-600'
                    }`}>
                      {wordCount}
                    </span>
                  </div>
                  
                  {/* Character Count */}
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-400">Ký tự:</span>
                    <span className={`text-xs font-semibold ${
                      query.length > 900 ? 'text-red-500' : 
                      query.length > 800 ? 'text-amber-500' : 
                      'text-gray-600'
                    }`}>
                      {query.length}/1000
                    </span>
                  </div>
                </div>
                
                  <button
                  className={`m-2 sm:m-3 p-3 sm:p-4 rounded-xl transition-all duration-300 min-h-11 min-w-11 flex items-center justify-center ${
                    isLoading || !query.trim() || !isOnline
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95'
                    }`}
                    onClick={sendMessage}
                  disabled={isLoading || !query.trim() || !isOnline}
                  title={!isOnline ? "No internet connection" : isLoading ? "Sending..." : "Send message (Ctrl+Enter)"}
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FaPaperPlane size={16} className="sm:text-lg" />
                    )}
                  </button>
                </div>
              
              {/* Enhanced Status Row */}
              <div className="flex flex-col sm:flex-row items-center justify-between mt-2 sm:mt-3 text-xs space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-2 sm:space-x-4 text-gray-500">
                  <span className="hidden sm:inline">💡 Nhấn Ctrl+Enter để gửi</span>
                  <span className="sm:hidden">💡 Nhấn nút gửi</span>
                  {sessionStartTime && (
                    <span>⏱️ Phiên trò chuyện: {Math.floor((currentTime.getTime() - sessionStartTime.getTime()) / 60000)}phút</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {/* Mobile Character Count */}
                  <div className="sm:hidden flex items-center space-x-1">
                    <span className={`text-xs font-semibold ${
                      query.length > 900 ? 'text-red-500' : 
                      query.length > 800 ? 'text-amber-500' : 
                      'text-gray-600'
                    }`}>
                      {query.length}/1000
                    </span>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <span className="text-gray-500 font-medium">
                    {isOnline ? 'Đã kết nối' : 'Mất kết nối'}
                  </span>
                </div>
              </div>
                
                {/* Professional Disclaimer */}
              <p className="text-xs text-gray-500 text-center mt-2 sm:mt-3 font-medium px-2">
                Trợ lý ảo Khoa CNTT có thể tạo ra thông tin không chính xác. Vui lòng xác minh các chi tiết quan trọng.
                </p>
              </div>
          </div>
        </div>
      </div>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteSession}
        title="Xác nhận xóa cuộc trò chuyện"
        message="Bạn có chắc chắn muốn xóa cuộc trò chuyện này?"
      />

      {/* Confirm Clear All Modal */}
      <ConfirmModal
        isOpen={showClearAllModal}
        onClose={() => setShowClearAllModal(false)}
        onConfirm={clearAllLocalChatHistory}
        title="Xác nhận xóa tất cả lịch sử"
        message="Bạn có chắc chắn muốn xóa tất cả lịch sử trò chuyện? Hành động này không thể hoàn tác."
        isDestructive={true}
      />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal />

      {/* Modal hiển thị toàn bộ lịch sử chat trên PC */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative">
            <button
              className="absolute top-3 right-3 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
              onClick={() => setShowHistoryModal(false)}
            >
              <FaTimes size={16} />
            </button>
            <h3 className="text-lg font-bold mb-4 text-blue-700">Tất cả lịch sử trò chuyện</h3>
            <div className="max-h-[60vh] overflow-y-auto space-y-2">
              {localChatSessions.map((session, sessionIndex) => {
                const isActive = sessionId === session.session_id;
                const sessionDate = new Date(session.timestamp);
                const now = new Date();
                const isToday = sessionDate.toDateString() === now.toDateString();
                const isYesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString() === sessionDate.toDateString();
                let timeLabel = '';
                if (isToday) {
                  timeLabel = sessionDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
                } else if (isYesterday) {
                  timeLabel = 'Yesterday';
                } else {
                  timeLabel = sessionDate.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' });
                }
                return (
                  <div
                    key={session.session_id}
                    className={`group relative p-3 rounded-xl cursor-pointer transition-all duration-300 ${isActive ? 'bg-blue-50 border-2 border-blue-200/60' : 'hover:bg-gray-50 border border-transparent'}`}
                    onClick={() => {
                      loadChatSession(session.session_id);
                      setShowHistoryModal(false);
                    }}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                        <FaRobot className="text-white text-base" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`text-sm font-bold truncate pr-2 ${isActive ? 'text-blue-700' : 'text-gray-800'}`}>{session.preview || 'New conversation'}</h4>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>{timeLabel}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-300'}`}></div>
                          <span className="text-xs text-gray-500 font-medium">{sessionDate.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric', year: sessionDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined })}</span>
                        </div>
                        <div className="mt-2 px-3 py-2 bg-white/60 rounded-lg border border-gray-100">
                          <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{session.preview || 'No preview available'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 