import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUpload, 
  FaFileAlt, 
  FaTrash, 
  FaSync, 
  FaUser, 
  FaSignOutAlt,
  FaChartBar,
  FaCog,
  FaDownload,
  FaEye,
  FaPlus,
  FaSearch,
  FaFilter
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { DocumentService } from '../services/documentService';
import { Document } from '../types/document';
import { Link } from 'react-router-dom';
import logoCNTT from '../assets/logo-cntt2021.png';

const DashboardPage: React.FC = () => {
  const { user, logout, token } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState('RTIC General');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setIsLoading(true);
      const docs = await DocumentService.getDocuments(token || undefined);
      setDocuments(docs);
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) return;

    try {
      setIsUploading(true);
      setUploadMessage('');
      
      const result = await DocumentService.uploadDocument(
        uploadFile, 
        uploadCategory, 
        token || undefined
      );

      if (result.success) {
        setUploadMessage(`✅ ${result.message}`);
        setUploadFile(null);
        setUploadCategory('RTIC General');
        setShowUploadModal(false);
        await loadDocuments();
      } else {
        setUploadMessage(`❌ ${result.error}`);
      }
    } catch (error) {
      setUploadMessage('❌ Có lỗi xảy ra khi upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (docId: string, title: string) => {
    if (!confirm(`Bạn có chắc muốn xóa document "${title}"?`)) return;

    try {
      const success = await DocumentService.deleteDocument(docId, token || undefined);
      if (success) {
        await loadDocuments();
      } else {
        alert('Có lỗi xảy ra khi xóa document');
      }
    } catch (error) {
      alert('Có lỗi xảy ra khi xóa document');
    }
  };

  const handleReindex = async () => {
    if (!confirm('Reindex sẽ rebuild toàn bộ vector database. Tiếp tục?')) return;

    try {
      const success = await DocumentService.reindexDocuments(token || undefined);
      if (success) {
        alert('✅ Reindex thành công!');
      } else {
        alert('❌ Có lỗi xảy ra khi reindex');
      }
    } catch (error) {
      alert('❌ Có lỗi xảy ra khi reindex');
    }
  };

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = Array.from(new Set(documents.map(doc => doc.category)));

  // Stats
  const stats = {
    totalDocuments: documents.length,
    totalChunks: documents.reduce((sum, doc) => sum + doc.chunks_count, 0),
    categories: categories.length,
    avgChunksPerDoc: documents.length > 0 ? Math.round(documents.reduce((sum, doc) => sum + doc.chunks_count, 0) / documents.length) : 0
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img 
                  src={logoCNTT} 
                  alt="RTIC Logo" 
                  className="h-10 w-auto mr-3"
                />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">RTIC Admin Dashboard</h1>
                  <p className="text-sm text-gray-500">Document Management System</p>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-700">
                <FaUser className="mr-2" />
                <span className="font-medium">{user?.username}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center px-4 py-2 text-gray-700 hover:text-red-600 transition-colors duration-300"
              >
                <FaSignOutAlt className="mr-2" />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Welcome Section */}
          <motion.div variants={fadeInUp} className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Chào mừng, {user?.username}! 👋
            </h2>
            <p className="text-gray-600">
              Quản lý documents và theo dõi hoạt động của RTIC Chatbot
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FaFileAlt className="text-blue-600 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tổng Documents</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalDocuments}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <FaChartBar className="text-green-600 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tổng Chunks</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalChunks}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FaCog className="text-purple-600 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Categories</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.categories}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <FaEye className="text-orange-600 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Chunks/Doc</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.avgChunksPerDoc}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Upload Message */}
          {uploadMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl"
            >
              <p className="text-blue-800">{uploadMessage}</p>
            </motion.div>
          )}

          {/* Actions Bar */}
          <motion.div variants={fadeInUp} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                >
                  <FaPlus className="mr-2" />
                  Upload Document
                </button>
                
                <button
                  onClick={handleReindex}
                  className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
                >
                  <FaSync className="mr-2" />
                  Reindex Database
                </button>
              </div>

              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                {/* Search */}
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Category Filter */}
                <div className="relative">
                  <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="all">Tất cả categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Documents List */}
          <motion.div variants={fadeInUp} className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Documents ({filteredDocuments.length})
              </h3>
            </div>

            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Đang tải documents...</p>
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="p-8 text-center">
                <FaFileAlt className="text-gray-400 text-4xl mx-auto mb-4" />
                <p className="text-gray-600">
                  {searchTerm || selectedCategory !== 'all' 
                    ? 'Không tìm thấy documents phù hợp' 
                    : 'Chưa có documents nào. Hãy upload document đầu tiên!'
                  }
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredDocuments.map((doc, index) => (
                  <motion.div
                    key={doc.doc_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 hover:bg-gray-50 transition-colors duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <FaFileAlt className="text-blue-500 mr-3" />
                          <h4 className="text-lg font-medium text-gray-900">{doc.title}</h4>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                            {doc.category}
                          </span>
                          <span>{doc.chunks_count} chunks</span>
                          {doc.file_size && (
                            <span>{(doc.file_size / 1024 / 1024).toFixed(2)} MB</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleDelete(doc.doc_id, doc.title)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-300"
                          title="Xóa document"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Document</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn file
                </label>
                <input
                  type="file"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  accept=".csv,.pdf,.docx,.md,.txt"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Hỗ trợ: CSV, PDF, Word, Markdown, Text
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  placeholder="VD: RTIC Research"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadFile(null);
                  setUploadCategory('RTIC General');
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                disabled={isUploading}
              >
                Hủy
              </button>
              <button
                onClick={handleUpload}
                disabled={!uploadFile || isUploading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
              >
                {isUploading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </div>
                ) : (
                  'Upload'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;