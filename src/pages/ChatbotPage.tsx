import { useState, useEffect, useRef } from 'react';
import { FaRobot, FaPaperPlane, FaHistory, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { API_ENDPOINTS, DEFAULT_HEADERS } from '../config';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

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
  const [, setScrollPosition] = useState(0);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

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
    if (shouldAutoScroll && messagesEndRef.current && !isLoadingHistory) {
      // Sử dụng timeout để đảm bảo DOM đã cập nhật
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [messages, shouldAutoScroll, isLoadingHistory]);

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

  // Cập nhật lại useEffect theo dõi tin nhắn để sử dụng hàm smoothScrollToBottom
  useEffect(() => {
    if (shouldAutoScroll && !isLoadingHistory && messages.length > 0) {
      // Delay một chút để đảm bảo DOM đã cập nhật
      setTimeout(smoothScrollToBottom, 50);
    }
  }, [messages, shouldAutoScroll, isLoadingHistory]);

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
    // Hiển thị từng ký tự một cách mượt mà
    const characters = cleanText.split('');
    let processedContent = currentContent;
    
    // Tạo hiệu ứng typing theo nhóm ký tự để tăng tốc độ hiển thị
    // Số ký tự hiển thị cùng lúc sẽ tùy thuộc vào độ dài văn bản
    const chunkSize = characters.length > 300 ? 15 : 
                      characters.length > 150 ? 10 :
                      characters.length > 50 ? 5 : 1;
    
    for (let i = 0; i < characters.length; i += chunkSize) {
      // Thêm một nhóm ký tự cùng lúc
      const chunk = characters.slice(i, i + chunkSize).join('');
      processedContent += chunk;
      
      // Cập nhật nội dung hiện tại trong state
      setMessages(prev => 
        prev.map((msg, idx) => 
          idx === prev.length - 1 && msg.isStreaming 
            ? { ...msg, content: processedContent } 
            : msg
        )
      );
      
      // Đảm bảo cuộn xuống mỗi khi có nội dung mới
      if (i % 15 === 0) { // Giảm tần suất cuộn để tăng hiệu năng
        smoothScrollToBottom();
      }
      
      // Tạo độ trễ giữa các nhóm ký tự để tạo hiệu ứng typing
      // Tốc độ typing nhanh hơn nhiều cho văn bản dài
      if (characters.length > 500) { // Đoạn text cực dài
        await new Promise(resolve => setTimeout(resolve, 2));
      } else if (characters.length > 200) { // Đoạn text rất dài
        await new Promise(resolve => setTimeout(resolve, 5));
      } else if (characters.length > 50) { // Đoạn text dài vừa
        await new Promise(resolve => setTimeout(resolve, 8));
      } else {
        await new Promise(resolve => setTimeout(resolve, 12)); // Đoạn text ngắn, vẫn typing nhanh
      }
    }
    
    // Đảm bảo cuộn xuống sau khi hoàn thành đoạn văn bản
    setTimeout(smoothScrollToBottom, 10);
    
    return processedContent;
  };

  // Component hiển thị 3 chấm đang suy nghĩ
  const TypingIndicator = () => {
    return (
      <div className="flex mb-4 w-full">
        <div className="relative max-w-[80%] p-3 rounded-lg bg-gray-100 border-2 border-gray-200">
          <div className="absolute -top-2 -left-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
            <FaRobot className="text-orange-600" size={14} />
          </div>
          
          <div className="text-xs font-semibold mb-1">
            Chat Bot
            <span className="text-xs font-normal text-gray-500 ml-2">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
          
          <div className="text-gray-800 flex items-center">
            <span className="mr-2">Đang suy nghĩ</span>
            <div className="typing-indicator">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Gửi tin nhắn đến chatbot
  const sendMessage = async () => {
    if (!query.trim()) return;

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

    // Thêm tin nhắn của người dùng vào danh sách
    const userMessage: Message = { role: 'human', content: query, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMessage]);
    
    // Bắt đầu hiển thị trạng thái đang suy nghĩ
    setIsLoading(true);
    setIsTyping(true);
    const currentQuery = query;
    setQuery('');

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
        credentials: 'include',  // Gửi cookies nếu có
      });

      // Kiểm tra response
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
      }

      // Xử lý dữ liệu stream
      const reader = response.body?.getReader();
      if (!reader) return;

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
                continue;
              }
              
              // Khi nhận được dữ liệu đầu tiên, tắt trạng thái đang suy nghĩ và bắt đầu streaming
              if (!receivedFirstChunk) {
                receivedFirstChunk = true;
                // Tắt chỉ báo "đang suy nghĩ"
                setIsTyping(false);
                // Thêm message ban đầu cho streaming
                setMessages(prev => [...prev, { role: 'ai', content: '', isStreaming: true, timestamp: new Date().toISOString() }]);
                
                // Đảm bảo cuộn xuống khi tin nhắn mới xuất hiện
                setShouldAutoScroll(true);
              }
              
              // Xử lý format trả về từ API và lưu nội dung hiện tại
              if (jsonData.content && jsonData.format_type === 'markdown') {
                // Sử dụng nội dung hiện tại để tiếp tục streaming
                botResponse = await processStreamingText(jsonData.content, botResponse);
              } else if (typeof data === 'string') {
                // Vẫn xử lý trường hợp data là string thông thường
                botResponse = await processStreamingText(data, botResponse);
              }
            } catch (e) {
              // Nếu không phải JSON, xem như là text thường
              if (!receivedFirstChunk) {
                receivedFirstChunk = true;
                // Tắt chỉ báo "đang suy nghĩ"
                setIsTyping(false);
                // Thêm message ban đầu cho streaming
                setMessages(prev => [...prev, { role: 'ai', content: '', isStreaming: true, timestamp: new Date().toISOString() }]);
                
                // Đảm bảo cuộn xuống khi tin nhắn mới xuất hiện
                setShouldAutoScroll(true);
              }
              botResponse = await processStreamingText(data, botResponse);
            }
          }
        }
      }

      // Hoàn thành streaming và cập nhật tin nhắn cuối cùng
      setMessages(prev => 
        prev.map((msg, idx) => 
          idx === prev.length - 1 && msg.isStreaming 
            ? { role: 'ai', content: botResponse, isStreaming: false, timestamp: msg.timestamp || new Date().toISOString() } 
            : msg
        )
      );

      // Tắt loading trước
      setIsLoading(false);
      setIsTyping(false);
      
      // Đảm bảo cuộn xuống sau khi hoàn thành
      setShouldAutoScroll(true);
      
      // Ngay lập tức gọi hàm cuộn mượt
      setTimeout(smoothScrollToBottom, 50);
      
      // Trì hoãn cập nhật danh sách phiên trò chuyện để tránh ảnh hưởng đến hiệu năng
      setTimeout(() => {
        updateLocalChatSessions();
        fetchChatSessions();
      }, 500);
      
    } catch (error) {
      console.error('Error sending message:', error);
      // Xóa tin nhắn đang streaming nếu có
      setMessages(prev => prev.filter(msg => !msg.isStreaming));
      // Tắt trạng thái đang suy nghĩ
      setIsTyping(false);
      // Thêm tin nhắn lỗi
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: 'Đã xảy ra lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.', 
        timestamp: new Date().toISOString() 
      }]);
      
      // Vẫn lưu vào localStorage
      if (currentSessionId) {
        saveLocalChatHistory(currentSessionId, messages);
      }
      
      // Tắt loading và đảm bảo cuộn xuống
      setIsLoading(false);
      setIsTyping(false);
      setTimeout(smoothScrollToBottom, 50);
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
      <div
        className={`flex ${message.role === 'human' ? 'justify-end' : 'justify-start'} mb-4 w-full`}
      >
        <div
          className={`relative ${
            message.role === 'human'
              ? 'bg-orange-500 text-white rounded-tl-xl rounded-tr-xl rounded-bl-xl'
              : 'bg-gray-100 border-2 border-gray-200 rounded-tl-xl rounded-tr-xl rounded-br-xl'
          } p-3 max-w-[80%] whitespace-pre-wrap break-words`}
        >
          {/* Avatar và tên người dùng/bot */}
          <div className={`absolute ${message.role === 'human' ? '-top-2 -right-2' : '-top-2 -left-2'} w-6 h-6 ${
            message.role === 'human' ? 'bg-orange-600' : 'bg-white'
          } rounded-full flex items-center justify-center shadow-sm`}>
            {message.role === 'human' ? (
              <span className="text-white text-xs font-bold">U</span>
            ) : (
              <FaRobot className="text-orange-600" size={14} />
            )}
          </div>
          
          {/* Tên người dùng/bot và thời gian */}
          <div className="text-xs font-semibold mb-1">
            {message.role === 'human' ? 'Bạn' : 'Chat Bot'}
            <span className={`text-xs font-normal ${message.role === 'human' ? 'text-orange-100' : 'text-gray-500'} ml-2`}>
              {message.timestamp
                ? new Date(message.timestamp).toLocaleTimeString()
                : new Date().toLocaleTimeString()
              }
            </span>
          </div>
          
          {/* Nội dung tin nhắn */}
          <div className={message.role === 'human' ? 'text-white' : 'text-gray-800'}>
            {message.content ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
                components={{
                  a: ({node, ...props}) => (
                    <a 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={`${message.role === 'human' ? 'text-orange-200 hover:text-orange-100' : 'text-orange-600 hover:text-orange-700'} underline`}
                      style={message.role === 'human' ? {} : {color: '#F47B4F'}}
                      {...props}
                    />
                  ),
                  pre: ({node, ...props}) => (
                    <pre className="bg-gray-800 text-white p-2 rounded my-2 overflow-auto" {...props} />
                  ),
                  code: ({node, ...props}) => (
                    <code className="bg-gray-800 text-white px-1 py-0.5 rounded" {...props} />
                  ),
                  strong: ({node, ...props}) => (
                    <strong 
                      className={message.role === 'human' ? 'text-white font-bold' : 'font-bold'} 
                      style={message.role === 'human' ? {} : {color: '#F47B4F'}}
                      {...props} 
                    />
                  ),
                  ul: ({node, ...props}) => (
                    <ul className="list-disc pl-5 my-2 space-y-1" {...props} />
                  ),
                  ol: ({node, ...props}) => (
                    <ol className="list-decimal pl-5 my-2 space-y-1" {...props} />
                  ),
                  li: ({node, ...props}) => (
                    <li className="mb-1" {...props} />
                  ),
                  p: ({node, ...props}) => (
                    <p className="mb-2 leading-relaxed" {...props} />
                  ),
                  table: ({node, ...props}) => (
                    <div className="overflow-x-auto my-2">
                      <table className="border-collapse border border-gray-300 w-full" {...props} />
                    </div>
                  ),
                  th: ({node, ...props}) => (
                    <th className="border border-gray-300 p-2 bg-gray-100" {...props} />
                  ),
                  td: ({node, ...props}) => (
                    <td className="border border-gray-300 p-2" {...props} />
                  ),
                }}
              >
                {processLinks(message.content)}
              </ReactMarkdown>
            ) : (
              <p>Không có nội dung</p>
            )}
          </div>
        </div>
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

  return (
    <div className="container mx-auto px-2 md:px-4 pt-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Thông báo sản phẩm đang thử nghiệm */}
        <div className="md:col-span-3 mb-4">
          <div className="border-l-4 p-4 bg-yellow-50 rounded-r" style={{ borderColor: 'var(--orange-primary)' }}>
            <div className="flex">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" style={{ color: 'var(--orange-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium mb-1" style={{ color: 'var(--navy-blue)' }}>Sản phẩm đang trong giai đoạn thử nghiệm</p>
                <p className="text-sm text-gray-600">
                  Đây là phiên bản beta của Chatbot AI FIT - HCMUTE. Sản phẩm vẫn đang trong quá trình phát triển, 
                  nên có thể còn một số sai sót. Chúng tôi rất mong nhận được góp ý của bạn thông qua{' '}
                  <a 
                    href="https://forms.gle/G1shmbDAdLjksBef7" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="underline font-medium"
                    style={{ color: 'var(--orange-primary)' }}
                  >
                    biểu mẫu này
                  </a>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Nút hiển thị sidebar trên mobile */}
        <div className="md:hidden mb-2 px-2">
          <button 
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="w-full py-2 px-4 bg-white border border-gray-300 rounded-lg shadow-sm flex items-center justify-center"
            style={{ borderColor: 'var(--orange-primary)' }}
          >
            <FaHistory className="mr-2" style={{ color: 'var(--orange-primary)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--navy-blue)' }}>
              {isMobileSidebarOpen ? 'Đóng lịch sử' : 'Xem lịch sử trò chuyện'}
            </span>
          </button>
        </div>

        {/* Sidebar mobile - hiển thị khi bấm nút */}
        {isMobileSidebarOpen && (
          <div className="md:hidden w-full overflow-auto max-h-[60vh] border border-gray-200 rounded-lg shadow-sm mb-4">
            <div className="chat-header p-3 rounded-t-lg flex justify-between items-center">
              <h3 className="text-base font-medium text-white">Lịch sử trò chuyện</h3>
              <div className="flex items-center">
                {localChatSessions.length > 0 && (
                  <button 
                    onClick={confirmAndClearAllHistory}
                    className="text-white text-xs mr-3 bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
                  >
                    Xóa tất cả
                  </button>
                )}
                <button 
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="text-white text-sm"
                >
                  Đóng
                </button>
              </div>
            </div>
            <div className="p-3 bg-white">
              {isLoadingHistory && localChatSessions.length === 0 ? (
                <div className="flex items-center justify-center py-6">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2" style={{ borderColor: 'var(--orange-primary)' }}></div>
                </div>
              ) : localChatSessions.length === 0 ? (
                <p className="text-gray-500 text-center py-4 text-sm">
                  Chưa có cuộc trò chuyện nào
                </p>
              ) : (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm mb-2" style={{ color: 'var(--navy-blue)' }}>Lịch sử trò chuyện của bạn</h4>
                  {localChatSessions.map((session) => (
                    <div 
                      key={session.session_id} 
                      className={`border rounded-md p-2 cursor-pointer hover:shadow-sm transition-shadow text-sm ${
                        sessionId === session.session_id ? 'active' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <h4 
                          className="font-medium text-xs truncate flex-grow"
                          onClick={() => {
                            loadChatSession(session.session_id);
                            setIsMobileSidebarOpen(false);
                          }}
                        >{session.title}</h4>
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500 mr-2">
                            {new Date(session.timestamp).toLocaleDateString()}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmAndDeleteSession(session.session_id);
                            }}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                      </div>
                      <p 
                        className="text-xs text-gray-500 truncate"
                        onClick={() => {
                          loadChatSession(session.session_id);
                          setIsMobileSidebarOpen(false);
                        }}
                      >
                        {session.preview}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Phần chat chính */}
        <div className="md:col-span-3">
          <div className="border border-gray-200 rounded-lg shadow-sm flex flex-col h-[calc(100vh-200px)] md:h-[calc(100vh-150px)]">
            <div className="flex justify-between items-center p-3 md:p-4 chat-header rounded-t-lg">
              <h3 className="text-base md:text-lg font-medium">
                {sessionId ? `Phiên chat: ${sessionId.substring(0, 8)}...` : 'Bắt đầu cuộc trò chuyện'}
              </h3>
              <button 
                className="flex items-center text-xs md:text-sm px-2 py-1 md:px-3 md:py-1.5 bg-white text-gray-700 rounded hover:bg-gray-100"
                onClick={createNewSession}
              >
                <FaTrash className="mr-1" size={12} />
                <span className="hidden md:inline">Tạo cuộc trò chuyện mới</span>
                <span className="inline md:hidden">Mới</span>
              </button>
            </div>

            {/* Khu vực hiển thị tin nhắn */}
            <div className="flex-1 overflow-auto p-3 md:p-4" ref={messagesContainerRef}>
              {isLoadingHistory && messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 md:h-10 md:w-10 border-t-2 border-b-2 border-orange-500 mb-4" style={{ borderColor: 'var(--orange-primary)' }}></div>
                  <p className="text-gray-500 text-sm md:text-base">Đang tải lịch sử trò chuyện...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full opacity-70">
                  <div className="bg-navy-blue p-3 rounded-full mb-4 flex items-center justify-center" style={{ backgroundColor: 'var(--navy-blue)' }}>
                    <FaRobot className="text-white" size={24} />
                  </div>
                  <h2 className="text-center text-lg md:text-xl font-semibold mb-2" style={{ color: 'var(--navy-blue)' }}>HCMUTE DSC Chatbot</h2>
                  <p className="text-center text-gray-600 max-w-md text-sm md:text-base">
                    Chào mừng đến với trợ lý AI của Khoa CNTT - HCMUTE!<br />
                    Hãy đặt câu hỏi để bắt đầu cuộc trò chuyện.
                  </p>
                </div>
              ) : (
                <>
                  {messages.map((msg, index) => (
                    <MessageBubble key={index} message={msg} />
                  ))}
                  {isTyping && <TypingIndicator />}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Khung nhập tin nhắn */}
            <div className="border-t p-3 md:p-4">
              <div className="flex">
                <input
                  type="text"
                  className="flex-1 border border-gray-300 rounded-l-lg px-3 md:px-4 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:border-transparent"
                  style={{ '--tw-ring-color': 'var(--orange-primary)' } as React.CSSProperties}
                  placeholder="Nhập câu hỏi của bạn..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                />
                <button
                  className={`flex items-center justify-center px-3 md:px-4 py-2 rounded-r-lg send-button ${
                    isLoading || !query.trim()
                      ? 'bg-gray-300 cursor-not-allowed'
                      : ''
                  }`}
                  onClick={sendMessage}
                  disabled={isLoading || !query.trim()}
                >
                  {isLoading ? (
                    <svg className="animate-spin h-4 w-4 md:h-5 md:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <FaPaperPlane size={14} />
                  )}
                  <span className="ml-2 text-sm md:text-base">Gửi</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Danh sách phiên chat - desktop */}
        <div className="hidden md:block md:col-span-1">
          <div className="border border-gray-200 rounded-lg shadow-sm h-[calc(100vh-150px)]">
            <div className="flex items-center justify-between p-4 chat-header rounded-t-lg">
              <div className="flex items-center">
                <FaHistory className="text-white mr-2" size={16} />
                <h3 className="text-lg font-medium">Lịch sử trò chuyện</h3>
              </div>
              <div className="flex items-center">
                {localChatSessions.length > 0 && (
                  <button 
                    className="text-white hover:text-red-200 flex items-center mr-3"
                    onClick={confirmAndClearAllHistory}
                    title="Xóa tất cả lịch sử"
                  >
                    <FaTrash size={12} />
                  </button>
                )}
                <button 
                  className="text-xs text-white hover:text-gray-200 flex items-center"
                  onClick={updateLocalChatSessions}
                  disabled={isLoadingHistory}
                >
                  {isLoadingHistory ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white mr-1"></div>
                  ) : null}
                  <span>Làm mới</span>
                </button>
              </div>
            </div>
            
            <div className="overflow-auto h-[calc(100%-60px)] p-4">
              <div className="space-y-3">
                {isLoadingHistory && localChatSessions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 mb-2" style={{ borderColor: 'var(--orange-primary)' }}></div>
                    <p className="text-gray-500 text-sm">Đang tải...</p>
                  </div>
                ) : localChatSessions.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    Chưa có cuộc trò chuyện nào
                  </p>
                ) : (
                  <>
                    <h4 className="font-medium text-sm" style={{ color: 'var(--navy-blue)' }}>Lịch sử trò chuyện của bạn</h4>
                    {localChatSessions.map((session) => (
                      <div 
                        key={session.session_id} 
                        className={`border rounded-md p-3 cursor-pointer hover:shadow-sm transition-shadow session-item relative ${
                          sessionId === session.session_id ? 'active' : ''
                        }`}
                      >
                        <div className="absolute top-2 right-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmAndDeleteSession(session.session_id);
                            }}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                            title="Xóa cuộc trò chuyện này"
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                        <div 
                          className="pr-6"
                          onClick={() => loadChatSession(session.session_id)}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-medium text-sm truncate">{session.title}</h4>
                            <span className="text-xs text-gray-500">
                              {new Date(session.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-start">
                              <span className="text-xs session-badge rounded-full px-2 py-0.5 mr-2">
                                Cuộc hội thoại
                              </span>
                              <p className="text-xs text-gray-500 truncate flex-1">
                                {session.preview}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 