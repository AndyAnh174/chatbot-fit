import { Routes, Route} from 'react-router-dom';
import { AppNavbar } from './components/Navbar';
import HomePage from './pages/HomePage';
import { ChatbotPage } from './pages/ChatbotPage';
import './index.css'

function App() {
  return (
    <AppNavbar>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* About page removed; merged into Home */}
        <Route path="/chatbot" element={<ChatbotPage />} />
      </Routes>
    </AppNavbar>
  );
}

export default App;
