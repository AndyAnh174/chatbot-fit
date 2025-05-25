import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { FaBars, FaTimes, FaRobot, FaHome, FaInfoCircle } from 'react-icons/fa';
import logoCNTT from '../assets/logo-cntt2021.png';

export function AppNavbar({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <nav style={{ backgroundColor: 'var(--navy-blue)' }} className="shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link to="/" className="flex items-center">
                <div style={{ backgroundColor: 'var(--orange-primary)' }} className="w-8 h-8 rounded flex items-center justify-center mr-2">
                    <FaRobot className="text-white" size={18} />
                  </div>

                  <img 
                    src={logoCNTT} 
                    alt="FIT HCMUTE Logo" 
                    className="h-12 w-auto mr-2" 
                  />
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-center space-x-4">
                  <NavLink
                    to="/"
                    className={({ isActive }) => 
                      isActive 
                        ? "px-3 py-2 rounded-md text-lg font-semibold text-white bg-opacity-20 flex items-center" 
                        : "px-3 py-2 rounded-md text-lg font-semibold text-gray-300 hover:text-white hover:bg-opacity-10 flex items-center"
                    }
                    style={({ isActive }) => ({ 
                      backgroundColor: isActive ? 'var(--orange-primary)' : 'transparent'
                    })}
                  >
                    <FaHome className="mr-1" />
                    Trang chủ
                  </NavLink>
                  <NavLink
                    to="/chatbot"
                    className={({ isActive }) => 
                      isActive 
                        ? "px-3 py-2 rounded-md text-lg font-semibold text-white bg-opacity-20 flex items-center" 
                        : "px-3 py-2 rounded-md text-lg font-semibold text-gray-300 hover:text-white hover:bg-opacity-10 flex items-center"
                    }
                    style={({ isActive }) => ({ 
                      backgroundColor: isActive ? 'var(--orange-primary)' : 'transparent'
                    })}
                  >
                    <FaRobot className="mr-1" />
                    Hỏi đáp với AI
                  </NavLink>
                  <NavLink
                    to="/about"
                    className={({ isActive }) => 
                      isActive 
                        ? "px-3 py-2 rounded-md text-lg font-semibold text-white bg-opacity-20 flex items-center" 
                        : "px-3 py-2 rounded-md text-lg font-semibold text-gray-300 hover:text-white hover:bg-opacity-10 flex items-center"
                    }
                    style={({ isActive }) => ({ 
                      backgroundColor: isActive ? 'var(--orange-primary)' : 'transparent'
                    })}
                  >
                    <FaInfoCircle className="mr-1" />
                    Giới thiệu
                  </NavLink>
                </div>
              </div>
            </div>
            
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white focus:outline-none"
                style={{ backgroundColor: 'var(--orange-primary)' }}
              >
                {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink
              to="/"
              className={({ isActive }) => 
                `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'text-white' : 'text-gray-300 hover:text-white'} flex items-center`
              }
              style={({ isActive }) => ({ 
                backgroundColor: isActive ? 'var(--orange-primary)' : 'transparent'
              })}
              onClick={() => setIsOpen(false)}
            >
              <FaHome className="mr-2" />
              Trang chủ
            </NavLink>
            <NavLink
              to="/chatbot"
              className={({ isActive }) => 
                `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'text-white' : 'text-gray-300 hover:text-white'} flex items-center`
              }
              style={({ isActive }) => ({ 
                backgroundColor: isActive ? 'var(--orange-primary)' : 'transparent'
              })}
              onClick={() => setIsOpen(false)}
            >
              <FaRobot className="mr-2" />
              Hỏi đáp với AI
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) => 
                `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'text-white' : 'text-gray-300 hover:text-white'} flex items-center`
              }
              style={({ isActive }) => ({ 
                backgroundColor: isActive ? 'var(--orange-primary)' : 'transparent'
              })}
              onClick={() => setIsOpen(false)}
            >
              <FaInfoCircle className="mr-2" />
              Giới thiệu
            </NavLink>
          </div>
        </div>
      </nav>

      <main className="flex-1 bg-gray-50">
        {children || <Outlet />}
      </main>
    </div>
  );
} 