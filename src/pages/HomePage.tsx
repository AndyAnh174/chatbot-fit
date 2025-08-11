import { Link } from 'react-router-dom';
import { 
  FaComment, 
  FaUniversity, 
  FaArrowRight, 
  FaRobot,
  FaCheckCircle,
  FaPlay
} from 'react-icons/fa';
import { motion } from 'framer-motion';
// Dùng background chính cho hero
import heroBg from '../assets/background.png';
import rticGif from '../assets/gif/gif-rtic.gif';
import logoCNTT from '../assets/logo-cntt2021.png';

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
      <div
        className="relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(17,24,39,0.92), rgba(2,6,23,0.9)), url(${heroBg})`,
          backgroundRepeat: 'no-repeat, no-repeat',
          backgroundSize: 'cover, 100%',
          backgroundPosition: 'center, center',
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzNzM3MzciIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-green-500/10 rounded-full blur-xl"></div>

        <div className="container mx-auto px-6 relative z-10 min-h-[calc(100vh-56px)] flex items-center py-10 md:py-12 lg:py-14">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-6xl mx-auto w-full"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 items-center">
              {/* Left content */}
              <div className="md:col-span-7 text-center md:text-left max-w-3xl">
            {/* Badge */}
            <motion.div 
              variants={fadeInUp}
              className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white mb-8"
            >
              <span className="text-sm font-medium">Trợ lý AI của RTIC</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              variants={fadeInUp}
                className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-4 lg:mb-5"
            >
                <span className="block mb-1">Trợ lý ảo RTIC</span>
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                HCM UTE Research on Technology and Innovation Club
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              variants={fadeInUp}
                className="text-base md:text-lg lg:text-xl text-gray-300 mb-6 lg:mb-8 max-w-[48ch] mx-auto md:mx-0 leading-relaxed"
            >
              Trợ lý AI chính thức của{' '}
              <span className="font-semibold text-white">HCM UTE Research on Technology and Innovation Club (RTIC)</span>,
              giúp sinh viên Khoa Công nghệ Thông tin (FIT) tra cứu thông tin về khoa, chương trình học, hoạt động – sự kiện
              và khám phá RTIC cùng các câu lạc bộ trong khoa một cách nhanh chóng, chính xác.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              variants={fadeInUp}
                className="flex flex-col sm:flex-row justify-center md:justify-start items-center space-y-3 sm:space-y-0 sm:space-x-6 mb-6"
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
                className="hidden lg:grid grid-cols-4 gap-6 max-w-3xl"
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
              </div>

              {/* Right visual */}
              <div className="md:col-span-5 hidden md:flex justify-center md:justify-end">
                <motion.div variants={fadeInUp}>
                  <img
                    src={rticGif}
                    alt="RTIC Animation"
                    className="max-h-48 lg:max-h-60 xl:max-h-72 rounded-2xl shadow-2xl border border-white/10"
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Removed Features Section per request */}

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
                Chỉ với 3 bước đơn giản, bạn có thể bắt đầu trò chuyện với Trợ lý ảo RTIC
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
                  Nhập câu hỏi của bạn về bất kỳ thông tin nào liên quan đến RTIC hoặc học tập
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
               Hãy bắt đầu trò chuyện với Trợ lý ảo RTIC ngay hôm nay và trải nghiệm sự tiện lợi của trợ lý AI thông minh
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
                  HCM UTE Research on Technology and Innovation Club (RTIC)
                </h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Trợ lý ảo RTIC là sản phẩm được phát triển bởi{' '}
                  <span className="font-semibold text-gray-900">HCM UTE Research on Technology and Innovation Club</span>.
                </p>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Chúng tôi cam kết mang đến trải nghiệm tốt nhất cho sinh viên, giảng viên và cộng đồng công nghệ.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <a 
                    href="https://www.facebook.com/hcmute.rtic" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                  >
                    Facebook RTIC
                    <FaArrowRight className="ml-2" />
                  </a>
                  <a 
                    href="https://hcmutertic.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 hover:text-gray-900 transition-colors"
                  >
                    Website RTIC
                    <FaArrowRight className="ml-2" />
                  </a>
                </div>
              </motion.div>

              {/* Right Content - removed stats grid as requested */}
              <div className="hidden lg:block" />
            </div>
          </div>
        </div>
      </div>

      {/* FIT – Khoa CNTT Section (merged from About) */}
      <div className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-6xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <div className="inline-flex items-center px-6 py-3 bg-blue-50 rounded-full border border-blue-200 mb-8">
                <span className="text-gray-800 font-semibold">Đối tác</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">FIT – Khoa Công nghệ Thông tin</h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">Cảm ơn sự đồng hành của FIT trong việc cung cấp dữ liệu, tài nguyên và định hướng phát triển dự án.</p>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 border border-gray-200/50 shadow-2xl">
                <div className="text-center mb-10">
                  <div className="inline-block p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl">
                    <img src={logoCNTT} alt="FIT - HCMUTE" className="max-h-32 mx-auto drop-shadow-lg" />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Khoa Công nghệ Thông tin (FIT) – HCMUTE</h3>
                  <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
                    Cung cấp dữ liệu, tài nguyên, kiến thức chuyên môn và định hướng phát triển dự án phù hợp với nhu cầu thực tế của sinh viên và giảng viên.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="p-6 bg-blue-50 rounded-2xl text-center">
                      <div className="text-3xl mb-2">📘</div>
                      <h4 className="font-bold text-gray-900 mb-1">Cung cấp dữ liệu</h4>
                      <p className="text-gray-600 text-sm">Thông tin chính thức và cập nhật</p>
                    </div>
                    <div className="p-6 bg-green-50 rounded-2xl text-center">
                      <div className="text-3xl mb-2">🧑‍🏫</div>
                      <h4 className="font-bold text-gray-900 mb-1">Hỗ trợ kỹ thuật</h4>
                      <p className="text-gray-600 text-sm">Tư vấn chuyên môn và định hướng</p>
                    </div>
                    <div className="p-6 bg-purple-50 rounded-2xl text-center">
                      <div className="text-3xl mb-2">🚀</div>
                      <h4 className="font-bold text-gray-900 mb-1">Triển khai</h4>
                      <p className="text-gray-600 text-sm">Hỗ trợ đưa sản phẩm vào sử dụng</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="flex justify-center items-center mb-6">
              <FaRobot className="text-3xl text-blue-400 mr-3" />
              <h3 className="text-2xl font-bold">Trợ lý ảo RTIC</h3>
            </div>
            <p className="text-lg text-gray-300 mb-4">
              © {new Date().getFullYear()} HCM UTE Research on Technology and Innovation Club
            </p>
            <p className="text-gray-400">
            Developed by RTIC Team
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage; 