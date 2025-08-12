import { Link } from 'react-router-dom';
import { 
  FaArrowRight, 
  FaCheckCircle,
  FaEnvelope,
  FaFacebookSquare,
  FaGithub,
  FaGlobe,
  FaPlay,
  FaRobot,
  FaUniversity
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import heroBg from '../assets/background.png';
import rticGif from '../assets/gif/gif-rtic.gif';
import logoCNTT from '../assets/logo-cntt2021.png';

const HomePage = () => {
  // Animation variants
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
          backgroundImage: `url(${heroBg})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzNzM3MzciIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        
        {/* Floating Elements (match yellow-blue ribbon vibe) */}
        <div className="absolute -top-10 -right-10 w-56 h-56 bg-gradient-to-br from-yellow-300/40 to-blue-400/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-blue-400/30 to-yellow-300/30 rounded-full blur-3xl translate-x-[-30%] translate-y-[30%]"></div>

        <div className="container mx-auto px-6 relative z-10 min-h-[100vh] flex items-center py-12 md:py-14 lg:py-16">
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
                  <span className="block bg-gradient-to-r from-yellow-300 via-yellow-400 to-blue-400 bg-clip-text text-transparent">
                HCM UTE Research on Technology and Innovation Club
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              variants={fadeInUp}
                  className="text-base md:text-lg lg:text-xl text-gray-200 mb-6 lg:mb-8 max-w-[58ch] mx-auto md:mx-0 leading-relaxed"
            >
                  Trợ lý AI chính thức của 
                  <span className="font-semibold text-white"> HCM UTE Research on Technology and Innovation Club (RTIC)</span>,
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
                    className="group flex items-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-blue-600 text-white rounded-full font-semibold text-lg hover:from-yellow-500 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                    <FaRobot className="mr-3 text-xl text-white" />
                Bắt đầu trò chuyện
                <FaArrowRight className="ml-3 transform group-hover:translate-x-1 transition-transform" />
              </Link>
              
                  <button className="group flex items-center px-8 py-4 border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300">
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
                    <div className="text-gray-300 text-sm">Hỗ trợ liên tục</div>
              </div>
              <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">100+</div>
                    <div className="text-gray-300 text-sm">Câu hỏi đã trả lời</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">90%</div>
                    <div className="text-gray-300 text-sm">Độ chính xác</div>
              </div>
              <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">100+</div>
                    <div className="text-gray-300 text-sm">Sinh viên sử dụng</div>
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
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <div className="inline-flex items-center px-5 py-2 rounded-full bg-gradient-to-r from-yellow-100 to-blue-100 border border-yellow-200/70 text-yellow-800 mb-6">
                <span className="text-sm font-semibold">Cách thức hoạt động</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Bắt đầu trong 3 bước đơn giản
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Trải nghiệm Trợ lý ảo RTIC nhanh chóng – trực quan – hiệu quả
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <motion.div variants={fadeInUp} className="">
                <div className="h-full p-6 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 text-white flex items-center justify-center font-bold mr-3">1</div>
                    <h3 className="text-lg font-bold text-gray-900">Truy cập ChatBot</h3>
                  </div>
                  <p className="text-gray-600 text-sm">Chọn nút “Bắt đầu trò chuyện” ở phần đầu trang hoặc truy cập trực tiếp đường dẫn <span className="font-medium text-gray-900">/chatbot</span>.</p>
                </div>
              </motion.div>

              {/* Step 2 */}
              <motion.div variants={fadeInUp} className="">
                <div className="h-full p-6 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold mr-3">2</div>
                    <h3 className="text-lg font-bold text-gray-900">Đặt câu hỏi</h3>
                  </div>
                  <p className="text-gray-600 text-sm">Nhập câu hỏi về Khoa CNTT, RTIC, hoạt động – sự kiện, học tập… và gửi. Có thể dùng phím tắt <span className="font-medium">Ctrl + Enter</span>.</p>
                </div>
              </motion.div>

              {/* Step 3 */}
              <motion.div variants={fadeInUp} className="">
                <div className="h-full p-6 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center font-bold mr-3">3</div>
                    <h3 className="text-lg font-bold text-gray-900">Nhận câu trả lời</h3>
                  </div>
                  <p className="text-gray-600 text-sm">AI phân tích và trả lời tức thì kèm định dạng đẹp (bảng, danh sách, code…). Bạn có thể copy, tiếp tục hỏi hoặc tạo phiên chat mới.</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>


      {/* About Section */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center mb-4">
                  <FaUniversity className="text-3xl text-blue-600 mr-3" />
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Về chúng tôi</h2>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  <span className="font-semibold text-gray-900">RTIC (Research on Technology and Innovation Club)</span> là câu lạc bộ nghiên cứu khoa học và công nghệ của Khoa CNTT (FIT) – HCMUTE. Chúng tôi tập trung nghiên cứu công nghệ, phát triển ứng dụng và thử nghiệm các công nghệ mới; đồng thời kết nối sinh viên đam mê công nghệ thông qua hoạt động học thuật – dự án thực tế, lan tỏa tinh thần “Beyond limits, into innovation”.
                </p>

                {/* Mission / Vision / Values */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div className="p-5 rounded-2xl border bg-gradient-to-br from-blue-50 to-white border-blue-100 shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mr-2">
                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-1h2v1zm0-3H9V5h2v5z"/></svg>
                      </span>
                      <h4 className="font-semibold text-gray-900">Sứ mệnh</h4>
                    </div>
                    <p className="text-sm text-gray-600">Trao quyền cho sinh viên phát triển tư duy nghiên cứu và năng lực ứng dụng công nghệ.</p>
                  </div>
                  <div className="p-5 rounded-2xl border bg-gradient-to-br from-yellow-50 to-white border-yellow-100 shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="w-8 h-8 rounded-xl bg-yellow-100 text-yellow-700 flex items-center justify-center mr-2">
                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 10-2 0v2.09A7.002 7.002 0 003.05 11H1a1 1 0 100 2h2.05a7.002 7.002 0 005.95 5.91V21a1 1 0 102 0v-2.09A7.002 7.002 0 0016.95 13H19a1 1 0 100-2h-2.05A7.002 7.002 0 0011 5.09V3z"/></svg>
                      </span>
                      <h4 className="font-semibold text-gray-900">Tầm nhìn</h4>
                    </div>
                    <p className="text-sm text-gray-600">Trở thành cộng đồng sinh viên công nghệ dẫn dắt xu hướng đổi mới sáng tạo tại HCMUTE.</p>
                  </div>
                  <div className="p-5 rounded-2xl border bg-gradient-to-br from-purple-50 to-white border-purple-100 shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mr-2">❤️</span>
                      <h4 className="font-semibold text-gray-900">Giá trị</h4>
                    </div>
                    <p className="text-sm text-gray-600">Tò mò – Ham học – Chia sẻ – Trách nhiệm – Tính thực tiễn.</p>
                  </div>
                </div>

                {/* Highlights */}
                <div className="mb-8">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Trọng tâm hoạt động</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">Nghiên cứu & học thuật</span>
                    <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">Sự kiện & workshop</span>
                    <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">Dự án thực tế</span>
                    <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">Mentorship</span>
                    <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-pink-50 text-pink-700 border border-pink-200">Cộng đồng CLB</span>
                    <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">Open-source</span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                  <div className="p-4 rounded-2xl border border-gray-200 bg-white shadow-sm text-center">
                    <div className="text-2xl font-bold text-gray-900">30+</div>
                    <div className="text-xs text-gray-500">Thành viên</div>
                  </div>
                  <div className="p-4 rounded-2xl border border-gray-200 bg-white shadow-sm text-center">
                    <div className="text-2xl font-bold text-gray-900">5+</div>
                    <div className="text-xs text-gray-500">Sự kiện/năm</div>
                  </div>
                  <div className="p-4 rounded-2xl border border-gray-200 bg-white shadow-sm text-center">
                    <div className="text-2xl font-bold text-gray-900">5+</div>
                    <div className="text-xs text-gray-500">Dự án</div>
                  </div>
                  <div className="p-4 rounded-2xl border border-gray-200 bg-white shadow-sm text-center">
                    <div className="text-2xl font-bold text-gray-900">4+</div>
                    <div className="text-xs text-gray-500">Đối tác</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <a 
                    href="https://www.facebook.com/hcmute.rtic" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
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

              {/* Right Content */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="w-full"
              >
                <div className="bg-gradient-to-br from-blue-50 via-white to-yellow-50 border border-gray-200 rounded-3xl p-8 shadow-xl">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center mr-4 shadow-sm">
                      <img src="/only-logo@4x.png" alt="RTIC" className="w-9 h-9 object-contain" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">HCM UTE RTIC</h4>
                      <p className="text-sm text-gray-600">“Beyond limits, into innovation”</p>
                    </div>
                  </div>

                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start">
                      <span className="mt-1 mr-2 text-green-600"><FaCheckCircle size={12} /></span>
                      <span className="text-gray-700">Mạng lưới mentor – thành viên gắn kết, học hỏi hai chiều.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mt-1 mr-2 text-green-600"><FaCheckCircle size={12} /></span>
                      <span className="text-gray-700">Workshop định kỳ về AI/DS, Web, DevOps, IoT...</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mt-1 mr-2 text-green-600"><FaCheckCircle size={12} /></span>
                      <span className="text-gray-700">Dự án mở – khuyến khích đóng góp và chia sẻ.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mt-1 mr-2 text-green-600"><FaCheckCircle size={12} /></span>
                      <span className="text-gray-700">Kết nối FIT và các CLB trong khoa để cùng phát triển.</span>
                    </li>
                  </ul>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <a href="/chatbot" className="text-center px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors">Trò chuyện với AI</a>
                    <a href="https://www.facebook.com/hcmute.rtic" target="_blank" rel="noopener noreferrer" className="text-center px-4 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:border-gray-400">Tham gia cộng đồng</a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* FIT – Khoa CNTT Section */}
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
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxMTExMTEiIGZpbGwtb3BhY2l0eT0iMC4zIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-yellow-500/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"></div>

        <div className="container mx-auto px-6 relative z-10 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mr-4">
                  <img src="/only-logo@4x.png" alt="RTIC" className="w-8 h-8 object-contain" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-300 to-blue-400 bg-clip-text text-transparent">
                    Trợ lý ảo RTIC
                  </h3>
                  <p className="text-sm text-gray-400">HCM UTE Research on Technology and Innovation Club</p>
                </div>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
                Trí tuệ nhân tạo cho thế hệ sinh viên tương lai. Kết nối, học hỏi và phát triển cùng cộng đồng công nghệ RTIC.
              </p>
              <div className="flex space-x-4">
                <a 
                  href="https://www.facebook.com/hcmute.rtic" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-blue-500 transition-all duration-300 group border border-white/20"
                >
                  <FaFacebookSquare className="text-lg group-hover:text-white text-gray-400" />
                </a>
                <a 
                  href="https://github.com/HCMUTE-RTIC" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-gray-700 transition-all duration-300 group border border-white/20"
                >
                  <FaGithub className="text-lg group-hover:text-white text-gray-400" />
                </a>
                <a 
                  href="https://hcmutertic.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-green-500 transition-all duration-300 group border border-white/20"
                >
                  <FaGlobe className="text-lg group-hover:text-white text-gray-400" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Liên kết nhanh</h4>
              <ul className="space-y-3">
                <li>
                  <a href="/chatbot" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                    <FaRobot className="mr-2 text-sm group-hover:text-yellow-400" />
                    Trò chuyện với AI
                  </a>
                </li>
                <li>
                  <a href="https://www.facebook.com/hcmute.rtic" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                    <FaFacebookSquare className="mr-2 text-sm group-hover:text-blue-400" />
                    Facebook RTIC
                  </a>
                </li>
                <li>
                  <a href="https://hcmutertic.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                    <FaGlobe className="mr-2 text-sm group-hover:text-green-400" />
                    Website RTIC
                  </a>
                </li>
                <li>
                  <a href="mailto:hcmute.rtic@gmail.com" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
                    <FaEnvelope className="mr-2 text-sm group-hover:text-red-400" />
                    Liên hệ email
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Thông tin liên hệ</h4>
              <div className="space-y-4">
                <div className="flex items-start">
                  <FaUniversity className="mt-1 mr-3 text-yellow-400" />
                  <div>
                    <p className="text-gray-300 text-sm font-medium">Khoa CNTT - HCMUTE</p>
                    <p className="text-gray-400 text-xs">Trường Đại học Sư phạm Kỹ thuật TP.HCM</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaEnvelope className="mt-1 mr-3 text-blue-400" />
                  <div>
                    <p className="text-gray-300 text-sm font-medium">Email</p>
                    <p className="text-gray-400 text-xs">rtic@hcmute.fit</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaGlobe className="mt-1 mr-3 text-green-400" />
                  <div>
                    <p className="text-gray-300 text-sm font-medium">Website</p>
                    <p className="text-gray-400 text-xs">hcmutertic.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-center md:text-left">
                <p className="text-gray-400 text-sm">
                  © {new Date().getFullYear()} <span className="font-semibold text-white">HCM UTE Research on Technology and Innovation Club</span>. All rights reserved.
                </p>
              </div>
                             <div className="flex items-center space-x-6 text-sm">
                 <span className="text-gray-400">Developed with ❤️ by</span>
                 <span className="font-semibold text-yellow-400">RTIC Team</span>
               </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage; 