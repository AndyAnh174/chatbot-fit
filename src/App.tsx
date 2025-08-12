import { Routes, Route} from 'react-router-dom';
import { AppNavbar } from './components/Navbar';
import HomePage from './pages/HomePage';
import { ChatbotPage } from './pages/ChatbotPage';
import './index.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/chatbot"
        element={
          <AppNavbar>
            <ChatbotPage />
          </AppNavbar>
        }
      />
    </Routes>
  );
}

export default App;
