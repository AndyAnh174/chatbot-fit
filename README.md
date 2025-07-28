# Trợ lý ảo RTIC - HCMUTE

Ứng dụng chatbot AI thông minh được phát triển bởi Khoa Công nghệ Thông tin - Trường Đại học Sư phạm Kỹ thuật TP.HCM, hỗ trợ sinh viên tìm kiếm thông tin nhanh chóng và chính xác.

## 🚀 Tính năng chính

### Cho người dùng:
- **Chatbot AI thông minh**: Trả lời câu hỏi về thông tin khoa, môn học, giảng viên
- **Giao diện hiện đại**: Thiết kế responsive với animations mượt mà
- **Lưu trữ lịch sử chat**: Tự động lưu và khôi phục các cuộc trò chuyện
- **Hỗ trợ đa nền tảng**: Hoạt động tốt trên desktop và mobile

### Cho Admin:
- **Quản lý documents**: Upload, xóa, và theo dõi documents
- **Reindex database**: Cập nhật vector database khi có dữ liệu mới
- **Thống kê chi tiết**: Theo dõi số lượng documents, chunks, categories
- **Bảo mật**: Hệ thống authentication với JWT token

## 🛠️ Công nghệ sử dụng

### Frontend:
- **React 19** với TypeScript
- **Vite** - Build tool nhanh
- **Tailwind CSS** - Styling framework
- **Framer Motion** - Animations
- **React Router** - Routing
- **React Icons** - Icon library

### Backend API:
- **FastAPI** (Python)
- **Vector Database** (Pinecone/Chroma)
- **LLM Integration** (OpenAI/Claude)
- **JWT Authentication**

## 📦 Cài đặt và chạy

### Yêu cầu hệ thống:
- Node.js 18+ 
- npm hoặc yarn

### Bước 1: Clone repository
```bash
git clone <repository-url>
cd chatbot-fit
```

### Bước 2: Cài đặt dependencies
```bash
npm install
```

### Bước 3: Cấu hình environment
Tạo file `.env` và cấu hình:
```env
VITE_API_URL=https://apichatbot.andyanh.id.vn
VITE_APP_NAME=Trợ lý ảo RTIC - HCMUTE
VITE_APP_DESCRIPTION=Chatbot trả lời các câu hỏi, thắc mắc liên quan đến Khoa CNTT SPKT TPHCM
VITE_APP_URL=http://localhost:5173
VITE_APP_VERSION=1.0.0-dev
```

### Bước 4: Chạy development server
```bash
npm run dev
```

Ứng dụng sẽ chạy tại: http://localhost:5173

## 🏗️ Build cho production

```bash
npm run build
```

## 📁 Cấu trúc dự án

```
src/
├── components/          # React components
│   ├── Navbar.tsx      # Navigation bar
│   └── ProtectedRoute.tsx # Route protection
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication context
├── pages/              # Page components
│   ├── HomePage.tsx    # Trang chủ
│   ├── ChatbotPage.tsx # Trang chatbot
│   ├── AboutPage.tsx   # Trang giới thiệu
│   ├── LoginPage.tsx   # Trang đăng nhập admin
│   └── DashboardPage.tsx # Dashboard admin
├── services/           # API services
│   └── documentService.ts # Document management
├── types/              # TypeScript types
│   ├── auth.ts         # Authentication types
│   └── document.ts     # Document types
├── assets/             # Static assets
├── config.ts           # Configuration
├── App.tsx             # Main app component
└── main.tsx            # Entry point
```

## 🔐 Authentication

### Admin Login:
- Truy cập: `/admin/login`
- Sử dụng credentials được cấp bởi admin hệ thống
- Token được lưu trong localStorage với key `rtic_admin_token`

### Protected Routes:
- `/admin/dashboard` - Yêu cầu authentication
- Tự động redirect về `/admin/login` nếu chưa đăng nhập

## 📊 API Endpoints

### Public Endpoints:
- `POST /new_session` - Tạo session mới
- `POST /chat` - Gửi tin nhắn
- `GET /chat_history` - Lấy lịch sử chat
- `GET /chat/{session_id}` - Lấy session cụ thể

### Admin Endpoints (Yêu cầu authentication):
- `POST /admin/login` - Đăng nhập admin
- `GET /admin/profile` - Lấy thông tin profile
- `GET /admin/documents` - Lấy danh sách documents
- `POST /admin/upload` - Upload document
- `DELETE /admin/documents/{doc_id}` - Xóa document
- `POST /admin/reindex` - Reindex database

## 🎨 UI/UX Features

- **Responsive Design**: Tối ưu cho mọi thiết bị
- **Dark/Light Mode**: Hỗ trợ theme switching
- **Smooth Animations**: Sử dụng Framer Motion
- **Loading States**: Feedback trực quan cho user
- **Error Handling**: Xử lý lỗi gracefully
- **Accessibility**: Tuân thủ WCAG guidelines

## 🤝 Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Dự án này được phát triển bởi Khoa Công nghệ Thông tin - HCMUTE và PTIC.

## 📞 Liên hệ

- **Email**: fitadm@hcmute.edu.vn
- **Website**: https://fit.hcmute.edu.vn
- **Facebook**: https://www.facebook.com/fithcmute

---

**Developed with ❤️ by the talented student team at PTIC**
