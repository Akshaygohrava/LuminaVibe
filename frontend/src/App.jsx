import { useEffect } from 'react'
import AppRoutes from './routes/AppRoutes'
import ErrorBoundary from './components/ErrorBoundary'
import { getBackendBaseUrl } from './utils/mediaUrl'
import './App.css'

function App() {
  useEffect(() => {
    const backendUrl = getBackendBaseUrl().replace(/\/+$/, '');
    const pingHealth = () => {
      fetch(`${backendUrl}/health`).catch(() => {});
    };
    pingHealth();
    const interval = setInterval(pingHealth, 4 * 60 * 1000); // Ping every 4 minutes to keep backend awake
    return () => clearInterval(interval);
  }, []);

  return (
    <ErrorBoundary>
      <AppRoutes />
    </ErrorBoundary>
  )
}

export default App

