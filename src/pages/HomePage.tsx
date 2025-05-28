import { Link } from 'react-router-dom';
import { 
  FaComment, 
  FaLightbulb, 
  FaBrain, 
  
  FaUniversity, 
  FaUsers, 
  FaArrowRight, 
  FaRobot,
  FaGraduationCap,
  FaBookOpen,
  FaChartLine,
  FaClock,
  FaShieldAlt,
 
  FaCheckCircle,
  FaPlay
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const HomePage = () => {
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

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzNzM3MzciIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-green-500/10 rounded-full blur-xl"></div>

        <div className="container mx-auto px-6 py-24 md:py-32 relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-6xl mx-auto text-center"
          >
            {/* Badge */}
            <motion.div 
              variants={fadeInUp}
              className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white mb-8"
            >
              
              <span className="text-sm font-medium">Trợ lý AI thế hệ mới</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-8"
            >
              <span className="block mb-2">ChatBot</span>
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                FIT HCMUTE
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              variants={fadeInUp}
              className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              Trợ lý AI thông minh được phát triển bởi{' '}
              <span className="font-semibold text-white">Khoa Công nghệ Thông tin</span>{' '}
              và{' '}
              <span className="font-semibold text-white">PTIC</span>, 
              hỗ trợ sinh viên tìm kiếm thông tin nhanh chóng và chính xác.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16"
            >
              <Link 
                to="/chatbot" 
                className="group flex items-center px-8 py-4 bg-white text-gray-900 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FaRobot className="mr-3 text-xl text-blue-500" />
                Bắt đầu trò chuyện
                <FaArrowRight className="ml-3 transform group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button className="group flex items-center px-8 py-4 border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all duration-300">
                <FaPlay className="mr-3" />
                Xem demo
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              variants={fadeInUp}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">24/7</div>
                <div className="text-gray-400 text-sm">Hỗ trợ liên tục</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">1000+</div>
                <div className="text-gray-400 text-sm">Câu hỏi đã trả lời</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">95%</div>
                <div className="text-gray-400 text-sm">Độ chính xác</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">500+</div>
                <div className="text-gray-400 text-sm">Sinh viên sử dụng</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-6xl mx-auto"
          >
            {/* Section Header */}
            <motion.div variants={fadeInUp} className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Tính năng vượt trội
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Khám phá những tính năng tiên tiến giúp ChatBot FIT trở thành trợ lý hoàn hảo cho sinh viên
              </p>
            </motion.div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <motion.div 
                variants={fadeInUp}
                className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FaBrain className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">AI Thông minh</h3>
                <p className="text-gray-600 leading-relaxed">
                  Sử dụng công nghệ AI tiên tiến để hiểu và trả lời câu hỏi một cách tự nhiên và chính xác.
                </p>
              </motion.div>

              {/* Feature 2 */}
              <motion.div 
                variants={fadeInUp}
                className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-200"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FaClock className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Phản hồi nhanh</h3>
                <p className="text-gray-600 leading-relaxed">
                  Nhận được câu trả lời tức thì cho mọi thắc mắc về học tập và thông tin khoa.
                </p>
              </motion.div>

              {/* Feature 3 */}
              <motion.div 
                variants={fadeInUp}
                className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FaShieldAlt className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Thông tin chính xác</h3>
                <p className="text-gray-600 leading-relaxed">
                  Cung cấp thông tin chính thác và được cập nhật liên tục từ nguồn tin đáng tin cậy.
                </p>
              </motion.div>

              {/* Feature 4 */}
              <motion.div 
                variants={fadeInUp}
                className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-red-200"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FaGraduationCap className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Hỗ trợ học tập</h3>
                <p className="text-gray-600 leading-relaxed">
                  Giúp sinh viên tìm hiểu thông tin về môn học, giảng viên và chương trình đào tạo.
                </p>
              </motion.div>

              {/* Feature 5 */}
              <motion.div 
                variants={fadeInUp}
                className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-yellow-200"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FaBookOpen className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Thông tin đa dạng</h3>
                <p className="text-gray-600 leading-relaxed">
                  Cung cấp thông tin về tuyển sinh, học bổng, hoạt động sinh viên và nhiều hơn nữa.
                </p>
              </motion.div>

              {/* Feature 6 */}
              <motion.div 
                variants={fadeInUp}
                className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-indigo-200"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FaChartLine className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Cập nhật liên tục</h3>
                <p className="text-gray-600 leading-relaxed">
                  Thông tin được cập nhật thường xuyên để đảm bảo tính chính xác và kịp thời.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* How it works Section */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-6xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Cách thức hoạt động
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Chỉ với 3 bước đơn giản, bạn có thể bắt đầu trò chuyện với ChatBot FIT
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Step 1 */}
              <motion.div variants={fadeInUp} className="text-center">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold shadow-lg">
                    1
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <FaCheckCircle className="text-white text-xs" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Truy cập ChatBot</h3>
                <p className="text-gray-600">
                  Nhấp vào nút "Bắt đầu trò chuyện" để mở giao diện chat
                </p>
              </motion.div>

              {/* Step 2 */}
              <motion.div variants={fadeInUp} className="text-center">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold shadow-lg">
                    2
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <FaCheckCircle className="text-white text-xs" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Đặt câu hỏi</h3>
                <p className="text-gray-600">
                  Nhập câu hỏi của bạn về bất kỳ thông tin nào liên quan đến Khoa CNTT
                </p>
              </motion.div>

              {/* Step 3 */}
              <motion.div variants={fadeInUp} className="text-center">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold shadow-lg">
                    3
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <FaCheckCircle className="text-white text-xs" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Nhận câu trả lời</h3>
                <p className="text-gray-600">
                  ChatBot sẽ phân tích và cung cấp câu trả lời chính xác ngay lập tức
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-br from-gray-900 to-black">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-white mb-8">
              Sẵn sàng khám phá?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Hãy bắt đầu trò chuyện với ChatBot FIT ngay hôm nay và trải nghiệm sự tiện lợi của trợ lý AI thông minh
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Link 
                to="/chatbot" 
                className="inline-flex items-center px-10 py-4 bg-white text-gray-900 rounded-full font-semibold text-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FaComment className="mr-3 text-2xl text-blue-500" />
                Trò chuyện ngay
                <FaArrowRight className="ml-3" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* About Section */}
      <div className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center mb-6">
                  <FaUniversity className="text-3xl text-blue-500 mr-4" />
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Về chúng tôi
                  </h2>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-6">
                  Khoa Công nghệ Thông tin × PTIC
                </h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  ChatBot FIT là sản phẩm được phát triển bởi sự hợp tác giữa{' '}
                  <span className="font-semibold text-gray-900">Khoa Công nghệ Thông tin - HCMUTE</span>{' '}
                  và{' '}
                  <span className="font-semibold text-gray-900">PTIC (Pioneers of Technology and Innovation Club)</span>.
                </p>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Chúng tôi cam kết mang đến trải nghiệm tốt nhất cho sinh viên, giảng viên và những ai quan tâm đến Khoa CNTT.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <a 
                    href="https://fit.hcmute.edu.vn" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                  >
                    Website Khoa CNTT
                    <FaArrowRight className="ml-2" />
                  </a>
                  <Link 
                    to="/about" 
                    className="inline-flex items-center px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 hover:text-gray-900 transition-colors"
                  >
                    Tìm hiểu thêm
                  </Link>
                </div>
              </motion.div>

              {/* Right Content */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center p-4 bg-blue-50 rounded-xl">
                      <FaUsers className="text-3xl text-blue-500 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-gray-900">1000+</div>
                      <div className="text-sm text-gray-600">Sinh viên</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-xl">
                      <FaGraduationCap className="text-3xl text-green-500 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-gray-900">50+</div>
                      <div className="text-sm text-gray-600">Giảng viên</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-xl">
                      <FaBookOpen className="text-3xl text-purple-500 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-gray-900">20+</div>
                      <div className="text-sm text-gray-600">Chuyên ngành</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-xl">
                      <FaLightbulb className="text-3xl text-red-500 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-gray-900">100+</div>
                      <div className="text-sm text-gray-600">Dự án</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="flex justify-center items-center mb-6">
              <FaRobot className="text-3xl text-blue-400 mr-3" />
              <h3 className="text-2xl font-bold">ChatBot FIT</h3>
            </div>
            <p className="text-lg text-gray-300 mb-4">
              © {new Date().getFullYear()} Khoa Công nghệ Thông tin - Trường Đại học Sư phạm Kỹ thuật TP.HCM
            </p>
            <p className="text-gray-400">
            Developed by HCM UTE Pioneers of Technology and Innovation Club
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage; 