import { Routes, Route} from 'react-router-dom';
import { AppNavbar } from './components/Navbar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import { ChatbotPage } from './pages/ChatbotPage';
import './index.css'

function App() {
  return (
    <AppNavbar>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
      </Routes>
    </AppNavbar>
  );
}

export default App;
