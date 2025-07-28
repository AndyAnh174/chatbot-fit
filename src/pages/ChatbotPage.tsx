import { useState, useEffect, useRef } from 'react';
import { FaRobot, FaPaperPlane, FaHistory, FaTrash, FaPlus, FaTimes, FaInfoCircle} from 'react-icons/fa';
import axios from 'axios';
import { API_ENDPOINTS, DEFAULT_HEADERS } from '../config';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import logoFIT from '../assets/logo-cntt2021.png';

// CSS cho typing animation
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

// Chat suggestions

export function ChatbotPage() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [, setChatSessions] = useState<Session[]>([]);
  const [localChatSessions, setLocalChatSessions] = useState<Session[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [, setScrollPosition] = useState(0);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const MAX_INPUT_LENGTH = 1000; // Thêm giới hạn ký tự tối đa

  // Hàm xử lý và làm sạch nội dung
  const cleanContent = (content: string): string => {
    let processedContent = content;
    
    // Xử lý các URL bị cắt ngang đặc biệt
    processedContent = processedContent.replace(/\((https?:\/\/[^)]+)\)/g, '[**$1**]($1)'); 
    processedContent = processedContent.replace(/^\s*s:\/\/([^\s]+)/gm, '[**https://$1**](https://$1)');
    
    // Kiểm tra và trích xuất nội dung từ dạng JSON
    const jsonRegex = /\{"content"\s*:\s*"([^"]*?)"\s*,\s*"format_type"\s*:\s*"([^"]*?)"\}/g;
    const jsonMatch = jsonRegex.exec(processedContent);
    if (jsonMatch) {
      // Lấy chỉ phần nội dung từ JSON
      processedContent = jsonMatch[1];
      // console.log("Đã tìm thấy và xử lý JSON:", processedContent);
    }
    
    // Thay thế ký tự xuống dòng
    processedContent = processedContent.replace(/\\n/g, '\n');
    
    // Xử lý URL bị lồng nhau
    processedContent = processedContent.replace(/\[(https?:\/\/[^\]]+)\]\((https?:\/\/[^)]+)\)/g, '[**$1**]($1)');
    
    // Xử lý URL bị lặp lại
    processedContent = processedContent.replace(/\(https?:\/\/\[https?:\/\/(.*?)\]\(https?:\/\/(.*?)\)\)/g, '(https://$2)');
    
    // Xử lý email
    processedContent = processedContent.replace(/\[([^@\]]+@[^@\]]+)\]\(mailto:([^)]+)\)/g, '[**$1**](mailto:$1)');
    
    // Loại bỏ các chuỗi lặp lại trong URL
    processedContent = processedContent.replace(/\(https?:\/\/https?:\/\//g, '(https://');
    
    // Sửa lỗi khi URL có nhiều [ hoặc ] lồng nhau
    processedContent = processedContent.replace(/\[\[(.+?)\]\]/g, '[$1]');
    
    // Sửa lỗi URL với nhiều dấu ngoặc
    processedContent = processedContent.replace(/\(https?:\/\/\((.+?)\)\)/g, '(https://$1)');
    
    // Xử lý nếu Facebook và Trung tâm tin học xuất hiện liền nhau
    processedContent = processedContent.replace(
      /(Facebook[^:]*):?\s*\*?(https?:\/\/[^\s*\n]+)\*?\s*\*\s+(Trung tâm tin học[^:]*)/gi,
      '$1: [**$2**]($2)\n\n* $3'
    );
    
    // Sửa các dạng markdown bị lỗi
    processedContent = processedContent.replace(/\]\[/g, '] [');
    
    return processedContent;
  };

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
    fetchChatSessions();
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

  // Theo dõi sự kiện cuộn
  useEffect(() => {
    const handleScroll = () => {
      if (messagesContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
        // Lưu vị trí cuộn hiện tại
        setScrollPosition(scrollTop);
        
        // Kiểm tra nếu người dùng đã cuộn lên trên
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
        
        // Chỉ tự động cuộn nếu người dùng đang ở cuối cuộc trò chuyện
        setShouldAutoScroll(isAtBottom);
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
  }, []);

  // Cuộn xuống tin nhắn mới nhất với điều kiện
  useEffect(() => {
    if (shouldAutoScroll && messagesEndRef.current && !isLoadingHistory && messages.length > 0) {
      // Sử dụng timeout để đảm bảo DOM đã cập nhật
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [messages.length, shouldAutoScroll, isLoadingHistory]); // Chỉ theo dõi length thay vì toàn bộ messages array

  // Thêm hàm xử lý smooth scroll bằng requestAnimationFrame
  const smoothScrollToBottom = () => {
    if (messagesContainerRef.current && shouldAutoScroll) {
      const container = messagesContainerRef.current;
      const scrollHeight = container.scrollHeight;
      
      requestAnimationFrame(() => {
        container.scrollTop = scrollHeight;
      });
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

  // Lấy danh sách phiên chat từ server
  const fetchChatSessions = async () => {
    try {
      setIsLoadingHistory(true);
      const response = await axios.get(API_ENDPOINTS.CHAT_HISTORY, {
        headers: DEFAULT_HEADERS,
        withCredentials: true
      });
      if (response.data.sessions) {
        // NOTE: Lưu lại nhưng không hiện thị dữ liệu này
        setChatSessions(response.data.sessions);
      }
    } catch (error) {
      console.error('Error fetching chat sessions:', error);
    } finally {
      setIsLoadingHistory(false);
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
        
        // Scroll lên đầu tin nhắn
        setTimeout(() => {
          if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          }
          setIsLoadingHistory(false);
        }, 100);
        
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

        // Scroll lên đầu tin nhắn
        setTimeout(() => {
          if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          }
          setIsLoadingHistory(false);
        }, 100);
      }
    } catch (error) {
      console.error('Error loading chat session:', error);
      setIsLoadingHistory(false);
    }
  };

  // Thêm hàm xử lý scroll cho lịch sử chat
  const handleHistoryScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const { scrollTop, scrollHeight, clientHeight } = target;
    
    // Nếu đã scroll đến cuối, tự động cuộn xuống tin nhắn mới nhất
    if (scrollHeight - scrollTop - clientHeight < 50) {
      setShouldAutoScroll(true);
    } else {
      setShouldAutoScroll(false);
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
          setTimeout(() => {
            if (messagesContainerRef.current) {
              messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
            }
          }, 0);
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

  // Component hiển thị 3 chấm đang suy nghĩ
  const TypingIndicator = () => {
    return (
      <div className="group mb-8">
        {/* Message Header */}
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-white border-2 border-gray-200 text-gray-600 rounded-xl flex items-center justify-center mr-4 shadow-sm">
            <FaRobot size={16} />
          </div>
          <div className="flex items-center space-x-3">
                            <span className="font-semibold text-gray-800 text-base">ChatBot HCM UTE RTIC</span>
            <span className="text-xs bg-gray-50 text-gray-600 px-3 py-1.5 rounded-full border border-gray-200 font-medium">
              Đang phản hồi
            </span>
            <span className="text-xs text-gray-400 font-medium">
              {new Date().toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>

        {/* Typing Animation */}
        <div className="ml-14">
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center text-gray-500">
              <span className="mr-3 text-sm font-medium">Đang soạn phản hồi</span>
              <div className="typing-indicator">
                <div className="dot bg-gray-400"></div>
                <div className="dot bg-gray-400"></div>
                <div className="dot bg-gray-400"></div>
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
                content: cleanContent(botResponse), 
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
      
      // Thêm tin nhắn lỗi
      setMessages(prev => [...prev, { 
        role: 'ai' as const, 
        content: 'Đã xảy ra lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.', 
        timestamp: new Date().toISOString() 
      }]);
      
      // Lưu vào localStorage với messages hiện tại
      if (currentSessionId) {
        const currentMessages = [...messages, userMessage];
        saveLocalChatHistory(currentSessionId, currentMessages);
      }
      
      // Đảm bảo cuộn xuống
      setTimeout(smoothScrollToBottom, 100);
    }
  };

  // Bắt sự kiện nhấn Enter để gửi tin nhắn
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !isLoading) {
      sendMessage();
    }
  };

  // Cập nhật component MessageBubble để cải thiện hiển thị markdown
  const MessageBubble = ({ message }: { message: Message }) => {
    // Xử lý các liên kết đặc biệt trong nội dung hiển thị
    const processLinks = (content: string): string => {
      let processedContent = content;
      
      // Kiểm tra và xử lý trường hợp JSON từ server
      const jsonPattern = /\{"content":\s*"(.+?)"\s*,\s*"format_type":\s*"(.+?)"\}/;
      const jsonMatch = jsonPattern.exec(processedContent);
      if (jsonMatch) {
        processedContent = jsonMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
        return processedContent;
      }

      // Xử lý các trường hợp đặc biệt về xuống dòng
      processedContent = processedContent.replace(/\\n/g, '\n');
      
      // Xử lý mẫu đặc biệt "** ** Email:*" có trong ảnh
      processedContent = processedContent.replace(
        /\*\*\s?\*\*\s?Email:\*\*/g,
        '**Email:**'
      );
      
      // Xử lý mẫu "** Tiêu đề:*" rất phổ biến như trong ảnh
      processedContent = processedContent.replace(
        /\*\*\s+([^*:]+):\*\*/g, 
        '**$1:**'
      );
      
      // Xử lý trường hợp "** Tiêu đề:**"
      processedContent = processedContent.replace(
        /\*\*\s([^*:]+):\*\*/g, 
        '**$1:**'
      );
      
      // Xử lý các dấu ** lặp lại ở đầu dòng
      processedContent = processedContent.replace(
        /^(\s*)\*\*\s([^*:]+):/gm, 
        '$1**$2:'
      );
      
      // Xử lý mẫu "** Tiêu đề:" thiếu dấu ** cuối
      processedContent = processedContent.replace(
        /\*\*\s([^*:]+):/g, 
        '**$1:**'
      );
      
      // Xử lý pattern "**** Email:**" đặc biệt 
      processedContent = processedContent.replace(
        /\*\*\*\*\s?([^*:]+):\*\*/g, 
        '**$1:**'
      );
      
      // Xử lý email được bọc trong **
      processedContent = processedContent.replace(
        /\*\*(([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5}))\*\*/g, 
        '[$1](mailto:$1)'
      );
      
      // Xử lý email trong text
      processedContent = processedContent.replace(
        /([^*[\]])(([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5}))([^*[\]])/g, 
        '$1[$2](mailto:$2)$6'
      );
      
      // Xử lý URLs với "https**://" lỗi
      processedContent = processedContent.replace(
        /https\*\*:\/\//g,
        'https://'
      );
      
      // Xử lý URLs đặc biệt trong văn bản
      processedContent = processedContent.replace(
        /\*\*(https?:\/\/[^*\s]+)\*\*/g,
        '[$1]($1)'
      );
      
      // Dọn dẹp URLs
      processedContent = processedContent.replace(
        /\[(https?:\/\/[^\]]+)\]\((https?:\/\/[^)]+)\)\((https?:\/\/[^)]+)\)/g,
        '[$1]($1)'
      );
      
      // Xử lý trường hợp ** Tiêu đề:** trong danh sách
      processedContent = processedContent.replace(
        /^\s*\*\s+\*\*\s+([^*:]+):\*\*/gm, 
        '* **$1:**'
      );
      
      // Xử lý URL bị dư ( ở cuối 
      processedContent = processedContent.replace(
        /\(https?:\/\/([^)]+)\)\(/g,
        '(https://$1)('
      );
      
      // Đảm bảo tiêu đề trong danh sách luôn được in đậm
      processedContent = processedContent.replace(
        /\*\s+([^*:]+):/g, 
        '* **$1:**'
      );
      
      // Đảm bảo URLs được xử lý đúng trong danh sách
      processedContent = processedContent.replace(
        /\*\s+\*\*([^:*]+):\*\*\s+https?:\/\/([^\s]+)/g,
        '* **$1:** [https://$2](https://$2)'
      );
      
      // Xử lý URLs đặc biệt cho ảnh
      processedContent = processedContent.replace(
        /^\s*\*\*([^*:]+):\*\*\s*\*\*(https?:\/\/[^\s*]+)\*\*$/gm,
        '* **$1:** [$2]($2)'
      );
      
      return processedContent;
    };

    return (
      <div className="group mb-8">
        {/* Human Message */}
        {message.role === 'human' ? (
          <div className="flex justify-start">
            <div className="max-w-3xl w-full">
              {/* User Header */}
              <div className="flex items-center justify-start mb-4">
                <div className="flex items-center space-x-3 ml-4">
                  <div className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-sm font-bold">B</span>
                </div>
                  <span className="font-bold text-gray-900 text-base">FITer</span>
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

              {/* User Message Content - Asymmetric layout */}
              <div className="ml-14">
                <div className="bg-white border border-gray-300 text-gray-900 rounded-2xl p-5 shadow-md transform hover:scale-[1.01] hover:border-gray-400 transition-all duration-300">
                  <p className="leading-relaxed text-base font-medium">{message.content}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* AI Message - Staggered Layout */
          <div className="w-full">
            <div className="max-w-5xl mx-auto">
              {/* AI Header */}
              <div className="flex items-center mb-4 ml-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white rounded-xl flex items-center justify-center mr-4 shadow-md">
                  <FaRobot size={18} />
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-gray-900 text-base">ChatBot HCM UTE RTIC</span>
                  <span className="text-xs bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-200 font-medium shadow-sm">
                    Trợ lý AI thông minh
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
              <div className="ml-14">
                <div className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
                  {/* Content Header with subtle gradient */}
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-5 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium text-gray-700">Phản hồi từ AI</span>
                    </div>
                  </div>

                  {/* Main Content Area */}
                  <div className="p-5">
                    {message.content ? (
                      <div className="prose prose-gray max-w-none">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeRaw, rehypeSanitize]}
                          components={{
                            a: ({node, ...props}) => (
                              <a 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-blue-600 hover:text-blue-800 underline decoration-2 underline-offset-2 transition-colors duration-200 font-medium hover:bg-blue-50 px-1 py-0.5 rounded"
                                {...props}
                              />
                            ),
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
                              <li className="flex items-start space-x-3 p-2.5 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors duration-200" {...props}>
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                <div className="leading-relaxed text-gray-800 flex-1 text-sm">
                                  {props.children}
                                </div>
                              </li>
                            ),
                            p: ({node, ...props}) => (
                              <p className="mb-4 leading-relaxed text-gray-800 text-base" {...props} />
                            ),
                            table: ({node, ...props}) => (
                              <div className="overflow-x-auto my-5 rounded-xl border border-gray-200 shadow-sm">
                                <table className="border-collapse w-full bg-white" {...props} />
                              </div>
                            ),
                            th: ({node, ...props}) => (
                              <th className="border border-gray-200 p-3 bg-gradient-to-r from-gray-50 to-blue-50 font-bold text-left text-gray-900 text-sm" {...props} />
                            ),
                            td: ({node, ...props}) => (
                              <td className="border border-gray-200 p-3 text-gray-800 hover:bg-gray-50 transition-colors duration-200 text-sm" {...props} />
                            ),
                            blockquote: ({node, ...props}) => (
                              <blockquote className="border-l-4 border-blue-500 pl-5 py-4 my-5 italic bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-800 rounded-r-xl shadow-sm" {...props} />
                            ),
                            h1: ({node, ...props}) => (
                              <h1 className="text-2xl font-bold mb-5 text-gray-900 border-b-2 border-blue-200 pb-3" {...props} />
                            ),
                            h2: ({node, ...props}) => (
                              <h2 className="text-xl font-bold mb-4 text-gray-900 border-l-4 border-blue-500 pl-3" {...props} />
                            ),
                            h3: ({node, ...props}) => (
                              <h3 className="text-lg font-bold mb-3 text-gray-900 bg-gray-50 px-3 py-2 rounded-lg" {...props} />
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
                  <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Được tạo bởi ChatBot HCM UTE RTIC</span>
                      <div className="flex items-center space-x-3">
                       
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
    if (window.confirm('Bạn có chắc chắn muốn xóa cuộc trò chuyện này?')) {
      deleteLocalChatSession(sessionIdToDelete);
    }
  };
  
  // Hàm xác nhận và xóa tất cả lịch sử
  const confirmAndClearAllHistory = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tất cả lịch sử trò chuyện? Hành động này không thể hoàn tác.')) {
      clearAllLocalChatHistory();
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

  // Get dynamic greeting based on current time
  const getDynamicGreeting = () => {
    const currentHour = new Date().getHours();
    
    if (currentHour >= 5 && currentHour < 12) {
      return {
        text: "Chào buổi sáng",
        emoji: "🌅"
      };
    } else if (currentHour >= 12 && currentHour < 18) {
      return {
        text: "Chào buổi chiều", 
        emoji: "☀️"
      };
    } else {
      return {
        text: "Chào buổi tối",
        emoji: "🌙"
      };
    }
  };

  // Thêm hàm xử lý input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_INPUT_LENGTH) {
      setQuery(value);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmNWY1ZjUiIGZpbGwtb3BhY2l0eT0iMC4zIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>
      
      {/* Professional White Layout */}
      <div className="flex h-screen relative z-10">
        
        {/* Sidebar - Clean White Theme */}
        <div className={`${isMobileSidebarOpen ? 'block' : 'hidden'} lg:block w-80 bg-white border-r border-gray-200 shadow-sm flex flex-col`}>
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-3 shadow-md">
                <FaRobot className="text-white text-xl" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-gray-800">ChatBot HCM UTE RTIC</h2>
                <p className="text-xs text-gray-500">Trợ lý AI thông minh</p>
              </div>
            </div>
            <button
              onClick={createNewSession}
              className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 text-gray-700 py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center font-medium hover:shadow-sm"
            >
              <FaPlus className="mr-2" size={14} />
              Cuộc trò chuyện mới
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4" onScroll={handleHistoryScroll}>
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-4 px-2 font-medium">Lịch sử trò chuyện</div>
            {localChatSessions.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FaHistory className="text-gray-400 text-2xl" />
                </div>
                <p className="text-gray-500 text-sm">Chưa có cuộc trò chuyện nào</p>
                <p className="text-gray-400 text-xs mt-1">Bắt đầu chat để lưu lịch sử</p>
              </div>
            ) : (
              <div className="space-y-2">
                {localChatSessions.map((session) => (
                  <div
                    key={session.session_id}
                    className={`group relative flex items-center p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                      sessionId === session.session_id 
                        ? 'bg-blue-50 border border-blue-200 shadow-sm' 
                        : 'hover:bg-gray-50 border border-transparent hover:border-gray-200'
                    }`}
                    onClick={() => loadChatSession(session.session_id)}
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 shadow-sm">
                      <FaRobot className="text-white text-sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate font-medium text-gray-800">{session.preview || 'Cuộc trò chuyện mới'}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(session.timestamp).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmAndDeleteSession(session.session_id);
                      }}
                      className="opacity-0 group-hover:opacity-100 ml-2 p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 sm:p-6 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r rounded-full flex items-center justify-center shadow-sm">
                  <img 
                    src={logoFIT} 
                    alt="FIT Logo" 
                    className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                  />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-800">HCMUTE</p>
                  <p className="text-xs text-gray-500">Khoa CNTT</p>
                </div>
              </div>
              {localChatSessions.length > 0 && (
                <button
                  onClick={confirmAndClearAllHistory}
                  className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200"
                  title="Xóa tất cả cuộc trò chuyện"
                >
                  <FaTrash size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Mobile Close Button */}
          <button
            className="lg:hidden absolute top-6 right-6 w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all duration-200 shadow-sm"
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Mobile Header */}
          <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <FaHistory size={18} className="text-gray-600" />
            </button>
            <div className="text-center">
                              <h1 className="font-bold text-lg text-gray-800">ChatBot HCM UTE RTIC</h1>
              <p className="text-xs text-gray-500">Trợ lý AI thông minh</p>
            </div>
            <button
              onClick={createNewSession}
              className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <FaPlus size={18} className="text-gray-600" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            {messages.length === 0 ? (
              /* Welcome Screen - Simple Centered Design */
              <div className="flex flex-col items-center justify-center min-h-full px-4 py-12">
                {/* Beta Notification - Move to top */}
                <div className="w-full max-w-4xl mb-8 bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                      <FaInfoCircle className="text-amber-600 text-lg" />
                    </div>
                    <div>
                      <h3 className="font-bold text-amber-800 mb-2 text-base">Phiên bản Beta</h3>
                      <p className="text-amber-700 leading-relaxed text-sm">
                        Chào mừng bạn đến với ChatBot HCM UTE RTIC - Trợ lý AI tiên tiến của Khoa CNTT - HCMUTE. 
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
                <div className="flex-1 flex flex-col items-center justify-center max-w-4xl w-full">
                  {/* Greeting */}
                  <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-blue-500 mb-4">
                      {getDynamicGreeting().text} {getDynamicGreeting().emoji}
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-700 font-medium">
                      Mình có thể giúp gì cho bạn?
                    </p>
                  </div>

                  {/* Input Box - Centered */}
                  <div className="w-full max-w-4xl mb-12">
                    <div className="relative flex items-center bg-white border-2 border-blue-300 rounded-2xl shadow-md hover:shadow-lg hover:border-blue-400 transition-all duration-200">
                      <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Nhập câu hỏi của bạn cho ChatBot HCM UTE RTIC..."
                        className="flex-1 px-6 py-4 bg-transparent border-0 focus:outline-none text-gray-800 placeholder-gray-500 text-lg"
                        disabled={isLoading}
                        maxLength={MAX_INPUT_LENGTH}
                      />
                      <div className="flex items-center mr-4 text-gray-400 text-sm">
                        <span className={`${query.length >= MAX_INPUT_LENGTH ? 'text-red-500' : ''}`}>
                          {query.length}/{MAX_INPUT_LENGTH}
                        </span>
                        <div className="mx-3 w-px h-6 bg-gray-300"></div>
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.379-8.379-2.828-2.828z" />
                          </svg>
                        </button>
                      </div>
                      <button
                        className={`mr-3 p-3 rounded-xl transition-all duration-200 ${
                          isLoading || !query.trim()
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                        }`}
                        onClick={sendMessage}
                        disabled={isLoading || !query.trim()}
                      >
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <FaPaperPlane size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Suggested Questions */}
                  <div className="w-full max-w-4xl">
                    <div className="flex items-center mb-6">
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-orange-500 text-sm">✨</span>
                      </div>
                      <h3 className="text-gray-600 font-medium">Các câu hỏi phổ biến</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        onClick={() => handleSuggestionClick("Tôi muốn biết về học bổng của trường")}
                        className="flex items-center p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left group"
                      >
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                          <span className="text-yellow-600 text-lg">💡</span>
                        </div>
                        <span className="text-gray-700 group-hover:text-blue-600 transition-colors">
                          Tôi muốn biết về học bổng của trường
                        </span>
                      </button>

                      <button
                        onClick={() => handleSuggestionClick("Có nên học ở HCMUTE không?")}
                        className="flex items-center p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left group"
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                          <span className="text-blue-600 text-lg">🎓</span>
                        </div>
                        <span className="text-gray-700 group-hover:text-blue-600 transition-colors">
                          Có nên học ở HCMUTE không?
                        </span>
                      </button>

                      <button
                        onClick={() => handleSuggestionClick("Điểm chuẩn các ngành năm trước là bao nhiêu?")}
                        className="flex items-center p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left group"
                      >
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                          <span className="text-red-600 text-lg">⚠️</span>
                        </div>
                        <span className="text-gray-700 group-hover:text-blue-600 transition-colors">
                          Điểm chuẩn các ngành năm trước là bao nhiêu?
                        </span>
                      </button>

                      <button
                        onClick={() => handleSuggestionClick("Ngành Công nghệ thông tin học những gì?")}
                        className="flex items-center p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left group"
                      >
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                          <span className="text-green-600 text-lg">💻</span>
                        </div>
                        <span className="text-gray-700 group-hover:text-blue-600 transition-colors">
                          Ngành Công nghệ thông tin học những gì?
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Chat Messages */
              <div ref={messagesContainerRef} className="max-w-4xl mx-auto px-6 py-8">
                {messages.map((msg, index) => (
                  <MessageBubble key={index} message={msg} />
                ))}
                {(isTyping || isLoading) && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Clean Input Area - Only show when there are messages */}
          {messages.length > 0 && (
            <div className="border-t border-gray-200 bg-white p-6 shadow-sm">
              <div className="max-w-4xl mx-auto">
                <div className="relative flex items-center bg-white border border-gray-300 rounded-2xl shadow-sm hover:shadow-md hover:border-gray-400 transition-all duration-200">
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Nhập câu hỏi của bạn cho ChatBot HCM UTE RTIC..."
                    className="flex-1 px-6 py-4 bg-transparent border-0 focus:outline-none text-gray-800 placeholder-gray-500 text-lg"
                    disabled={isLoading}
                    maxLength={MAX_INPUT_LENGTH}
                  />
                  <button
                    className={`m-2 p-4 rounded-xl transition-all duration-200 ${
                      isLoading || !query.trim()
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                    }`}
                    onClick={sendMessage}
                    disabled={isLoading || !query.trim()}
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FaPaperPlane size={18} />
                    )}
                  </button>
                </div>
                
                {/* Professional Disclaimer */}
                <p className="text-sm text-gray-500 text-center mt-4">
                  ChatBot HCM UTE RTIC có thể tạo ra thông tin không chính xác. Vui lòng kiểm tra thông tin quan trọng.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 