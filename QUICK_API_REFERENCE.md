# RTIC Chatbot - Quick API Reference

## 🚀 **Base URL**
- **Local**: `http://localhost:8000`
- **Docker**: `http://localhost:8002` 
- **Production**: `https://api.hcmutertic.com`

## 🔑 **Authentication**
**None** - Public access, không cần token

---

## 📚 **Essential Endpoints**

### **💬 Chat**
```javascript
POST /chat
Content-Type: application/json

{
  "query": "RTIC có những hoạt động gì?",
  "session_id": "optional-uuid"
}

// Response: Server-Sent Events (SSE)
// Event: data: {"content": "chunk", "format_type": "markdown"}
```

### **📤 Upload Document**
```javascript
POST /upload
Content-Type: multipart/form-data

FormData:
- file: file_object (.csv, .pdf, .docx, .md, .txt)
- category: "RTIC Research" (optional)

// Response:
{
  "success": true,
  "message": "Đã upload thành công 10 chunks",
  "doc_info": { "doc_id": "abc123", "chunks_count": 10 }
}
```

### **📋 List Documents**
```javascript
GET /documents

// Response:
{
  "documents": [
    {
      "doc_id": "abc123",
      "title": "research.pdf",
      "category": "RTIC Research",
      "chunks_count": 10
    }
  ],
  "total_count": 1
}
```

### **🗑️ Delete Document**
```javascript
DELETE /documents/{doc_id}

// Response:
{
  "success": true,
  "message": "Đã xóa document thành công"
}
```

### **🔄 Reindex**
```javascript
POST /reindex

// Response:
{
  "success": true,
  "message": "Đã reindex thành công"
}
```

---

## 💻 **Frontend Integration**

### **React Chat Hook**
```jsx
import { useState, useRef } from 'react';

export const useRTICChat = () => {
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (query) => {
    setLoading(true);
    setMessages(prev => [...prev, { type: 'user', content: query }]);

    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, session_id: sessionId })
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
            } catch (e) {}
          }
        }
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: 'Lỗi kết nối. Vui lòng thử lại.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, sendMessage, loading, sessionId };
};
```

### **Vue Upload Component**
```vue
<template>
  <div>
    <input 
      type="file" 
      @change="handleUpload"
      accept=".csv,.pdf,.docx,.md,.txt"
    />
    <input v-model="category" placeholder="Category" />
    <button @click="upload" :disabled="!file">Upload</button>
    
    <div v-if="result">{{ result.message }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      file: null,
      category: 'RTIC General',
      result: null
    };
  },
  methods: {
    handleUpload(e) {
      this.file = e.target.files[0];
    },
    
    async upload() {
      const formData = new FormData();
      formData.append('file', this.file);
      formData.append('category', this.category);
      
      const response = await fetch('/upload', {
        method: 'POST',
        body: formData
      });
      
      this.result = await response.json();
      this.$emit('uploaded', this.result);
    }
  }
};
</script>
```

### **Vanilla JS Document Manager**
```javascript
class RTICDocuments {
  async getDocuments() {
    const response = await fetch('/documents');
    return response.json();
  }
  
  async deleteDocument(docId) {
    const response = await fetch(`/documents/${docId}`, {
      method: 'DELETE'
    });
    return response.json();
  }
  
  async reindex() {
    const response = await fetch('/reindex', {
      method: 'POST'
    });
    return response.json();
  }
}

const rticDocs = new RTICDocuments();
```

---

## 🎨 **Quick CSS**
```css
.rtic-chat {
  max-width: 800px;
  margin: 0 auto;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.messages {
  height: 400px;
  overflow-y: auto;
  padding: 20px;
}

.message {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 8px;
}

.message.user {
  background: #007bff;
  color: white;
  margin-left: 20%;
}

.message.bot {
  background: #f1f1f1;
  margin-right: 20%;
}

.input-area {
  display: flex;
  padding: 15px;
  border-top: 1px solid #ddd;
}

.input-area input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
}

.input-area button {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
```

---

## 🔧 **Error Handling**
```javascript
// Generic error handler
const handleAPIError = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'API Error');
  }
  return response.json();
};

// Usage
try {
  const data = await fetch('/documents').then(handleAPIError);
} catch (error) {
  console.error('API Error:', error.message);
}
```

---

## 📱 **Mobile-First CSS**
```css
@media (max-width: 768px) {
  .rtic-chat {
    margin: 0;
    height: 100vh;
    border-radius: 0;
    display: flex;
    flex-direction: column;
  }
  
  .messages {
    flex: 1;
  }
  
  .message.user,
  .message.bot {
    margin-left: 0;
    margin-right: 0;
  }
}
```

---

## 🌐 **CORS Domains**
```
http://localhost:3000
http://localhost:5173  
http://localhost:5176
https://hcmutertic.com
https://www.hcmutertic.com
https://chatbot.hcmutertic.com
https://api.hcmutertic.com
```

---

## 📞 **Quick Support**
- **Docs**: `/docs` (Swagger UI)
- **Health**: `/health`
- **Facebook**: https://www.facebook.com/hcmute.rtic
- **Email**: hcmute.rtic@gmail.com

**🎉 Ready to build với RTIC Chatbot!** 