import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import GlobalStyles from './styles/GlobalStyles';
import { useEffect } from 'react';
import { trackPageView } from './utils/analytics';

// ページビューを追跡するためのコンポーネント
function PageTracker() {
  const location = useLocation();
  
  useEffect(() => {
    // ページビューを追跡
    trackPageView(location.pathname, document.title);
  }, [location]);
  
  return null;
}

function App() {
  return (
    <Router>
      <GlobalStyles />
      <PageTracker /> {/* ページビュー追跡コンポーネントを追加 */}
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/:gameId" element={<GamePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;