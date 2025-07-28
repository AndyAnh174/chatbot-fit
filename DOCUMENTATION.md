# Hệ thống Chatbot RAG cho Khoa Công nghệ Thông tin - HCMUTE

## Tóm tắt dự án

Đây là hệ thống chatbot thông minh sử dụng kiến trúc RAG (Retrieval-Augmented Generation) nhằm hỗ trợ và giải đáp thắc mắc về thông tin liên quan đến Khoa Công nghệ Thông tin - Trường Đại học Sư phạm Kỹ thuật TP.HCM (HCMUTE).

## Mục tiêu

- Cung cấp thông tin chính xác về tuyển sinh, chương trình đào tạo, và các dịch vụ của khoa
- Hỗ trợ sinh viên, phụ huynh và người quan tâm 24/7
- Giảm tải công việc tư vấn cho cán bộ khoa
- Tích hợp AI để tương tác tự nhiên và thân thiện

## Kiến trúc tổng quan

### 1. Kiến trúc RAG (Retrieval-Augmented Generation)

```
[User Question] → [Question Processing] → [Document Retrieval] → [Context Building] → [LLM Generation] → [Response]
```

### 2. Các thành phần chính

#### 2.1 Backend API (FastAPI)
- **File**: `main.py`
- **Chức năng**: Xử lý API requests, authentication, chat streaming
- **Endpoints chính**:
  - `POST /chat`: Xử lý câu hỏi và trả lời
  - `POST /new_session`: Tạo session mới
  - `GET /chat_history`: Lấy lịch sử chat
  - `POST /register`, `POST /login`: Xác thực người dùng

#### 2.2 RAG Core Engine
- **File**: `rag/core.py`
- **Kiến trúc**: LangGraph StateGraph với các nodes
- **Workflow**:
  1. `contextualize_question`: Xử lý câu hỏi theo ngữ cảnh
  2. `summarize_chat_history`: Tóm tắt lịch sử chat
  3. `retrieve_documents`: Tìm kiếm tài liệu liên quan
  4. `generate_response`: Sinh phản hồi từ LLM
  5. `update_chat_history`: Cập nhật lịch sử

#### 2.3 Retrieval System
- **File**: `rag/retriever.py`
- **Chiến lược**: Hybrid Retrieval (Dense + Sparse + Late Interaction)
- **Embeddings**:
  - **Dense**: BGE-M3 (1024 dimensions)
  - **Sparse**: BM25 (keyword matching)
  - **Late Interaction**: ColBERT v2.0 (multi-vector)

#### 2.4 Vector Database
- **Technology**: Qdrant
- **Configuration**: Multi-vector storage với 3 loại embeddings
- **Collections**: `chunk_index` cho storing documents

## Công nghệ sử dụng

### 1. Core Technologies

#### 1.1 AI/ML Framework
- **LangChain**: Framework chính cho RAG pipeline
- **LangGraph**: State machine để quản lý workflow
- **Google Generative AI**: LLM chính (Gemini 2.0 Flash)

#### 1.2 Embeddings & Search
- **BGE-M3**: Dense embeddings (BAAI/bge-m3)
- **BM25**: Sparse embeddings (Qdrant/bm25)
- **ColBERT v2.0**: Late interaction embeddings
- **Qdrant**: Vector database

#### 1.3 Backend Technologies
- **FastAPI**: Web framework
- **PostgreSQL**: Relational database
- **JWT**: Authentication
- **Uvicorn**: ASGI server

#### 1.4 Deployment
- **Docker**: Containerization
- **Docker Compose**: Multi-service orchestration

### 2. Thư viện Python chính

```python
# AI/ML Libraries
langchain-google-genai==2.1.2      # Google Generative AI integration
langchain-qdrant==0.2.0           # Qdrant vector database connector
langgraph==0.3.22                 # State machine workflow
transformers==4.37.2              # Hugging Face transformers
torch==2.1.0                      # PyTorch for deep learning
fastembed==0.6.0                  # Fast embedding models
huggingface-hub==0.29.3           # Hugging Face model hub

# Web Framework
fastapi==0.115.12                 # Modern web framework
uvicorn==0.34.0                   # ASGI server
pydantic==2.11.0                  # Data validation
starlette==0.46.1                 # ASGI framework

# Database
psycopg2-binary==2.9.10           # PostgreSQL adapter
qdrant-client==1.13.3             # Qdrant vector database client
pgvector==0.3.6                   # PostgreSQL vector extension

# Authentication & Security
PyJWT==2.8.0                      # JSON Web Token
passlib[bcrypt]==1.7.4            # Password hashing
python-jose[cryptography]==3.3.0  # JWT with cryptography

# Data Processing
pandas==2.2.3                     # Data manipulation
numpy==1.26.4                     # Numerical computing
nltk==3.9.1                       # Natural language toolkit
scipy==1.13.1                     # Scientific computing

# Utilities
python-dotenv==1.1.0              # Environment variables
requests==2.32.3                  # HTTP requests
pydantic-settings==2.8.1          # Settings management
```

## Thuật toán RAG chi tiết

### 1. Question Processing

```python
def contextualize_question(self, state: AgentState) -> AgentState:
    # Xử lý câu hỏi dựa trên ngữ cảnh cuộc trò chuyện
    # Sử dụng 4 tin nhắn gần nhất để hiểu ngữ cảnh
    # Viết lại câu hỏi thành câu hoàn chỉnh
```

### 2. Document Retrieval (Hybrid Search)

```python
def retrieve(self, query: str) -> List[Document]:
    # 1. Dense Vector Search (BGE-M3)
    dense_vectors = self.dense_embedding_model.embed_query(query)
    
    # 2. Sparse Vector Search (BM25)
    sparse_vectors = self.bm25_embedding_model.query_embed(query)
    
    # 3. Late Interaction Search (ColBERT)
    late_vectors = self.late_interaction_embedding_model.embed_query(query)
    
    # 4. Hybrid Fusion
    results = self.qdrant_client.query_points(
        prefetch=[dense_search, sparse_search],
        query=late_vectors,
        limit=40
    )
```

### 3. Context Building

```python
def retrieve_documents(self, state: AgentState) -> AgentState:
    # Lấy documents từ retrieval
    # Format thành context có cấu trúc:
    # TIÊU ĐỀ: [title]
    # PHÂN LOẠI: [category]
    # NỘI DUNG: [content]
```

### 4. Response Generation

```python
def generate_response(self, state: AgentState) -> AgentState:
    # Sử dụng prompt template với:
    # - Context từ retrieved documents
    # - Lịch sử chat (6 tin nhắn gần nhất)
    # - Tóm tắt cuộc trò chuyện
    # - Gemini 2.0 Flash để sinh phản hồi
```

## Cách triển khai

### 1. Môi trường phát triển

```bash
# Clone repository
git clone [repository-url]
cd chatbot-fit-be

# Cài đặt dependencies
pip install -r requirements.txt

# Khởi động services
docker-compose up -d qdrant db

# Chạy ứng dụng
python main.py
```

### 2. Cấu hình môi trường

```bash
# File .env
GOOGLE_GEN_AI_API_KEY=your_api_key
QDRANT_HOST=http://localhost:6333
DATABASE_URL=postgresql://admin:password@localhost:5432/knowledge_ai
JWT_SECRET=your_jwt_secret
```

### 3. Khởi tạo dữ liệu

```bash
# Chạy script khởi tạo
python script.py
```

### 4. Triển khai Production

```bash
# Khởi động tất cả services
docker-compose up -d

# Kiểm tra services
docker-compose ps
```

## Luồng xử lý dữ liệu

### 1. Data Ingestion
- Đọc dữ liệu từ CSV files (`dataset/` folder)
- Chunking documents thành các đoạn nhỏ
- Embedding với 3 loại: Dense, Sparse, Late Interaction

### 2. Storage
- Lưu embeddings vào Qdrant Vector DB
- Metadata và payload trong cùng collection
- Index optimization cho search performance

### 3. Query Processing
- Nhận câu hỏi từ user
- Contextualize dựa trên chat history
- Hybrid search trong vector DB
- Rerank và select top results

### 4. Response Generation
- Build context từ retrieved documents
- Sử dụng prompt template
- Generate với Gemini 2.0 Flash
- Stream response to user

## Tính năng nổi bật

### 1. Hybrid Search
- Kết hợp 3 loại embeddings cho độ chính xác cao
- Dense vectors cho semantic similarity
- Sparse vectors cho keyword matching
- Late interaction cho fine-grained matching

### 2. Conversation Memory
- Lưu lịch sử chat trong PostgreSQL
- Summarization để giữ context
- Session management

### 3. Multi-user Support
- User authentication với JWT
- Role-based access control
- Guest mode support

### 4. Streaming Response
- Real-time response streaming
- Better user experience
- Server-sent events

## Hiệu suất và tối ưu

### 1. Embeddings Optimization
- Batch processing cho embedding
- Model loading optimization
- Multi-vector storage

### 2. Search Optimization
- Prefetch strategy cho hybrid search
- Limit và filter optimization
- Caching layer

### 3. Memory Management
- Chat history summarization
- Session cleanup
- Database connection pooling

## Bảo mật

### 1. Authentication
- JWT-based authentication
- Password hashing với bcrypt
- Session management

### 2. Data Protection
- Input validation
- SQL injection prevention
- CORS configuration

### 3. Access Control
- Role-based permissions
- API rate limiting
- Secure headers

## Kết luận

Hệ thống chatbot RAG này kết hợp các công nghệ AI hiện đại để tạo ra một trợ lý thông minh, có khả năng:

- Hiểu ngữ cảnh cuộc trò chuyện
- Tìm kiếm thông tin chính xác
- Sinh phản hồi tự nhiên và hữu ích
- Hỗ trợ đa người dùng
- Triển khai dễ dàng với Docker

Đây là một giải pháp hoàn chỉnh cho việc tự động hóa tư vấn và hỗ trợ thông tin trong môi trường giáo dục. 