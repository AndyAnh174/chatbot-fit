import { FaCog, FaLightbulb, FaCode, FaRocket, FaGithub, FaFacebookSquare  } from 'react-icons/fa';
import logoDSC from '../assets/logo_dsc.png';
import logoCNTT from '../assets/logo-cntt2021.png';
import VA from '../assets/logo-phattrien/VA.jpg';
import QA from '../assets/logo-phattrien/QA.jpg';
import Quan from '../assets/logo-phattrien/Quan.jpg';
import hung from '../assets/logo-phattrien/hung.jpg';


const AboutPage = () => {
  // Màu sắc DSC HCMUTE
  const colors = {
    orangePrimary: '#F4B400',
    redPrimary: '#DB4437',
    bluePrimary: '#4285F4',
    greenPrimary: '#0F9D58',
    navyBlue: '#1A2A48'
  };

  // Đội ngũ phát triển
  const teamMembers = [
    {
      name: 'Hồ Việt Anh',
      role: 'Trưởng nhóm & Full-stack Developer',
      image: VA,
      github: 'https://github.com/AndyAnh174',
      facebook: 'https://www.facebook.com/andy.anh17405'
    },
    {
      name: 'Nguyễn Đăng Quốc Anh',
      role: 'UI/UX Designer',
      image: QA,
      github: 'https://github.com/Quocanh1508',
      facebook: 'https://www.facebook.com/quocanh.nguyendang.35'
    },
    {
      name: 'Phạm Minh Quân',
      role: 'Front-end Developer',
      image: Quan,
      github: 'https://github.com/Quan-min211',
      facebook: 'https://www.facebook.com/profile.php?id=100037351623134'
    },
    {
      name: 'Đỗ Kiến Hưng',
      role: 'Data Engineer',
      image: hung,
      github: 'https://github.com/darktheDE',
      facebook: 'https://www.facebook.com/dkh1105'
    }
  ];

  // Nhà tài trợ

  return (
    <div className="min-h-screen">
      {/* Banner */}
      <div className="relative bg-gradient-to-r from-gray-800 to-gray-900 py-16">
        <div className="absolute inset-0 bg-opacity-50 bg-black"></div>
        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Về dự án của chúng tôi</h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto">
            Dự án được phát triển bởi Developer Student Club tại Đại học Sư phạm Kỹ thuật TP.HCM
          </p>
        </div>
      </div>

      {/* Giới thiệu dự án */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row items-start">
            <div className="md:w-1/3 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-6" style={{ color: colors.navyBlue }}>Dự án Chatbot AI HCMUTE</h2>
              <div className="h-1 w-20 mb-6" style={{ backgroundColor: colors.orangePrimary }}></div>
              <p className="text-gray-600 mb-4">
                Trợ lý hỗ trợ sinh viên giải đáp thắc mắc về khoa công nghệ thông tin là một dự án được phát triển nhằm ứng dụng công nghệ trí tuệ nhân tạo vào việc hỗ trợ
                học sinh, sinh viên, giảng viên và các bên liên quan trong việc tìm kiếm thông tin và giải đáp thắc mắc về trường
                Đại học Sư phạm Kỹ thuật TP.HCM.
              </p>
              <p className="text-gray-600">
                Dự án này được khởi xướng và phát triển bởi HCMUTE Developer Student Club, với sự hỗ trợ từ Khoa Công nghệ 
                Thông tin và các đơn vị liên quan của trường.
              </p>
            </div>
            <div className="md:w-2/3 md:pl-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4" style={{ color: colors.navyBlue }}>Công nghệ sử dụng</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <div className="mr-3 mt-1">
                        <FaCog style={{ color: colors.redPrimary }} />
                      </div>
                      <p>Nền tảng AI hiện đại, tích hợp mô hình xử lý ngôn ngữ tự nhiên tiên tiến</p>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-3 mt-1">
                        <FaCog style={{ color: colors.redPrimary }} />
                      </div>
                      <p>Hệ thống truy xuất thông tin nâng cao, cho phép cung cấp thông tin chính xác và cập nhật</p>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-3 mt-1">
                        <FaCog style={{ color: colors.redPrimary }} />
                      </div>
                      <p>Backend sử dụng FastAPI và Python, đảm bảo hiệu suất cao và thời gian phản hồi nhanh</p>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-3 mt-1">
                        <FaCog style={{ color: colors.redPrimary }} />
                      </div>
                      <p>Frontend được xây dựng với React và Tailwind CSS, mang lại trải nghiệm người dùng hiện đại và thân thiện</p>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-3 mt-1">
                        <FaCog style={{ color: colors.redPrimary }} />
                      </div>
                      <p>Hỗ trợ đa ngôn ngữ, với trọng tâm là tiếng Việt, đảm bảo tính địa phương hóa cao</p>
                    </li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4" style={{ color: colors.navyBlue }}>Mục tiêu dự án</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <div className="mr-3 mt-1">
                        <FaLightbulb style={{ color: colors.bluePrimary }} />
                      </div>
                      <p>Xây dựng một nền tảng chatbot thông minh, có khả năng hiểu và đáp ứng các nhu cầu thực tế của người dùng</p>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-3 mt-1">
                        <FaLightbulb style={{ color: colors.bluePrimary }} />
                      </div>
                      <p>Tạo ra công cụ hỗ trợ hiệu quả cho việc tra cứu thông tin về khoa công nghệ thông tin của trường Đại học Sư phạm Kỹ thuật TP.HCM, giúp tiết kiệm thời gian và nâng cao trải nghiệm</p>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-3 mt-1">
                        <FaLightbulb style={{ color: colors.bluePrimary }} />
                      </div>
                      <p>Đóng góp vào nghiên cứu và ứng dụng AI trong đời sống thực tế, đặc biệt trong môi trường giáo dục Việt Nam</p>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-3 mt-1">
                        <FaLightbulb style={{ color: colors.bluePrimary }} />
                      </div>
                      <p>Tạo cơ hội cho sinh viên được học tập và thực hành các công nghệ tiên tiến trong môi trường dự án thực tế</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Đội ngũ phát triển */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: colors.navyBlue }}>Đội ngũ phát triển</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Dự án được phát triển bởi những thành viên tài năng và đam mê của DSC HCMUTE, dưới sự hướng dẫn của các giảng viên 
              Khoa Công nghệ Thông tin.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2"
              >
                <div className="relative">
                  {/* Overlay gradient khi hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-70 transition-opacity z-10"></div>
                  
                  {/* Ảnh thành viên với tỷ lệ cố định */}
                  <div className="w-full pb-[100%] relative overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="absolute inset-0 w-full h-full object-cover object-center"
                    />
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1" style={{ color: colors.navyBlue }}>{member.name}</h3>
                  <p className="text-gray-600 mb-4 text-sm font-medium" style={{ color: colors.redPrimary }}>{member.role}</p>
                  
                  <div className="flex justify-start space-x-4 mt-4">
                    <a 
                      href={member.github} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-2 rounded-full hover:bg-gray-100 transition-all duration-300"
                      style={{ color: colors.navyBlue }}
                    >
                      <FaGithub size={20} />
                    </a>
                    <a 
                      href={member.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-2 rounded-full hover:bg-gray-100 transition-all duration-300"
                      style={{ color: colors.bluePrimary }}
                    >
                      <FaFacebookSquare size={20} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Nhà tài trợ và đối tác */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: colors.navyBlue }}>Nhà tài trợ & Đối tác</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Chúng tôi xin chân thành cảm ơn sự hỗ trợ và đồng hành của các nhà tài trợ và đối tác đã giúp dự án này 
              trở nên khả thi.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-gray-50 rounded-lg p-8 text-center transition-all hover:shadow-md">
                <div className="h-28 flex items-center justify-center mb-6">
                  <img 
                    src={logoDSC} 
                    alt="Google Developer Student Clubs" 
                    className="max-h-full max-w-full"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-3" style={{ color: colors.navyBlue }}>Google Developer Student Clubs</h3>
                <p className="text-gray-600 mb-4">Hỗ trợ nguồn lực, đào tạo và công nghệ</p>
                <p className="text-gray-600 text-sm italic">
                  HCMUTE Developer Student Club là cộng đồng sinh viên công nghệ thông tin của trường Đại học Sư phạm Kỹ thuật TP.HCM, nhằm 
                  phát triển kỹ năng lãnh đạo, kỹ năng phát triển và giải quyết các vấn đề thực tế.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-8 text-center transition-all hover:shadow-md">
                <div className="h-28 flex items-center justify-center mb-6">
                  <img 
                    src={logoCNTT} 
                    alt="Khoa CNTT - HCMUTE" 
                    className="max-h-full max-w-full"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-3" style={{ color: colors.navyBlue }}>Khoa CNTT - HCMUTE</h3>
                <p className="text-gray-600 mb-4">Hỗ trợ về dữ liệu và tài nguyên</p>
                <p className="text-gray-600 text-sm italic">
                  Khoa Công nghệ Thông tin - trường Đại học Sư phạm Kỹ thuật TP.HCM đóng vai trò quan trọng trong việc cung cấp kiến thức chuyên môn, 
                  cơ sở vật chất và định hướng phát triển dự án phù hợp với nhu cầu thực tế.
                </p>
              </div>
            </div>
            
            <div className="text-center mt-10">
              <p className="text-gray-600">
                Chúng tôi xin chân thành cảm ơn sự hỗ trợ và đồng hành của các nhà tài trợ và đối tác đã giúp dự án này 
                trở nên khả thi.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quy trình phát triển */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: colors.navyBlue }}>Quy trình phát triển</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Dự án được phát triển theo quy trình bài bản, từ nghiên cứu đến triển khai và liên tục cải tiến.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Đường timeline dọc */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200"></div>
              
              {/* Responsive timeline cho mobile */}
              <div className="md:hidden absolute left-16 top-0 h-full w-1 bg-gray-200"></div>
              
              {/* Giai đoạn 1: Nghiên cứu & Phân tích - Bên phải */}
              <div className="relative mb-16">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 md:pr-12 mb-6 md:mb-0 text-left md:text-right order-2 md:order-1">
                    {/* Khoảng trống để cân bằng layout */}
                  </div>
                  
                  <div className="flex-shrink-0 z-10 order-1 md:order-2 mb-4 md:mb-0">
                    <div className="w-12 h-12 rounded-full bg-white border-4 border-gray-200 flex items-center justify-center mx-auto">
                      <FaLightbulb size={18} style={{ color: colors.redPrimary }} />
                    </div>
                  </div>
                  
                  <div className="md:w-1/2 md:pl-12 text-left order-3">
                    <h3 className="text-xl font-semibold mb-3" style={{ color: colors.redPrimary }}>
                      Nghiên cứu & Phân tích
                    </h3>
                    <p className="text-gray-600">
                      Giai đoạn nghiên cứu và phân tích nhu cầu thực tế của sinh viên khoa công nghệ thông tin, 
                      xác định các yêu cầu cụ thể và phạm vi của dự án.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Giai đoạn 2: Xây dựng prototype - Bên trái */}
              <div className="relative mb-16">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 md:pr-12 mb-6 md:mb-0 text-left md:text-right order-2 md:order-1">
                    <h3 className="text-xl font-semibold mb-3" style={{ color: colors.bluePrimary }}>
                      Xây dựng prototype
                    </h3>
                    <p className="text-gray-600">
                      Phát triển phiên bản prototype đầu tiên, thiết kế kiến trúc hệ thống và xây dựng các 
                      thành phần cốt lõi.
                    </p>
                  </div>
                  
                  <div className="flex-shrink-0 z-10 order-1 md:order-2 mb-4 md:mb-0">
                    <div className="w-12 h-12 rounded-full bg-white border-4 border-gray-200 flex items-center justify-center mx-auto">
                      <FaCode size={18} style={{ color: colors.bluePrimary }} />
                    </div>
                  </div>
                  
                  <div className="md:w-1/2 md:pl-12 text-left order-3">
                    {/* Khoảng trống để cân bằng layout */}
                  </div>
                </div>
              </div>
              
              {/* Giai đoạn 3: Huấn luyện AI - Bên phải */}
              <div className="relative mb-16">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 md:pr-12 mb-6 md:mb-0 text-left md:text-right order-2 md:order-1">
                    {/* Khoảng trống để cân bằng layout */}
                  </div>
                  
                  <div className="flex-shrink-0 z-10 order-1 md:order-2 mb-4 md:mb-0">
                    <div className="w-12 h-12 rounded-full bg-white border-4 border-gray-200 flex items-center justify-center mx-auto">
                      <FaCog size={18} style={{ color: colors.greenPrimary }} />
                    </div>
                  </div>
                  
                  <div className="md:w-1/2 md:pl-12 text-left order-3">
                    <h3 className="text-xl font-semibold mb-3" style={{ color: colors.greenPrimary }}>
                      Huấn luyện AI
                    </h3>
                    <p className="text-gray-600">
                      Huấn luyện mô hình AI với dữ liệu chuyên biệt về khoa công nghệ thông tin của 
                      trường Đại học Sư phạm Kỹ thuật TP.HCM, tinh chỉnh và đánh giá hiệu suất để đảm bảo 
                      chất lượng.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Giai đoạn 4: Triển khai & Cải tiến - Bên trái */}
              <div className="relative">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 md:pr-12 mb-6 md:mb-0 text-left md:text-right order-2 md:order-1">
                    <h3 className="text-xl font-semibold mb-3" style={{ color: colors.orangePrimary }}>
                      Triển khai & Cải tiến
                    </h3>
                    <p className="text-gray-600">
                      Triển khai hệ thống và liên tục cải tiến dựa trên phản hồi của người dùng, 
                      đảm bảo chất lượng và tính ổn định của hệ thống.
                    </p>
                  </div>
                  
                  <div className="flex-shrink-0 z-10 order-1 md:order-2 mb-4 md:mb-0">
                    <div className="w-12 h-12 rounded-full bg-white border-4 border-gray-200 flex items-center justify-center mx-auto">
                      <FaRocket size={18} style={{ color: colors.orangePrimary }} />
                    </div>
                  </div>
                  
                  <div className="md:w-1/2 md:pl-12 text-left order-3">
                    {/* Khoảng trống để cân bằng layout */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Liên hệ */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl font-bold mb-6" style={{ color: colors.navyBlue }}>Liên hệ với chúng tôi</h2>
          <p className="text-gray-600 mb-8 max-w-3xl mx-auto">
            Nếu bạn có câu hỏi, góp ý hoặc muốn hợp tác với dự án, vui lòng liên hệ với chúng tôi qua các kênh sau:
          </p>
          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6">
            <a 
              href="mailto:clb.dsc@student.hcmute.edu.vn" 
              className="inline-flex items-center justify-center py-3 px-6 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              Email
            </a>
            <a 
              href="https://www.facebook.com/hcmute.dsc" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center justify-center py-3 px-6 rounded-lg text-white hover:bg-blue-600"
              style={{ backgroundColor: colors.bluePrimary }}
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </a>
            <a 
              href="https://github.com/HCMUTE-DSC" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center justify-center py-3 px-6 rounded-lg text-white"
              style={{ backgroundColor: colors.navyBlue }}
            >
              <FaGithub className="mr-2" />
              GitHub
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <p>© {new Date().getFullYear()} Trợ lý hỗ trợ sinh viên giải đáp thắc mắc về khoa công nghệ thông tin của trường Đại học Sư phạm Kỹ thuật TP.HCM - Một dự án của HCMUTE Developer Student Club</p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 