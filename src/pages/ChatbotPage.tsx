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
}

export function ChatbotPage() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [chatSessions, setChatSessions] = useState<Session[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [, setScrollPosition] = useState(0);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  // Hàm xử lý và làm sạch nội dung
  const cleanContent = (content: string): string => {
    let processedContent = content;
    
    // Thay thế ký tự xuống dòng
    processedContent = processedContent.replace(/\\n/g, '\n');
    
    // Xử lý URL bị lồng nhau
    processedContent = processedContent.replace(/\[(https?:\/\/[^\]]+)\]\((https?:\/\/[^)]+)\)/g, '[$1]($1)');
    
    // Xử lý URL bị lặp lại
    processedContent = processedContent.replace(/\(https?:\/\/\[https?:\/\/(.*?)\]\(https?:\/\/(.*?)\)\)/g, '(https://$2)');
    
    // Xử lý email
    processedContent = processedContent.replace(/\[([^@\]]+@[^@\]]+)\]\(mailto:([^)]+)\)/g, '[$1](mailto:$1)');
    
    // Loại bỏ các chuỗi lặp lại trong URL
    processedContent = processedContent.replace(/\(https?:\/\/https?:\/\//g, '(https://');
    
    // Sửa lỗi khi URL có nhiều [ hoặc ] lồng nhau
    processedContent = processedContent.replace(/\[\[(.+?)\]\]/g, '[$1]');
    
    // Sửa lỗi URL với nhiều dấu ngoặc
    processedContent = processedContent.replace(/\(https?:\/\/\((.+?)\)\)/g, '(https://$1)');
    
    // Sửa các dạng markdown bị lỗi
    processedContent = processedContent.replace(/\]\[/g, '] [');
    
    return processedContent;
  };

  // Lấy danh sách phiên chat khi tải trang
  useEffect(() => {
    fetchChatSessions();
  }, []);

  // Cuộn xuống tin nhắn mới nhất với điều kiện
  useEffect(() => {
    if (shouldAutoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, shouldAutoScroll]);

  // Theo dõi sự kiện cuộn
  useEffect(() => {
    const handleScroll = () => {
      if (messagesContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
        // Lưu vị trí cuộn hiện tại
        setScrollPosition(scrollTop);
        
        // Kiểm tra nếu người dùng đã cuộn lên trên
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
        
        // Chỉ tự động cuộn nếu người dùng đang ở cuối cuộc trò chuyện
        setShouldAutoScroll(isAtBottom);
      }
    };

    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  // Tạo phiên chat mới
  const createNewSession = async () => {
    try {
      const response = await axios.post(API_ENDPOINTS.NEW_SESSION, {}, {
        headers: DEFAULT_HEADERS,
        withCredentials: true
      });
      setSessionId(response.data.session_id);
      setMessages([]);
    } catch (error) {
      console.error('Error creating new session:', error);
    }
  };

  // Lấy danh sách phiên chat
  const fetchChatSessions = async () => {
    try {
      setIsLoadingHistory(true);
      const response = await axios.get(API_ENDPOINTS.CHAT_HISTORY, {
        headers: DEFAULT_HEADERS,
        withCredentials: true
      });
      if (response.data.sessions) {
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
      }
    } catch (error) {
      console.error('Error loading chat session:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Hàm xử lý streaming từng chữ
  const processStreamingText = async (text: string, currentContent: string) => {
    const cleanText = cleanContent(text);
    // Tận dụng nội dung hiện tại để tránh reset
    let processedContent = currentContent;
    
    for (let i = 0; i < cleanText.length; i++) {
      processedContent += cleanText[i];
      setMessages(prev => 
        prev.map((msg, idx) => 
          idx === prev.length - 1 && msg.isStreaming 
            ? { ...msg, content: processedContent } 
            : msg
        )
      );
      // Giảm thời gian delay để tăng tốc độ streaming
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    return processedContent;
  };

  // Component hiển thị 3 chấm đang suy nghĩ
  const TypingIndicator = () => {
    return (
      <div className="flex mb-4 w-full">
        <div className="relative max-w-[80%] p-3 rounded-lg bg-gray-100 border-2 border-gray-200">
          <div className="absolute -top-2 -left-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
            <FaRobot className="text-blue-600" size={14} />
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
          session_id: sessionId,
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
                setSessionId(jsonData.session_id);
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

      // Cập nhật danh sách phiên chat
      fetchChatSessions();
      
    } catch (error) {
      console.error('Error sending message:', error);
      // Xóa tin nhắn đang streaming nếu có
      setMessages(prev => prev.filter(msg => !msg.isStreaming));
      // Tắt trạng thái đang suy nghĩ
      setIsTyping(false);
      // Thêm tin nhắn lỗi
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: 'Đã xảy ra lỗi khi xử lý yêu cầu của bạn.', 
        timestamp: new Date().toISOString() 
      }]);
    } finally {
      setIsLoading(false);
      // Đảm bảo tắt trạng thái đang suy nghĩ khi kết thúc
      setIsTyping(false);
      // Đảm bảo cuộn xuống sau khi hoàn thành
      setShouldAutoScroll(true);
      
      // Thêm timeout để đảm bảo cuộn xuống sau khi DOM cập nhật
      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  // Bắt sự kiện nhấn Enter để gửi tin nhắn
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !isLoading) {
      sendMessage();
    }
  };

  // Component hiển thị tin nhắn
  const MessageBubble = ({ message }: { message: Message }) => {

    // Xử lý các liên kết đặc biệt trong nội dung hiển thị
    const processLinks = (content: string): string => {
      let processedContent = content;
      
      // Kiểm tra nếu đang ở định dạng JSON và trích xuất nội dung
      const jsonCheck = processedContent.match(/^\s*{"content"\s*:\s*"(.+?)"\s*,\s*"format_type"\s*:\s*"(.+?)"\s*}\s*$/);
      if (jsonCheck) {
        processedContent = jsonCheck[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
      }
      
      // Xử lý email với ngoặc bao quanh
      processedContent = processedContent.replace(
        /\(mailto:([\w.-]+@[\w.-]+\.\w+)\)/g,
        '[$1](mailto:$1)'
      );
      
      // Xử lý email links chưa định dạng
      processedContent = processedContent.replace(
        /(?<!["\(])([\w.-]+@[\w.-]+\.\w+)(?![")\]])/g, 
        '[mailto:$1](mailto:$1)'
      );
      
      // Sửa liên kết bị lỗi do lặp lại
      processedContent = processedContent.replace(
        /\[https:\/\/([^\]]+)\]\(https:\/\/https:\/\/([^)]+)\)/g,
        '[https://$1](https://$2)'
      );
      
      // Sửa liên kết lặp lại hoặc lồng nhau
      processedContent = processedContent.replace(
        /\[\[([^\]]+)\]\]\(([^)]+)\)/g,
        '[$1]($2)'
      );
      
      // Xử lý URLs thông thường
      processedContent = processedContent.replace(
        /(?<!["\(])(https?:\/\/[^\s"]+)(?![")\]])/g,
        '[$1]($1)'
      );
      
      return processedContent;
    };

    return (
      <div
        className={`flex ${message.role === 'human' ? 'justify-end' : 'justify-start'} mb-4 w-full`}
      >
        <div
          className={`relative max-w-[80%] p-3 rounded-lg ${
            message.role === 'human'
              ? 'user-message ml-auto'
              : 'bot-message'
          }`}
        >
          {message.role === 'ai' ? (
            <div className="absolute -top-2 -left-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
              <FaRobot style={{ color: 'var(--navy-blue)' }} size={14} />
            </div>
          ) : (
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-sm" style={{ backgroundColor: 'var(--orange-primary)' }}>
              <span className="text-white text-xs font-bold">U</span>
            </div>
          )}
          
          <div className="text-xs font-semibold mb-1">
            {message.role === 'human' ? 'Bạn' : 'Chat Bot'}
            {message.timestamp && (
              <span className="text-xs font-normal text-gray-500 ml-2">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            )}
          </div>
          
          <div className="text-gray-800 markdown-content">
            {message.role === 'human' ? (
              <p>{message.content}</p>
            ) : (
              message.isStreaming ? (
                <div className="streaming-content">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw, rehypeSanitize]}
                    components={{
                      a: (props) => (
                        <a {...props} className="text-blue-600 underline hover:text-blue-800" target="_blank" rel="noopener noreferrer" />
                      ),
                      pre: (props) => (
                        <pre {...props} className="bg-gray-800 text-white p-3 rounded my-2 overflow-auto" />
                      ),
                      code: ({ className, children, ...props }: any) => {
                        return !className ? (
                          <code {...props} className="bg-gray-200 px-1 py-0.5 rounded">{children}</code>
                        ) : (
                          <code {...props} className={className}>{children}</code>
                        );
                      },
                      p: ({ children, ...props }) => (
                        <p {...props} className="streaming-text">{children}</p>
                      )
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw, rehypeSanitize]}
                  components={{
                    a: (props) => {
                      // Xử lý đặc biệt cho email links
                      const isEmail = props.href?.startsWith('mailto:');
                      return (
                        <a 
                          {...props} 
                          className={`${isEmail ? 'text-green-600' : 'text-blue-600'} underline hover:opacity-80`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        />
                      );
                    },
                    pre: (props) => (
                      <pre {...props} className="bg-gray-800 text-white p-3 rounded my-2 overflow-auto" />
                    ),
                    code: ({ className, children, ...props }: any) => {
                      return !className ? (
                        <code {...props} className="bg-gray-200 px-1 py-0.5 rounded">{children}</code>
                      ) : (
                        <code {...props} className={className}>{children}</code>
                      );
                    },
                    // Xử lý ký tự \n trong văn bản thường
                    p: ({ children, ...props }) => {
                      return <p {...props}>{children}</p>;
                    }
                  }}
                >
                  {processLinks(message.content)}
                </ReactMarkdown>
              )
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 pt-4">
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
                  Đây là phiên bản beta của Chatbot AI HCMUTE. Sản phẩm vẫn đang trong quá trình phát triển, 
                  nên có thể còn một số sai sót. Chúng tôi rất mong nhận được góp ý của bạn thông qua{' '}
                  <a 
                    href="https://forms.gle/VbZnqQKdpFuQDUNh9" 
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

        {/* Phần chat chính */}
        <div className="md:col-span-3">
          <div className="border border-gray-200 rounded-lg shadow-sm flex flex-col h-[calc(100vh-150px)]">
            <div className="flex justify-between items-center p-4 chat-header rounded-t-lg">
              <h3 className="text-lg font-medium">
                {sessionId ? `Phiên chat: ${sessionId.substring(0, 8)}...` : 'Bắt đầu cuộc trò chuyện'}
              </h3>
              <button 
                className="flex items-center text-sm px-3 py-1.5 bg-white text-gray-700 rounded hover:bg-gray-100"
                onClick={createNewSession}
              >
                <FaTrash className="mr-1" size={12} />
                Tạo cuộc trò chuyện mới
              </button>
            </div>

            {/* Khu vực hiển thị tin nhắn */}
            <div className="flex-1 overflow-auto p-4" ref={messagesContainerRef}>
              {isLoadingHistory ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500 mb-4" style={{ borderColor: 'var(--orange-primary)' }}></div>
                  <p className="text-gray-500">Đang tải lịch sử trò chuyện...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full opacity-70">
                  <div className="bg-navy-blue p-3 rounded-full mb-4 flex items-center justify-center" style={{ backgroundColor: 'var(--navy-blue)' }}>
                    <FaRobot className="text-white" size={30} />
                  </div>
                  <h2 className="text-center text-xl font-semibold mb-2" style={{ color: 'var(--navy-blue)' }}>HCMUTE DSC Chatbot</h2>
                  <p className="text-center text-gray-600 max-w-md">
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
            <div className="border-t p-4">
              <div className="flex">
                <input
                  type="text"
                  className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:border-transparent"
                  style={{ '--tw-ring-color': 'var(--orange-primary)' } as React.CSSProperties}
                  placeholder="Nhập câu hỏi của bạn..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                />
                <button
                  className={`flex items-center justify-center px-4 py-2 rounded-r-lg send-button ${
                    isLoading || !query.trim()
                      ? 'bg-gray-300 cursor-not-allowed'
                      : ''
                  }`}
                  onClick={sendMessage}
                  disabled={isLoading || !query.trim()}
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <FaPaperPlane size={16} />
                  )}
                  <span className="ml-2">Gửi</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Danh sách phiên chat */}
        <div className="md:col-span-1">
          <div className="border border-gray-200 rounded-lg shadow-sm h-[calc(100vh-150px)]">
            <div className="flex items-center justify-between p-4 chat-header rounded-t-lg">
              <div className="flex items-center">
                <FaHistory className="text-white mr-2" size={16} />
                <h3 className="text-lg font-medium">Lịch sử trò chuyện</h3>
              </div>
              <button 
                className="text-xs text-white hover:text-gray-200 flex items-center"
                onClick={fetchChatSessions}
                disabled={isLoadingHistory}
              >
                {isLoadingHistory ? (
                  <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white mr-1"></div>
                ) : null}
                <span>Làm mới</span>
              </button>
            </div>
            
            <div className="overflow-auto h-[calc(100%-60px)] p-4">
              <div className="space-y-3">
                {isLoadingHistory && chatSessions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 mb-2" style={{ borderColor: 'var(--orange-primary)' }}></div>
                    <p className="text-gray-500 text-sm">Đang tải...</p>
                  </div>
                ) : chatSessions.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    Chưa có cuộc trò chuyện nào
                  </p>
                ) : (
                  chatSessions.map((session) => (
                    <div 
                      key={session.session_id} 
                      className={`border rounded-md p-3 cursor-pointer hover:shadow-sm transition-shadow session-item ${
                        sessionId === session.session_id ? 'active' : ''
                      }`}
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
                        <div className="text-xs text-gray-400 italic">
                          Nhấp để xem cuộc trò chuyện đầy đủ
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 