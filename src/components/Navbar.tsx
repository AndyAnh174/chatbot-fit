import { useState, useEffect } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { FaBars, FaTimes, FaRobot, FaHome, FaInfoCircle } from 'react-icons/fa';
import logoCNTT from '../assets/logo-cntt2021.png';

export function AppNavbar({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
          <div className="flex items-center justify-between h-14">
            {/* Left Side - Logos & Brand Text */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center group">
                <div className="flex items-center space-x-3">
                  {/* Logo FIT */}
                  <div className="relative">
                    <img 
                      src="./LogoDoanHoi.png" 
                      alt="FIT HCMUTE Logo" 
                      className="h-8 w-auto transform group-hover:scale-105 transition-all duration-300 drop-shadow-sm" 
                    />
                  </div>
                  
                  {/* Divider */}
                  <div className="h-5 w-px bg-gray-300"></div>
                  
                  {/* Logo PTIC */}
                  <div className="relative">
                    <img 
                      src="/PTIC.jpg" 
                      alt="PTIC Logo" 
                      className="h-8 w-auto transform group-hover:scale-105 transition-all duration-300 drop-shadow-sm rounded-md" 
                    />
                  </div>
                  
                  {/* Brand Text */}
                 
                </div>
              </Link>
            </div>
            
            {/* Right Side - Navigation Links */}
            <div className="hidden md:flex items-center space-x-4">
              <NavLink
                to="/"
                className={({ isActive }) => 
                  `relative px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center transition-all duration-300 group ${
                    isActive 
                      ? "text-gray-900" 
                      : "text-gray-600 hover:text-gray-900"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <FaHome className="mr-1.5 text-sm" />
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
                  `relative px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center transition-all duration-300 group ${
                    isActive 
                      ? "text-gray-900" 
                      : "text-gray-600 hover:text-gray-900"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <FaRobot className="mr-1.5 text-sm" />
                    <span>Chatbot</span>
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
                  `relative px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center transition-all duration-300 group ${
                    isActive 
                      ? "text-gray-900" 
                      : "text-gray-600 hover:text-gray-900"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <FaInfoCircle className="mr-1.5 text-sm" />
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
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-1.5 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                {isOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
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
              onClick={() => setIsOpen(false)}
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
              onClick={() => setIsOpen(false)}
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
              onClick={() => setIsOpen(false)}
            >
              <FaInfoCircle className="mr-3 text-lg" />
              <span>Giới thiệu</span>
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Add padding to account for fixed navbar */}
      <div className="h-14"></div>

      <main className="flex-1 bg-gray-50">
        {children || <Outlet />}
      </main>
    </div>
  );
} 