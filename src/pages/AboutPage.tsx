import { 
  FaCog, 
  FaLightbulb, 
  FaCode, 
  FaRocket, 
  FaGithub, 
  FaFacebookSquare,
  FaUniversity,
  FaUsers,
  FaBookOpen,
  FaGraduationCap,
  FaEnvelope,
  FaGlobe,
  FaShieldAlt,
  FaCheckCircle,
  FaQuoteLeft
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import logoCNTT from '../assets/logo-cntt2021.png';



const AboutPage = () => {
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



  const developmentSteps = [
    {
      icon: FaLightbulb,
      title: 'Nghiên cứu & Phân tích',
      description: 'Phân tích nhu cầu thực tế của sinh viên và xác định yêu cầu dự án',
      color: 'bg-blue-500'
    },
    {
      icon: FaCode,
      title: 'Xây dựng Prototype',
      description: 'Phát triển phiên bản thử nghiệm và thiết kế kiến trúc hệ thống',
      color: 'bg-green-500'
    },
    {
      icon: FaCog,
      title: 'Huấn luyện AI',
      description: 'Huấn luyện mô hình AI với dữ liệu chuyên biệt của Khoa CNTT',
      color: 'bg-purple-500'
    },
    {
      icon: FaRocket,
      title: 'Triển khai & Cải tiến',
      description: 'Triển khai hệ thống và liên tục cải tiến dựa trên phản hồi người dùng',
      color: 'bg-red-500'
    }
  ];

  return (
    <div className="relative w-full min-h-screen bg-white">
      <div className="absolute inset-0 overflow-y-auto overflow-x-hidden">
        {/* Beta Notification */}
       

        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black py-32 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzNzM3MzciIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-10"></div>
          
          {/* Floating Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute top-40 right-32 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
            <div className="absolute bottom-32 left-32 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl animate-pulse delay-2000"></div>
            <div className="absolute bottom-20 right-20 w-36 h-36 bg-pink-500/10 rounded-full blur-2xl animate-pulse delay-3000"></div>
          </div>
          
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-5xl mx-auto text-center"
            >
              {/* Badge */}
              <motion.div variants={fadeInUp} className="mb-8">
                <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 mb-8">
                  <FaUniversity className="text-blue-400 mr-3 text-xl" />
                  <span className="text-white font-semibold">Dự án AI tiên phong</span>
                </div>
              </motion.div>

              {/* Main Title */}
              <motion.div variants={fadeInUp} className="mb-12">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                  RTIC Chatbot
                  <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    Trí tuệ nhân tạo
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto">
                  Được phát triển bởi{' '}
                  <span className="font-bold text-white">HCM UTE Research on Technology and Innovation Club</span>{' '}
                  với sự hỗ trợ của{' '}
                  <span className="font-bold text-white">CLB An toàn thông tin</span>{' '}
                  - Nơi công nghệ gặp gỡ sự đổi mới
                </p>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-6 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                >
                  <FaRocket className="inline mr-2" />
                  Khám phá ngay
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="px-8 py-4 bg-white/10 backdrop-blur-lg text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <FaBookOpen className="inline mr-2" />
                  Tìm hiểu thêm
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Project Overview */}
        <div className="py-32 bg-white relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-cyan-100 to-pink-100 rounded-full blur-3xl opacity-30 translate-x-1/2 translate-y-1/2"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="max-w-7xl mx-auto"
            >
              {/* Header */}
              <motion.div variants={fadeInUp} className="text-center mb-20">
                <div className="inline-flex items-center px-6 py-3 bg-blue-50 rounded-full border border-blue-200 mb-8">
                  <FaQuoteLeft className="text-blue-500 mr-3 text-xl" />
                  <span className="text-gray-800 font-semibold">Về dự án</span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8">
                  RTIC Chatbot
                 
                </h2>
                <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  Ứng dụng công nghệ AI tiên tiến để hỗ trợ tân sinh viên tìm hiểu về RTIC và khoa CNTT
                </p>
              </motion.div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 items-center">
                {/* Left Content */}
                <motion.div variants={fadeInUp}>
                  <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-10 border border-gray-200/50 shadow-2xl">
                    <div className="mb-8">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6">
                        <FaLightbulb className="text-white text-2xl" />
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-6">
                        Tầm nhìn dự án
                      </h3>
                    </div>
                    
                    <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                      <p>
                        Dự án RTIC Chatbot ra đời với sứ mệnh hỗ trợ tân sinh viên tìm hiểu về RTIC 
                        và khoa Công nghệ Thông tin một cách dễ dàng và hiệu quả.
                      </p>
                      <p>
                        Chúng tôi tin rằng công nghệ AI không chỉ là công cụ, mà là cầu nối 
                        giúp tân sinh viên tiếp cận thông tin về CLB và định hướng học tập một cách nhanh chóng.
                      </p>
                      <div className="flex items-center pt-4">
                        <FaCheckCircle className="text-green-500 mr-3 text-xl" />
                        <span className="font-semibold text-gray-800">Cam kết chất lượng và đổi mới liên tục</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Right Content - Enhanced Stats */}
                <motion.div variants={fadeInUp}>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 rounded-3xl text-white shadow-xl hover:shadow-blue-500/25 transition-all duration-300">
                      <FaUsers className="text-4xl mb-4 opacity-80" />
                      <div className="text-4xl font-bold mb-2">100+</div>
                      <div className="text-blue-100">Người dùng hoạt động</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-8 rounded-3xl text-white shadow-xl hover:shadow-green-500/25 transition-all duration-300">
                      <FaBookOpen className="text-4xl mb-4 opacity-80" />
                      <div className="text-4xl font-bold mb-2">1500+</div>
                      <div className="text-green-100">Câu hỏi được giải đáp</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-8 rounded-3xl text-white shadow-xl hover:shadow-purple-500/25 transition-all duration-300">
                      <FaGraduationCap className="text-4xl mb-4 opacity-80" />
                      <div className="text-4xl font-bold mb-2">98%</div>
                      <div className="text-purple-100">Độ hài lòng</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-orange-500 to-red-500 p-8 rounded-3xl text-white shadow-xl hover:shadow-orange-500/25 transition-all duration-300">
                      <FaCog className="text-4xl mb-4 opacity-80" />
                      <div className="text-4xl font-bold mb-2">24/7</div>
                      <div className="text-orange-100">Hỗ trợ liên tục</div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="mt-8 bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 shadow-xl">
                    <h4 className="text-xl font-bold text-gray-900 mb-4">Thành tựu nổi bật</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">Top 1</div>
                        <div className="text-sm text-gray-600">Dự án chatbot AI của RTIC</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">A+</div>
                        <div className="text-sm text-gray-600">Bảo mật</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">99.9%</div>
                        <div className="text-sm text-gray-600">Uptime</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Development Process */}
        <div className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzNzM3MzciIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-10"></div>
          
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
            <div className="absolute bottom-20 left-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-xl animate-pulse delay-2000"></div>
            <div className="absolute bottom-40 right-10 w-28 h-28 bg-pink-500/10 rounded-full blur-xl animate-pulse delay-3000"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="max-w-7xl mx-auto"
            >
              {/* Header */}
              <motion.div variants={fadeInUp} className="text-center mb-20">
                <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 mb-8">
                  <FaCog className="text-blue-400 mr-3 text-xl" />
                  <span className="text-white font-semibold">Quy trình phát triển</span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8">
                  Phương pháp luận
                  
                </h2>
                <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                  Dự án được thực hiện theo tiêu chuẩn quốc tế với quy trình DevOps hiện đại
                </p>
              </motion.div>

              {/* Timeline Container */}
              <div className="relative">
                {/* Central Timeline Line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-cyan-500 rounded-full hidden lg:block"></div>
                
                {/* Timeline Dots */}
                <div className="absolute left-1/2 transform -translate-x-1/2 space-y-32 hidden lg:block">
                  {developmentSteps.map((_, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: index * 0.2 }}
                      className="w-6 h-6 bg-white rounded-full border-4 border-blue-500 shadow-lg shadow-blue-500/50"
                    ></motion.div>
                  ))}
                </div>

                {/* Process Steps */}
                <div className="space-y-32">
                  {developmentSteps.map((step, index) => (
                    <motion.div
                      key={index}
                      variants={fadeInUp}
                      className={`flex items-center ${
                        index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                      } flex-col lg:space-x-16 space-y-8 lg:space-y-0`}
                    >
                      {/* Content Card */}
                      <div className="lg:w-1/2 w-full">
                        <motion.div
                          whileHover={{ scale: 1.02, y: -5 }}
                          className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl group hover:shadow-blue-500/20 transition-all duration-500"
                        >
                          {/* Step Number */}
                          <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                              <span className="text-white font-bold text-lg">0{index + 1}</span>
                            </div>
                            <div className="flex-1 h-px bg-gradient-to-r from-blue-500/50 to-transparent"></div>
                          </div>

                          {/* Icon */}
                          <div className="mb-6">
                            <div className={`w-20 h-20 ${step.color} rounded-3xl flex items-center justify-center mx-auto lg:mx-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                              <step.icon className="text-white text-3xl" />
                            </div>
                          </div>

                          {/* Content */}
                          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors duration-300">
                            {step.title}
                          </h3>
                          <p className="text-gray-300 text-lg leading-relaxed mb-6">
                            {step.description}
                          </p>

                          {/* Tech Stack Indicator */}
                          <div className="flex flex-wrap gap-2">
                            {index === 0 && (
                              <>
                                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium">Research</span>
                                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium">Analysis</span>
                              </>
                            )}
                            {index === 1 && (
                              <>
                                <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-medium">React</span>
                                <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-medium">TypeScript</span>
                                <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-medium">FastAPI</span>
                              </>
                            )}
                            {index === 2 && (
                              <>
                                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium">Machine Learning</span>
                                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium">NLP</span>
                                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium">Python</span>
                              </>
                            )}
                            {index === 3 && (
                              <>
                                <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm font-medium">Docker</span>
                                <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm font-medium">CI/CD</span>
                                <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm font-medium">Cloud</span>
                              </>
                            )}
                          </div>
                        </motion.div>
                      </div>

                      {/* Visual Element */}
                      <div className="lg:w-1/2 w-full flex justify-center">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="relative"
                        >
                          {/* Animated Circle */}
                          <div className="w-64 h-64 relative">
                            <div className={`absolute inset-0 ${step.color} rounded-full opacity-20 animate-ping`}></div>
                            <div className={`absolute inset-4 ${step.color} rounded-full opacity-40`}></div>
                            <div className={`absolute inset-8 ${step.color} rounded-full opacity-60 flex items-center justify-center`}>
                              <step.icon className="text-white text-5xl" />
                            </div>
                          </div>
                          
                          {/* Floating Elements */}
                          <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce delay-1000"></div>
                          <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-pink-400 rounded-full animate-bounce delay-2000"></div>
                          <div className="absolute top-1/2 -left-8 w-4 h-4 bg-cyan-400 rounded-full animate-bounce delay-3000"></div>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Success Metrics */}
              <motion.div variants={fadeInUp} className="mt-20">
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-4">Kết quả đạt được</h3>
                    <p className="text-gray-300">Những con số ấn tượng từ quy trình phát triển chuyên nghiệp</p>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center p-4">
                      <div className="text-3xl font-bold text-blue-400 mb-2">100%</div>
                      <div className="text-gray-300 text-sm">Code Coverage</div>
                    </div>
                    <div className="text-center p-4">
                      <div className="text-3xl font-bold text-green-400 mb-2">99.9%</div>
                      <div className="text-gray-300 text-sm">Uptime</div>
                    </div>
                    <div className="text-center p-4">
                      <div className="text-3xl font-bold text-purple-400 mb-2">50ms</div>
                      <div className="text-gray-300 text-sm">Response Time</div>
                    </div>
                    <div className="text-center p-4">
                      <div className="text-3xl font-bold text-yellow-400 mb-2">A+</div>
                      <div className="text-gray-300 text-sm">Security Grade</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Team Section */}
       

        {/* Security Partner Section */}
        <div className="py-32 bg-white relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-r from-green-100 to-blue-100 rounded-full blur-3xl opacity-40"></div>
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-purple-100 to-red-100 rounded-full blur-3xl opacity-40"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="max-w-6xl mx-auto"
            >
              {/* Header */}
              <motion.div variants={fadeInUp} className="text-center mb-20">
                <div className="inline-flex items-center px-6 py-3 bg-green-50 rounded-full border border-green-200 mb-8">
                  <FaShieldAlt className="text-green-500 mr-3 text-xl" />
                  <span className="text-gray-800 font-semibold">Bảo mật & An toàn thông tin</span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8">
                  <span className="block">CLB An toàn thông tin</span> 
                  <span className="block text-green-600">Pentest & Bảo vệ</span>
                </h2>
                <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  Đối tác chiến lược đảm bảo an toàn và bảo mật cho RTIC Chatbot với công nghệ pentest tiên tiến
                </p>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 border border-gray-200/50 shadow-2xl hover:shadow-3xl transition-all duration-500 group">
                  {/* Security Features */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                      <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 group-hover:text-green-600 transition-colors duration-300">
                        Bảo vệ toàn diện
                      </h3>
                      <p className="text-lg text-gray-600 leading-relaxed mb-8">
                        CLB An toàn thông tin đã thực hiện các biện pháp bảo mật nghiêm ngặt để đảm bảo 
                        RTIC Chatbot hoạt động an toàn và bảo vệ thông tin người dùng.
                      </p>
                      
                      {/* Security Features List */}
                      <div className="space-y-4">
                        <div className="flex items-center p-4 bg-green-50 rounded-xl">
                          <FaShieldAlt className="text-green-500 mr-4 text-xl" />
                          <div>
                            <h4 className="font-bold text-gray-900">Penetration Testing</h4>
                            <p className="text-gray-600 text-sm">Kiểm tra lỗ hổng bảo mật định kỳ</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center p-4 bg-blue-50 rounded-xl">
                          <FaShieldAlt className="text-blue-500 mr-4 text-xl" />
                          <div>
                            <h4 className="font-bold text-gray-900">Mã hóa dữ liệu</h4>
                            <p className="text-gray-600 text-sm">Bảo vệ thông tin người dùng</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center p-4 bg-purple-50 rounded-xl">
                          <FaShieldAlt className="text-purple-500 mr-4 text-xl" />
                          <div>
                            <h4 className="font-bold text-gray-900">Giám sát 24/7</h4>
                            <p className="text-gray-600 text-sm">Theo dõi hoạt động liên tục</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="bg-gradient-to-br from-green-500 to-blue-600 p-8 rounded-3xl text-white shadow-2xl">
                        <FaShieldAlt className="text-6xl mx-auto mb-6" />
                        <h4 className="text-2xl font-bold mb-4">Bảo mật cấp độ doanh nghiệp</h4>
                        <p className="text-green-100 mb-6">
                          RTIC Chatbot được bảo vệ bởi các chuyên gia an toàn thông tin 
                          với kinh nghiệm pentest và bảo mật ứng dụng web.
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold">100%</div>
                            <div className="text-sm text-green-100">An toàn</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold">24/7</div>
                            <div className="text-sm text-green-100">Giám sát</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Partner Section */}
        <div className="py-32 bg-gray-50 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full blur-3xl opacity-40"></div>
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-cyan-100 to-pink-100 rounded-full blur-3xl opacity-40"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="max-w-6xl mx-auto"
            >
              {/* Header */}
              <motion.div variants={fadeInUp} className="text-center mb-20">
                <div className="inline-flex items-center px-6 py-3 bg-blue-50 rounded-full border border-blue-200 mb-8">
                  <FaGlobe className="text-blue-500 mr-3 text-xl" />
                  <span className="text-gray-800 font-semibold">Đối tác & Nhà tài trợ</span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8">
                  <span className="block">Hợp tác Đồng hành</span> 
                 
                </h2>
                <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  Cảm ơn sự hỗ trợ và đồng hành của các đối tác trong hành trình phát triển
                </p>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 border border-gray-200/50 shadow-2xl hover:shadow-3xl transition-all duration-500 group">
                  {/* Logo Section */}
                  <div className="text-center mb-10">
                    <div className="inline-block p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl group-hover:scale-105 transition-transform duration-500">
                      <img 
                        src={logoCNTT} 
                        alt="Khoa CNTT - HCMUTE" 
                        className="max-h-32 mx-auto drop-shadow-lg"
                      />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="text-center">
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 group-hover:text-blue-600 transition-colors duration-300">
                      Khoa Công nghệ Thông tin - HCMUTE
                    </h3>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
                      Đối tác chính cung cấp dữ liệu, tài nguyên, kiến thức chuyên môn và định hướng phát triển dự án 
                      phù hợp với nhu cầu thực tế của sinh viên và giảng viên.
                    </p>
                    
                    {/* Partnership Benefits */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                      <div className="p-6 bg-blue-50 rounded-2xl">
                        <FaBookOpen className="text-3xl text-blue-500 mx-auto mb-4" />
                        <h4 className="font-bold text-gray-900 mb-2">Cung cấp dữ liệu</h4>
                        <p className="text-gray-600 text-sm">Thông tin chính thức và cập nhật</p>
                      </div>
                      <div className="p-6 bg-green-50 rounded-2xl">
                        <FaUsers className="text-3xl text-green-500 mx-auto mb-4" />
                        <h4 className="font-bold text-gray-900 mb-2">Hỗ trợ kỹ thuật</h4>
                        <p className="text-gray-600 text-sm">Tư vấn chuyên môn và định hướng</p>
                      </div>
                      <div className="p-6 bg-purple-50 rounded-2xl">
                        <FaRocket className="text-3xl text-purple-500 mx-auto mb-4" />
                        <h4 className="font-bold text-gray-900 mb-2">Triển khai</h4>
                        <p className="text-gray-600 text-sm">Hỗ trợ đưa sản phẩm vào sử dụng</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="py-32 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzNzM3MzciIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-10"></div>
          
          {/* Floating Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl animate-pulse delay-2000"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="max-w-6xl mx-auto"
            >
              {/* Header */}
              <motion.div variants={fadeInUp} className="text-center mb-20">
                <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 mb-8">
                  <FaEnvelope className="text-blue-400 mr-3 text-xl" />
                  <span className="text-white font-semibold">Liên hệ với chúng tôi</span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8">
                  Kết nối Cùng chúng tôi
                  <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    
                  </span>
                </h2>
                <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                  Có câu hỏi hoặc muốn đóng góp ý kiến? Chúng tôi luôn sẵn sàng lắng nghe
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div variants={fadeInUp}>
                  <motion.div 
                    whileHover={{ y: -10, scale: 1.02 }}
                    className="bg-white/5 backdrop-blur-xl rounded-3xl p-10 text-center border border-white/10 hover:border-red-500/50 transition-all duration-500 group"
                  >
                    <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-red-500/25">
                      <FaEnvelope className="text-white text-3xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-6 group-hover:text-red-300 transition-colors duration-300">Email</h3>
                    <a 
                      href="mailto:fitadm@hcmute.edu.vn" 
                      className="text-gray-300 hover:text-white font-medium text-lg transition-colors duration-300 hover:underline"
                    >
                      fitadm@hcmute.edu.vn
                    </a>
                  </motion.div>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <motion.div 
                    whileHover={{ y: -10, scale: 1.02 }}
                    className="bg-white/5 backdrop-blur-xl rounded-3xl p-10 text-center border border-white/10 hover:border-blue-500/50 transition-all duration-500 group"
                  >
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-blue-500/25">
                      <FaFacebookSquare className="text-white text-3xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-6 group-hover:text-blue-300 transition-colors duration-300">Facebook</h3>
                    <a 
                      href="https://www.facebook.com/fithcmute" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-white font-medium text-lg transition-colors duration-300 hover:underline"
                    >
                      Fanpage Khoa CNTT
                    </a>
                  </motion.div>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <motion.div 
                    whileHover={{ y: -10, scale: 1.02 }}
                    className="bg-white/5 backdrop-blur-xl rounded-3xl p-10 text-center border border-white/10 hover:border-green-500/50 transition-all duration-500 group"
                  >
                    <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-green-500/25">
                      <FaGlobe className="text-white text-3xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-6 group-hover:text-green-300 transition-colors duration-300">Website</h3>
                    <a 
                      href="https://fit.hcmute.edu.vn" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-white font-medium text-lg transition-colors duration-300 hover:underline"
                    >
                      fit.hcmute.edu.vn
                    </a>
                  </motion.div>
                </motion.div>
              </div>

              {/* CTA Section */}
              <motion.div variants={fadeInUp} className="mt-20 text-center">
             
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-black text-white py-16 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxMTExMTEiIGZpbGwtb3BhY2l0eT0iMC4zIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center">
              {/* Logo/Brand */}
              <div className="mb-8">
                <h3 className="text-3xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    RTIC Chatbot
                  </span>
                </h3>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Trí tuệ nhân tạo hỗ trợ tân sinh viên khám phá RTIC
                </p>
              </div>

              {/* Social Links */}
              <div className="flex justify-center space-x-6 mb-8">
                <a 
                  href="https://www.facebook.com/hcmute.ptic" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center hover:bg-blue-500 transition-all duration-300 group"
                >
                  <FaFacebookSquare className="text-xl group-hover:text-white text-gray-400" />
                </a>
                <a 
                  href="http://github.com/HCMUTE-PTIC" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center hover:bg-gray-700 transition-all duration-300 group"
                >
                  <FaGithub className="text-xl group-hover:text-white text-gray-400" />
                </a>
                <a 
                  href="https://fit.hcmute.edu.vn" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center hover:bg-green-500 transition-all duration-300 group"
                >
                  <FaGlobe className="text-xl group-hover:text-white text-gray-400" />
                </a>
              </div>

              {/* Copyright */}
              <div className="border-t border-gray-800 pt-8">
                <p className="text-lg text-gray-300 mb-2">
                  © {new Date().getFullYear()} <span className="font-semibold text-white">RTIC Chatbot</span> - HCM UTE Research on Technology and Innovation Club
                </p>
                <p className="text-gray-400">
                  Trường Đại học Sư phạm Kỹ thuật TP.HCM 
                </p>
                <div className="mt-4 text-sm text-gray-500">
                 Developed by RTIC Team với sự hỗ trợ của CLB An toàn thông tin
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AboutPage; 