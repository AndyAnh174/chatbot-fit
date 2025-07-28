import { useState, useEffect } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { FaBars, FaTimes, FaRobot, FaHome, FaInfoCircle, FaUserShield } from 'react-icons/fa';
import logoCNTT from '../assets/logo-cntt2021.png';

export function AppNavbar({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Thêm hàm xử lý scroll lên đầu trang
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  return (
    <div className="min-h-screen flex flex-col">
      <nav 
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
            : 'bg-white/90 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link to="/" className="flex items-center group" onClick={handleScrollToTop}>
                  <div className="flex items-center space-x-4">
                    {/* Logo FIT */}
                    <div className="relative">
                      <img 
                        src={logoCNTT} 
                        alt="FIT HCMUTE Logo" 
                        className="h-12 w-auto transform group-hover:scale-105 transition-all duration-300 drop-shadow-sm" 
                      />
                    </div>
                    
                    {/* Divider */}
                    <div className="h-8 w-px bg-gray-300"></div>
                    
                    {/* Logo PTIC */}
                    <div className="relative">
                      <img 
                        src="/PTIC.jpg" 
                        alt="PTIC Logo" 
                        className="h-12 w-auto transform group-hover:scale-105 transition-all duration-300 drop-shadow-sm rounded-lg" 
                      />
                    </div>
                    
                    {/* Brand Text */}
                    <div className="hidden lg:flex flex-col">
                      <span className="text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
                        ChatBot FIT
                      </span>
                      <span className="text-sm text-gray-600 font-medium">
                        FIT HCMUTE × PTIC
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
              
              <div className="hidden md:block">
                <div className="ml-12 flex items-center space-x-8">
                  <NavLink
                    to="/"
                    className={({ isActive }) => 
                      `relative px-4 py-2 rounded-lg text-base font-semibold flex items-center transition-all duration-300 group ${
                        isActive 
                          ? "text-gray-900" 
                          : "text-gray-600 hover:text-gray-900"
                      }`
                    }
                    onClick={handleScrollToTop}
                  >
                    {({ isActive }) => (
                      <>
                        <FaHome className="mr-2 text-lg" />
                        <span>Home</span>
                        {isActive && (
                          <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gray-900 rounded-full" />
                        )}
                        {!isActive && (
                          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-900 rounded-full group-hover:w-full transition-all duration-300" />
                        )}
                      </>
                    )}
                  </NavLink>
                  
                  <NavLink
                    to="/chatbot"
                    className={({ isActive }) => 
                      `relative px-4 py-2 rounded-lg text-base font-semibold flex items-center transition-all duration-300 group ${
                        isActive 
                          ? "text-gray-900" 
                          : "text-gray-600 hover:text-gray-900"
                      }`
                    }
                    onClick={handleScrollToTop}
                  >
                    {({ isActive }) => (
                      <>
                        <FaRobot className="mr-2 text-lg" />
                        <span>FIT Chatbot</span>
                        {isActive && (
                          <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gray-900 rounded-full" />
                        )}
                        {!isActive && (
                          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-900 rounded-full group-hover:w-full transition-all duration-300" />
                        )}
                      </>
                    )}
                  </NavLink>
                  
                  <NavLink
                    to="/about"
                    className={({ isActive }) => 
                      `relative px-4 py-2 rounded-lg text-base font-semibold flex items-center transition-all duration-300 group ${
                        isActive 
                          ? "text-gray-900" 
                          : "text-gray-600 hover:text-gray-900"
                      }`
                    }
                    onClick={handleScrollToTop}
                  >
                    {({ isActive }) => (
                      <>
                        <FaInfoCircle className="mr-2 text-lg" />
                        <span>About</span>
                        {isActive && (
                          <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gray-900 rounded-full" />
                        )}
                        {!isActive && (
                          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-900 rounded-full group-hover:w-full transition-all duration-300" />
                        )}
                      </>
                    )}
                  </NavLink>
                  
                  <NavLink
                    to="/admin/login"
                    className={({ isActive }) => 
                      `relative px-4 py-2 rounded-lg text-base font-semibold flex items-center transition-all duration-300 group ${
                        isActive 
                          ? "text-gray-900" 
                          : "text-gray-600 hover:text-gray-900"
                      }`
                    }
                    onClick={handleScrollToTop}
                  >
                    {({ isActive }) => (
                      <>
                        <FaUserShield className="mr-2 text-lg" />
                        <span>Admin</span>
                        {isActive && (
                          <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gray-900 rounded-full" />
                        )}
                        {!isActive && (
                          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-900 rounded-full group-hover:w-full transition-all duration-300" />
                        )}
                      </>
                    )}
                  </NavLink>
                </div>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div 
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen 
              ? 'max-h-96 opacity-100' 
              : 'max-h-0 opacity-0'
          } overflow-hidden bg-white/95 backdrop-blur-md border-t border-gray-200`}
        >
          <div className="px-4 pt-4 pb-6 space-y-2">
            <NavLink
              to="/"
              className={({ isActive }) => 
                `block px-4 py-3 rounded-lg text-base font-medium flex items-center transition-all duration-300 ${
                  isActive 
                    ? "text-gray-900 bg-gray-100" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`
              }
              onClick={() => {
                setIsOpen(false);
                handleScrollToTop();
              }}
            >
              <FaHome className="mr-3 text-lg" />
              <span>Trang chủ</span>
            </NavLink>
            
            <NavLink
              to="/chatbot"
              className={({ isActive }) => 
                `block px-4 py-3 rounded-lg text-base font-medium flex items-center transition-all duration-300 ${
                  isActive 
                    ? "text-gray-900 bg-gray-100" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`
              }
              onClick={() => {
                setIsOpen(false);
                handleScrollToTop();
              }}
            >
              <FaRobot className="mr-3 text-lg" />
              <span>Hỏi đáp với AI</span>
            </NavLink>
            
            <NavLink
              to="/about"
              className={({ isActive }) => 
                `block px-4 py-3 rounded-lg text-base font-medium flex items-center transition-all duration-300 ${
                  isActive 
                    ? "text-gray-900 bg-gray-100" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`
              }
              onClick={() => {
                setIsOpen(false);
                handleScrollToTop();
              }}
            >
              <FaInfoCircle className="mr-3 text-lg" />
              <span>Giới thiệu</span>
            </NavLink>
            
            <NavLink
              to="/admin/login"
              className={({ isActive }) => 
                `block px-4 py-3 rounded-lg text-base font-medium flex items-center transition-all duration-300 ${
                  isActive 
                    ? "text-gray-900 bg-gray-100" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`
              }
              onClick={() => {
                setIsOpen(false);
                handleScrollToTop();
              }}
            >
              <FaUserShield className="mr-3 text-lg" />
              <span>Admin</span>
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Add padding to account for fixed navbar */}
      <div className="h-20"></div>

      <main className="flex-1 bg-gray-50">
        {children || <Outlet />}
      </main>
    </div>
  );
} 