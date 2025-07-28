import { Link } from 'react-router-dom';
import { 
  FaBrain, 
  FaArrowRight, 
  FaRobot,
  FaGraduationCap,
  FaBookOpen,
  FaChartLine,
  FaClock,
  FaShieldAlt,
  FaUsers,
  FaCheckCircle,
  FaPlay,
  FaUserCog
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
    <div className="relative w-full min-h-screen bg-white">
      <div className="absolute inset-0 overflow-y-auto overflow-x-hidden">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzNzM3MzciIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-green-500/10 rounded-full blur-xl animate-pulse delay-2000"></div>

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
                <FaUsers className="mr-2" />
                <span className="text-sm font-medium">RTIC - Câu lạc bộ Nghiên cứu Công nghệ & Đổi mới</span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1 
                variants={fadeInUp}
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-8"
              >
                <span className="block mb-2">Trợ lý ảo</span>
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                  RTIC
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p 
                variants={fadeInUp}
                className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
              >
                Trợ lý AI thông minh được phát triển bởi{' '}
                <span className="font-semibold text-white">HCM UTE Research on Technology and Innovation Club</span>, 
                hỗ trợ tân sinh viên tìm hiểu về CLB và Khoa Công nghệ Thông tin.
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
                  <div className="text-3xl font-bold text-white mb-2">500+</div>
                  <div className="text-gray-400 text-sm">Tân sinh viên hỗ trợ</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">95%</div>
                  <div className="text-gray-400 text-sm">Độ chính xác</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">100+</div>
                  <div className="text-gray-400 text-sm">Thành viên RTIC</div>
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
                  Tại sao chọn RTIC Chatbot?
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Khám phá những tính năng độc đáo giúp RTIC Chatbot trở thành người bạn đồng hành hoàn hảo cho tân sinh viên
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
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Thông tin CLB chính xác</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Cung cấp thông tin chi tiết về RTIC, hoạt động, dự án và cơ hội tham gia cho tân sinh viên.
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
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Phản hồi nhanh chóng</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Nhận được câu trả lời tức thì cho mọi thắc mắc về CLB, khoa CNTT và định hướng học tập.
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
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Bảo mật thông tin</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Được bảo vệ bởi CLB An toàn thông tin với công nghệ pentest tiên tiến, đảm bảo an toàn tuyệt đối.
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
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Hướng dẫn tân sinh viên</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Giúp tân sinh viên hiểu rõ về khoa CNTT, chương trình đào tạo và cơ hội phát triển.
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
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Kiến thức đa dạng</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Cung cấp thông tin về công nghệ, nghiên cứu, dự án và hoạt động của RTIC.
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
                    Thông tin được cập nhật thường xuyên về hoạt động mới nhất của CLB và khoa CNTT.
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
                  Chỉ với 3 bước đơn giản, bạn có thể bắt đầu trò chuyện với RTIC Chatbot
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
                    Nhấp vào nút "Bắt đầu trò chuyện" để mở giao diện chat với RTIC Bot
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
                    Hỏi về RTIC, khoa CNTT, hoạt động nghiên cứu hoặc bất kỳ thông tin nào bạn quan tâm
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
                    RTIC Bot sẽ phân tích và cung cấp thông tin chính xác, hữu ích ngay lập tức
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.div variants={fadeInUp}>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                  Sẵn sàng khám phá RTIC?
                </h2>
                <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
                  Bắt đầu trò chuyện với RTIC Chatbot ngay hôm nay và khám phá thế giới công nghệ đầy thú vị
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link 
                    to="/chatbot" 
                    className="group flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <FaRobot className="mr-3 text-xl" />
                    Bắt đầu trò chuyện
                    <FaArrowRight className="ml-3 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                  
                  <Link 
                    to="/admin/login" 
                    className="group flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
                  >
                    <FaUserCog className="mr-3" />
                    Admin Login
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* About Section */}
        <div className="py-24 bg-gray-50">
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
                  Về RTIC
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  HCM UTE Research on Technology and Innovation Club - Nơi ươm mầm tài năng công nghệ
                </p>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div variants={fadeInUp}>
                  <div className="bg-white p-8 rounded-2xl shadow-lg">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Sứ mệnh của chúng tôi</h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      RTIC được thành lập với mục tiêu tạo ra môi trường học tập và nghiên cứu công nghệ 
                      sôi động cho sinh viên Khoa Công nghệ Thông tin. Chúng tôi cam kết hỗ trợ tân sinh viên 
                      khám phá và phát triển tiềm năng trong lĩnh vực công nghệ.
                    </p>
                    <div className="flex items-center">
                      <FaCheckCircle className="text-green-500 mr-3 text-xl" />
                      <span className="font-semibold text-gray-800">Nghiên cứu và đổi mới công nghệ</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white text-center">
                      <FaUsers className="text-3xl mx-auto mb-3" />
                      <div className="text-2xl font-bold mb-1">100+</div>
                      <div className="text-blue-100 text-sm">Thành viên tích cực</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white text-center">
                      <FaBookOpen className="text-3xl mx-auto mb-3" />
                      <div className="text-2xl font-bold mb-1">50+</div>
                      <div className="text-green-100 text-sm">Dự án nghiên cứu</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white text-center">
                      <FaShieldAlt className="text-3xl mx-auto mb-3" />
                      <div className="text-2xl font-bold mb-1">24/7</div>
                      <div className="text-purple-100 text-sm">Hỗ trợ tân sinh viên</div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500 to-red-500 p-6 rounded-xl text-white text-center">
                      <FaChartLine className="text-3xl mx-auto mb-3" />
                      <div className="text-2xl font-bold mb-1">95%</div>
                      <div className="text-orange-100 text-sm">Hài lòng</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-6">
            <div className="text-center">
              <div className="flex justify-center items-center mb-6">
                <FaRobot className="text-3xl text-blue-400 mr-3" />
                <h3 className="text-2xl font-bold">RTIC Chatbot</h3>
              </div>
              <p className="text-lg text-gray-300 mb-4">
                © {new Date().getFullYear()} HCM UTE Research on Technology and Innovation Club
              </p>
              <p className="text-gray-400">
                Được phát triển bởi RTIC Team với sự hỗ trợ của CLB An toàn thông tin
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage; 