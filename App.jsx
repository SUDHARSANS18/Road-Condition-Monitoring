
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import LiveMonitor from './components/LiveMonitor';
import History from './components/History';
import Dashboard from './components/Dashboard';
import LoginPage from './components/LoginPage';
import Profile from './components/Profile';
import Settings from './components/Settings';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [activeView, setActiveView] = useState('MONITOR');
  const [detections, setDetections] = useState([]);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const saved = localStorage.getItem('roadsense_detections');
    if (saved) setDetections(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleLogin = (name) => {
    setIsLoggedIn(true);
    setUserName(name.split('@')[0] || 'Admin');
  };

  const handleNewDetections = (newItems) => {
    setDetections(prev => {
      const updated = [...prev, ...newItems];
      localStorage.setItem('roadsense_detections', JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeleteScan = (scanId) => {
    setDetections(prev => {
      const updated = prev.filter(d => d.scanId !== scanId);
      localStorage.setItem('roadsense_detections', JSON.stringify(updated));
      return updated;
    });
  };

  const renderView = () => {
    switch (activeView) {
      case 'MONITOR': return <LiveMonitor onDetections={handleNewDetections} />;
      case 'DASHBOARD': return <Dashboard detections={detections} />;
      case 'HISTORY': return <History detections={detections} onDeleteScan={handleDeleteScan} />;
      case 'PROFILE': return <Profile userName={userName} />;
      case 'SETTINGS': return <Settings theme={theme} setTheme={setTheme} />;
      default: return <LiveMonitor onDetections={handleNewDetections} />;
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-900'} transition-colors duration-300`}>
      {!isLoggedIn ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <Layout activeView={activeView} setActiveView={setActiveView} onLogout={() => setIsLoggedIn(false)} userName={userName} theme={theme}>
          {renderView()}
        </Layout>
      )}
    </div>
  );
};

export default App;
