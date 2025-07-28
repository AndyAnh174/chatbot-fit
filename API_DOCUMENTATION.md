# RTIC Chatbot API Documentation

## 🎯 **Overview**

**RTIC Chatbot** là hệ thống AI chatbot cho **HCM UTE Research on Technology and Innovation Club**, hỗ trợ upload documents và chat thông minh với RAG (Retrieval-Augmented Generation).

### **Key Features**

- 🤖 **AI Chat**: Chat thông minh với RTIC bot
- 📄 **Document Upload**: Upload CSV, PDF, Word, Markdown, Text files
- 🔍 **Semantic Search**: Tìm kiếm thông minh trong knowledge base
- 🌐 **Public Access**: Không cần authentication
- 📱 **Real-time**: Server-Sent Events cho chat streaming

---

## 🏗️ **Architecture**

```
Frontend ← → FastAPI Backend ← → Qdrant Vector DB
                ↓
            PostgreSQL (Documents)
                ↓
            BGE-M3 Embeddings
```

### **Tech Stack**

- **Backend**: FastAPI, Python 3.10+
- **Vector DB**: Qdrant
- **Database**: PostgreSQL
- **AI**: Google Gemini, BGE-M3 Embeddings
- **Auth**: None (Public Access)

---

## 🌐 **Base URLs & Environment**

### **Development**

```
Local: http://localhost:8000
Docker: http://localhost:8002
```

### **Production**

```
API: https://api.hcmutertic.com
Chatbot: https://chatbot.hcmutertic.com
```

### **CORS Allowed Origins**

```
http://localhost:3000
http://localhost:5173
http://localhost:5176
https://hcmutertic.com
https://www.hcmutertic.com
https://chatbot.hcmutertic.com
https://chatbotapi.hcmutertic.com
https://api.hcmutertic.com
```

---

## 📚 **API Endpoints**

### **1. Root & Health Check**

#### `GET /`

Thông tin API cơ bản

**Response:**

```json
{
  "message": "🤖 RTIC Chatbot API",
  "description": "HCM UTE Research on Technology and Innovation Club",
  "facebook": "https://www.facebook.com/hcmute.rtic",
  "docs": "/docs",
  "endpoints": {
    "chat": "POST /chat",
    "upload": "POST /upload",
    "documents": "GET /documents",
    "reindex": "POST /reindex"
  }
}
```

#### `GET /health`

Health check endpoint

**Response:**

```json
{
  "status": "healthy",
  "service": "RTIC Chatbot",
  "version": "1.0.0",
  "facebook": "https://www.facebook.com/hcmute.rtic"
}
```

---

### **2. Authentication Endpoints**

#### `POST /admin/login`
Admin login để quản lý documents

**Request Body:**
```json
{
  "username": "admin",
  "password": "your_password"
}
```

**Response (Success):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@hcmutertic.com",
    "role": "admin"
  },
  "expires_in": "24 hours"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Username hoặc password không đúng"
}
```

#### `POST /admin/change-password`
Đổi password cho admin *(Auth Required)*

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "old_password": "old_password",
  "new_password": "new_password"
}
```

#### `GET /admin/profile`
Lấy thông tin profile admin *(Auth Required)*

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@hcmutertic.com",
  "role": "admin",
  "created_at": "2024-01-15T10:30:00Z",
  "last_login": "2024-01-15T15:45:00Z",
  "is_active": true
}
```

---

### **3. Chat Endpoints**

#### `POST /chat`

Chat với RTIC bot - **Server-Sent Events (SSE)**

**Request Body:**

```json
{
  "query": "RTIC có những hoạt động gì?",
  "session_id": "optional-session-uuid"
}
```

**Response Type:** `text/event-stream`

**SSE Event Flow:**

```javascript
// Event 1: Session ID
data: {"type": "session_id", "session_id": "uuid-here"}

// Event 2-N: Streaming response chunks
data: {"content": "RTIC là", "format_type": "markdown"}
data: {"content": " câu lạc bộ", "format_type": "markdown"}
data: {"content": " nghiên cứu...", "format_type": "markdown"}

// Error event (if any)
data: {"type": "error", "message": "Error description"}
```

**Headers:**

```
Content-Type: text/event-stream; charset=utf-8
Cache-Control: no-cache
Connection: keep-alive
X-Session-ID: session-uuid
```

**Frontend Example:**

```javascript
const eventSource = new EventSource('/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: "RTIC có những hoạt động gì?",
    session_id: sessionId
  })
});

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  if (data.type === 'session_id') {
    sessionId = data.session_id;
  } else if (data.content) {
    appendToChat(data.content);
  } else if (data.type === 'error') {
    showError(data.message);
  }
};
```

#### `POST /new_session`

Tạo session chat mới

**Response:**

```json
{
  "session_id": "uuid-generated-session-id"
}
```

#### `GET /chat/{session_id}`
Lấy lịch sử chat của một session cụ thể

**Optional Headers:**
```
Authorization: Bearer <jwt_token>  # Để xem sessions của user
```

**Response:**
```json
{
  "session_id": "uuid-session-id",
  "messages": [
    {
      "role": "user",
      "content": "RTIC có những hoạt động gì?",
      "created_at": "2024-01-15T10:30:00Z"
    },
    {
      "role": "assistant", 
      "content": "RTIC có nhiều hoạt động nghiên cứu...",
      "created_at": "2024-01-15T10:30:05Z"
    }
  ],
  "total_messages": 2
}
```

#### `GET /chat-history`
Lấy danh sách tất cả chat sessions

**Query Parameters:**
- `limit`: Number of sessions to return (default: 50)

**Optional Headers:**
```
Authorization: Bearer <jwt_token>  # Để xem sessions của user
```

**Response:**
```json
{
  "sessions": [
    {
      "session_id": "uuid-1",
      "created_at": "2024-01-15T10:30:00Z",
      "last_activity": "2024-01-15T10:35:00Z",
      "message_count": 6,
      "preview": "RTIC có những hoạt động gì?",
      "title": "Chat 15/01/2024 10:30"
    }
  ],
  "total_count": 1
}
```

#### `DELETE /chat/{session_id}`
Xóa một chat session

**Optional Headers:**
```
Authorization: Bearer <jwt_token>  # Chỉ xóa được sessions của mình
```

**Response:**
```json
{
  "success": true,
  "message": "Đã xóa session thành công"
}
```

---

### **4. Document Management**

#### `POST /upload`

Upload documents (CSV, PDF, Word, Markdown, Text)

**Request Type:** `multipart/form-data`

**Form Fields:**

- `file`: File to upload (required)
- `category`: Document category (optional, default: "RTIC General")

**Supported File Types:**

- `.csv` - CSV files
- `.pdf` - PDF documents
- `.docx` - Microsoft Word documents
- `.md` - Markdown files
- `.txt` - Text files

**Response (Success):**

```json
{
  "success": true,
  "message": "Đã upload và xử lý thành công 15 chunks từ research_paper.pdf",
  "doc_info": {
    "doc_id": "abc123def456",
    "file_name": "research_paper.pdf",
    "file_path": "/uploads/research_paper.pdf",
    "category": "RTIC Research",
    "chunks_count": 15,
    "file_size": 2048576,
    "processed_at": "2024-01-15T10:30:00Z"
  }
}
```

**Response (Error):**

```json
{
  "success": false,
  "error": "Định dạng file không được hỗ trợ: .xlsx. Hỗ trợ: .csv, .pdf, .docx, .md, .txt"
}
```

**Frontend Example:**

```javascript
const formData = new FormData();
formData.append('file', selectedFile);
formData.append('category', 'RTIC Research');

const response = await fetch('/upload', {
  method: 'POST',
  body: formData
});

const result = await response.json();
```

#### `GET /documents`

Lấy danh sách tất cả documents đã upload

**Response:**

```json
{
  "documents": [
    {
      "doc_id": "abc123def456",
      "title": "research_paper.pdf",
      "category": "RTIC Research", 
      "chunks_count": 15
    },
    {
      "doc_id": "def456ghi789",
      "title": "workshop_schedule.md",
      "category": "RTIC Events",
      "chunks_count": 8
    }
  ],
  "total_count": 2
}
```

#### `DELETE /documents/{doc_id}`

Xóa một document cụ thể

**Parameters:**

- `doc_id`: ID của document cần xóa

**Response (Success):**

```json
{
  "success": true,
  "message": "Đã xóa document abc123def456 thành công"
}
```

**Response (Error):**

```json
{
  "detail": "Document không tồn tại"
}
```

#### `POST /reindex`

Rebuild vector database với tất cả documents

**Response:**

```json
{
  "success": true,
  "message": "Đã reindex thành công tất cả documents vào vector database"
}
```

---

## 🗄️ **Database Schema**

### **Documents Table**

```sql
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    doc_id TEXT UNIQUE NOT NULL,
    original_filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    file_type TEXT NOT NULL, -- csv, pdf, docx, md, txt
    category TEXT NOT NULL DEFAULT 'RTIC General',
    chunks_count INTEGER DEFAULT 0,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_indexed TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB
);
```

### **Document Chunks Table**

```sql
CREATE TABLE document_chunks (
    id SERIAL PRIMARY KEY,
    doc_id TEXT NOT NULL,
    chunk_index INTEGER NOT NULL,
    title TEXT,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doc_id) REFERENCES documents(doc_id) ON DELETE CASCADE
);
```

### **Chat Sessions Table**

```sql
CREATE TABLE chat_sessions (
    id SERIAL PRIMARY KEY,
    session_id TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    message_count INTEGER DEFAULT 0
);
```

### **Document Access Logs Table**

```sql
CREATE TABLE document_access_logs (
    id SERIAL PRIMARY KEY,
    doc_id TEXT NOT NULL,
    session_id TEXT,
    access_type TEXT CHECK (access_type IN ('view', 'search', 'chat_reference')) DEFAULT 'search',
    accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doc_id) REFERENCES documents(doc_id) ON DELETE CASCADE
);
```

---

## 🔧 **Error Handling**

### **HTTP Status Codes**

- `200` - Success
- `400` - Bad Request (Invalid input)
- `404` - Not Found (Document không tồn tại)
- `422` - Validation Error
- `500` - Internal Server Error

### **Error Response Format**

```json
{
  "detail": "Error message description"
}
```

### **Common Errors**

#### Upload Errors

```json
{
  "success": false,
  "error": "Định dạng file không được hỗ trợ: .xlsx"
}
```

#### Chat Errors

```json
{
  "type": "error",
  "message": "Internal server error occurred"
}
```

---

## 💻 **Frontend Integration Examples**

### **React Chat Component**

```jsx
import React, { useState, useEffect } from 'react';

const RTICChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
  
    setIsLoading(true);
    setMessages(prev => [...prev, { type: 'user', content: input }]);
  
    const currentInput = input;
    setInput('');
  
    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: currentInput,
          session_id: sessionId
        })
      });

      const reader = response.body.getReader();
      let botMessage = '';
    
      setMessages(prev => [...prev, { type: 'bot', content: '', streaming: true }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
            
              if (data.type === 'session_id') {
                setSessionId(data.session_id);
              } else if (data.content) {
                botMessage += data.content;
                setMessages(prev => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1].content = botMessage;
                  return newMessages;
                });
              }
            } catch (e) {
              console.error('Parse error:', e);
            }
          }
        }
      }

      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].streaming = false;
        return newMessages;
      });

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rtic-chatbot">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            <div className="content">
              {msg.content}
              {msg.streaming && <span className="cursor">|</span>}
            </div>
          </div>
        ))}
      </div>
    
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Hỏi về RTIC..."
          disabled={isLoading}
        />
        <button onClick={sendMessage} disabled={isLoading || !input.trim()}>
          {isLoading ? '...' : 'Gửi'}
        </button>
      </div>
    </div>
  );
};

export default RTICChatbot;
```

### **Vue.js Document Upload**

```vue
<template>
  <div class="document-upload">
    <div class="upload-area" @drop="handleDrop" @dragover.prevent>
      <input 
        type="file" 
        ref="fileInput"
        @change="handleFileSelect"
        accept=".csv,.pdf,.docx,.md,.txt"
        style="display: none"
      />
    
      <button @click="$refs.fileInput.click()" class="upload-btn">
        Chọn file hoặc kéo thả vào đây
      </button>
    
      <p class="file-types">
        Hỗ trợ: CSV, PDF, Word, Markdown, Text
      </p>
    </div>

    <div v-if="selectedFile" class="file-info">
      <p>File: {{ selectedFile.name }}</p>
      <input 
        v-model="category" 
        placeholder="Category (VD: RTIC Research)"
        class="category-input"
      />
      <button @click="uploadFile" :disabled="uploading" class="upload-submit">
        {{ uploading ? 'Đang upload...' : 'Upload' }}
      </button>
    </div>

    <div v-if="uploadResult" class="upload-result">
      <div v-if="uploadResult.success" class="success">
        ✅ {{ uploadResult.message }}
        <p>Đã tạo {{ uploadResult.doc_info.chunks_count }} chunks</p>
      </div>
      <div v-else class="error">
        ❌ {{ uploadResult.error }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DocumentUpload',
  data() {
    return {
      selectedFile: null,
      category: 'RTIC General',
      uploading: false,
      uploadResult: null
    };
  },
  methods: {
    handleDrop(event) {
      event.preventDefault();
      const files = event.dataTransfer.files;
      if (files.length > 0) {
        this.selectedFile = files[0];
      }
    },
  
    handleFileSelect(event) {
      this.selectedFile = event.target.files[0];
    },
  
    async uploadFile() {
      if (!this.selectedFile) return;
    
      this.uploading = true;
      this.uploadResult = null;
    
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('category', this.category);
    
      try {
        const response = await fetch('/upload', {
          method: 'POST',
          body: formData
        });
      
        this.uploadResult = await response.json();
      
        if (this.uploadResult.success) {
          this.$emit('upload-success', this.uploadResult.doc_info);
          this.selectedFile = null;
          this.category = 'RTIC General';
        }
      } catch (error) {
        this.uploadResult = {
          success: false,
          error: 'Lỗi kết nối. Vui lòng thử lại.'
        };
      } finally {
        this.uploading = false;
      }
    }
  }
};
</script>
```

### **Vanilla JavaScript Document List**

```javascript
class RTICDocumentManager {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    this.documents = [];
    this.init();
  }

  async init() {
    await this.loadDocuments();
    this.render();
  }

  async loadDocuments() {
    try {
      const response = await fetch('/documents');
      const data = await response.json();
      this.documents = data.documents;
    } catch (error) {
      console.error('Failed to load documents:', error);
    }
  }

  async deleteDocument(docId) {
    if (!confirm('Bạn có chắc muốn xóa document này?')) return;

    try {
      const response = await fetch(`/documents/${docId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        this.documents = this.documents.filter(doc => doc.doc_id !== docId);
        this.render();
        alert('Đã xóa document thành công!');
      } else {
        const error = await response.json();
        alert(`Lỗi: ${error.detail}`);
      }
    } catch (error) {
      alert('Lỗi kết nối. Vui lòng thử lại.');
    }
  }

  async reindexDocuments() {
    if (!confirm('Reindex sẽ rebuild toàn bộ vector database. Tiếp tục?')) return;

    try {
      const response = await fetch('/reindex', {
        method: 'POST'
      });

      const result = await response.json();
      alert(result.message || 'Reindex thành công!');
    } catch (error) {
      alert('Lỗi reindex. Vui lòng thử lại.');
    }
  }

  render() {
    if (this.documents.length === 0) {
      this.container.innerHTML = `
        <div class="empty-state">
          <p>Chưa có document nào. Hãy upload document đầu tiên!</p>
        </div>
      `;
      return;
    }

    const documentsHTML = this.documents.map(doc => `
      <div class="document-item" data-doc-id="${doc.doc_id}">
        <div class="doc-info">
          <h3>${doc.title}</h3>
          <p>Category: ${doc.category}</p>
          <p>Chunks: ${doc.chunks_count}</p>
        </div>
        <div class="doc-actions">
          <button onclick="documentManager.deleteDocument('${doc.doc_id}')" class="delete-btn">
            🗑️ Xóa
          </button>
        </div>
      </div>
    `).join('');

    this.container.innerHTML = `
      <div class="document-header">
        <h2>Documents (${this.documents.length})</h2>
        <button onclick="documentManager.reindexDocuments()" class="reindex-btn">
          🔄 Reindex
        </button>
      </div>
      <div class="document-list">
        ${documentsHTML}
      </div>
    `;
  }
}

// Usage
const documentManager = new RTICDocumentManager('#document-container');
```

---

## 🎨 **CSS Styling Examples**

### **Chat Interface**

```css
.rtic-chatbot {
  max-width: 800px;
  margin: 0 auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.chat-messages {
  height: 400px;
  overflow-y: auto;
  padding: 20px;
  background: #f9f9f9;
}

.message {
  margin-bottom: 15px;
  display: flex;
}

.message.user {
  justify-content: flex-end;
}

.message.bot {
  justify-content: flex-start;
}

.message .content {
  max-width: 80%;
  padding: 10px 15px;
  border-radius: 18px;
  word-wrap: break-word;
}

.message.user .content {
  background: #007bff;
  color: white;
}

.message.bot .content {
  background: white;
  border: 1px solid #ddd;
  color: #333;
}

.cursor {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.chat-input {
  display: flex;
  padding: 15px;
  border-top: 1px solid #ddd;
}

.chat-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 20px;
  margin-right: 10px;
  outline: none;
}

.chat-input button {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
}

.chat-input button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
```

### **Upload Interface**

```css
.document-upload {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
}

.upload-area {
  border: 2px dashed #007bff;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  transition: border-color 0.3s;
}

.upload-area:hover {
  border-color: #0056b3;
  background: #f8f9fa;
}

.upload-btn {
  background: #007bff;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
}

.file-types {
  margin-top: 10px;
  color: #666;
  font-size: 14px;
}

.file-info {
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
}

.category-input {
  width: 100%;
  padding: 8px 12px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.upload-submit {
  background: #28a745;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.upload-result .success {
  padding: 10px;
  background: #d4edda;
  color: #155724;
  border-radius: 4px;
  margin-top: 10px;
}

.upload-result .error {
  padding: 10px;
  background: #f8d7da;
  color: #721c24;
  border-radius: 4px;
  margin-top: 10px;
}
```

---

## 🛠️ **Development Setup**

### **Environment Variables**

```bash
# .env file
GOOGLE_GEN_AI_API_KEY=your_gemini_api_key
JINA_AI_API_KEY=your_jina_api_key
QDRANT_HOST=http://localhost:6333
POSTGRES_USER=admin
POSTGRES_PASSWORD=1742005AA
POSTGRES_DB=knowledge_ai
DB_HOST=localhost
DB_PORT=5432
APP_PORT=8000
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:5176,https://hcmutertic.com,https://www.hcmutertic.com,https://chatbot.hcmutertic.com,https://api.hcmutertic.com
```

### **Quick Start**

```bash
# Clone repository
git clone <repository-url>
cd chatbot-fit-be

# Start with Docker (Recommended)
python start_rtic_chatbot.py --mode docker

# Or start manually
pip install -r requirements.txt
python init_database.py
python main.py
```

### **API Testing**

```bash
# Test health check
curl http://localhost:8000/health

# Test chat
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"query": "RTIC có những hoạt động gì?"}'

# Test upload
curl -X POST http://localhost:8000/upload \
  -F "file=@test.pdf" \
  -F "category=Test"

# Test documents list
curl http://localhost:8000/documents
```

---

## 📱 **Mobile Considerations**

### **Responsive Design**

```css
@media (max-width: 768px) {
  .rtic-chatbot {
    margin: 0;
    border-radius: 0;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  .chat-messages {
    flex: 1;
    height: auto;
  }
  
  .message .content {
    max-width: 90%;
  }
}
```

### **Touch Optimization**

```css
.chat-input button,
.upload-btn {
  min-height: 44px; /* iOS touch target */
  min-width: 44px;
}

.document-item {
  padding: 15px;
  border-bottom: 1px solid #eee;
}
```

---

## 🔗 **Useful Links**

- **RTIC Facebook**: https://www.facebook.com/hcmute.rtic
- **HCMUTE**: https://hcmute.edu.vn
- **API Docs (Swagger)**: http://localhost:8000/docs
- **Admin Panel**: http://localhost:8000/docs

---

## 📞 **Support**

Nếu có vấn đề khi integration:

1. **Check API Docs**: `/docs` endpoint
2. **Test với curl**: Verify API hoạt động
3. **Check CORS**: Đảm bảo domain trong allowed origins
4. **Monitor Console**: Xem error logs trong browser
5. **Contact**: hcmute.rtic@gmail.com

---

**📝 Document này sẽ được cập nhật khi có thay đổi API**

**🎉 Happy Coding với RTIC Chatbot!**
