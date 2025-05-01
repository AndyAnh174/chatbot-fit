import { Link } from 'react-router-dom';
import { FaComment, FaLightbulb, FaBrain, FaUserGraduate, FaUniversity, FaUsers } from 'react-icons/fa';

const HomePage = () => {
  // Màu sắc DSC HCMUTE
  const colors = {
    orangePrimary: '#F4B400',
    redPrimary: '#DB4437',
    bluePrimary: '#4285F4',
    greenPrimary: '#0F9D58',
    navyBlue: '#1A2A48'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-gray-800 to-gray-900 py-20">
        <div className="absolute inset-0 bg-opacity-50 bg-black"></div>
        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            <span className="block">Trợ lý hỗ trợ sinh viên HCMUTE - FIT</span>
            <span className="block text-2xl md:text-3xl lg:text-4xl mt-3 font-normal">
              Hỗ trợ sinh viên giải đáp thắc mắc về khoa công nghệ thông tin
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-4xl mx-auto">
            Trợ lý thông minh được phát triển bởi <span style={{ color: colors.orangePrimary }}>HCMUTE Developer Student Club</span>, 
            được đào tạo với dữ liệu chuyên biệt về khoa công nghệ thông tin thuộc trường Đại học Sư phạm Kỹ thuật TP.HCM, 
            giúp sinh viên và giảng viên tìm kiếm thông tin nhanh chóng và chính xác.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              to="/chat" 
              className="py-3 px-8 text-lg font-medium rounded-full bg-white text-gray-900 hover:bg-gray-100 transition duration-300 shadow-lg"
            >
              Bắt đầu trò chuyện
            </Link>
            <Link 
              to="/about" 
              className="py-3 px-8 text-lg font-medium rounded-full border-2 border-white text-white hover:bg-white hover:text-gray-900 transition duration-300"
            >
              Tìm hiểu thêm
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.navyBlue }}>
              Tính năng nổi bật
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Khám phá những tính năng độc đáo giúp trợ lý hỗ trợ sinh viên khoa công nghệ thông tin trở thành trợ lý hoàn hảo cho bạn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-gray-100">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto" style={{ backgroundColor: colors.bluePrimary }}>
                <FaBrain className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center" style={{ color: colors.navyBlue }}>
                Trả lời thông minh
              </h3>
              <p className="text-gray-600 text-center">
                Được đào tạo với mô hình ngôn ngữ tiên tiến, chatbot hiểu và trả lời câu hỏi của bạn một cách chính xác và tự nhiên.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-gray-100">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto" style={{ backgroundColor: colors.redPrimary }}>
                <FaLightbulb className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center" style={{ color: colors.navyBlue }}>
                Luôn cập nhật
              </h3>
              <p className="text-gray-600 text-center">
                Liên tục được cập nhật với thông tin mới nhất về khoa công nghệ thông tin, đảm bảo bạn luôn nhận được thông tin chính xác và cập nhật nhất.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-gray-100">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto" style={{ backgroundColor: colors.greenPrimary }}>
                <FaUserGraduate className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center" style={{ color: colors.navyBlue }}>
                Hỗ trợ học tập
              </h3>
              <p className="text-gray-600 text-center">
                Giúp sinh viên tìm kiếm thông tin về môn học, ngành đào tạo, giáo viên và nhiều thông tin hữu ích khác một cách nhanh chóng.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: colors.navyBlue }}>
            Sẵn sàng trải nghiệm?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Hãy bắt đầu trò chuyện với trợ lý AI của chúng tôi ngay hôm nay và khám phá cách nó có thể hỗ trợ bạn trong hành trình học tập tại khoa công nghệ thông tin.
          </p>
          <Link 
            to="/chat" 
            className="py-3 px-8 text-lg font-medium rounded-full text-white transition duration-300 shadow-lg"
            style={{ backgroundColor: colors.orangePrimary }}
          >
            <FaComment className="inline mr-2" />
            Trò chuyện ngay
          </Link>
        </div>
      </div>

      {/* About Us Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <div className="flex items-center mb-4">
                <FaUniversity className="text-3xl mr-3" style={{ color: colors.bluePrimary }} />
                <h2 className="text-3xl font-bold" style={{ color: colors.navyBlue }}>
                  Developer Student Club
                </h2>
              </div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: colors.orangePrimary }}>
                Khoa Công nghệ thông tin, trường Đại học Sư phạm Kỹ thuật TP.HCM
              </h3>
              <p className="text-gray-600 mb-6">
                Developer Student Club (DSC) là một cộng đồng học tập của sinh viên thuộc khoa, trường Đại học Sư phạm Kỹ thuật TP.HCM, 
                nơi sinh viên phát triển kỹ năng, ứng dụng, và giải pháp kỹ thuật để giải quyết các thách thức thực tế.
              </p>
              <p className="text-gray-600">
                Dự án trợ lý hỗ trợ sinh viên giải đáp thắc mắc về khoa công nghệ thông tin là một trong những dự án tiêu biểu của HCMUTE Developer Student Club, được phát triển nhằm hỗ trợ 
                cộng đồng sinh viên và giảng viên ngoài ra còn hỗ trợ học sinh hoặc phụ huynh muốn tìm hiểu đến khoa công nghệ thông tin của trường Đại học Sư phạm Kỹ thuật TP.HCM.
              </p>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl opacity-20 transform rotate-6"></div>
                <div className="relative bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                  <div className="flex items-center mb-6">
                    <FaUsers className="text-2xl mr-3" style={{ color: colors.redPrimary }} />
                    <h3 className="text-xl font-semibold" style={{ color: colors.navyBlue }}>
                      Tham gia cùng chúng tôi
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-6">
                    HCMUTE Developer Student Club luôn chào đón những sinh viên có đam mê với công nghệ và mong muốn phát triển các kỹ năng lập trình, 
                    thiết kế và quản lý dự án.
                  </p>
                  <div className="flex justify-center">
                    <a 
                      href="https://www.facebook.com/hcmute.dsc" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="py-2 px-6 rounded-full text-white font-medium transition duration-300"
                      style={{ backgroundColor: colors.greenPrimary }}
                    >
                      Tìm hiểu thêm về DSC
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <p>© {new Date().getFullYear()} Trợ lý hỗ trợ sinh viên giải đáp thắc mắc về khoa công nghệ thông tin - Một dự án của HCM UTE Developer Student Club </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 