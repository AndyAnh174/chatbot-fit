import { Routes, Route} from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppNavbar } from './components/Navbar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import { ChatbotPage } from './pages/ChatbotPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import './index.css'

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes with navbar */}
        <Route path="/" element={
          <AppNavbar>
            <HomePage />
          </AppNavbar>
        } />
        <Route path="/about" element={
          <AppNavbar>
            <AboutPage />
          </AppNavbar>
        } />
        <Route path="/chatbot" element={
          <AppNavbar>
            <ChatbotPage />
          </AppNavbar>
        } />
        
        {/* Admin routes without navbar */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  );
}

export default App;
