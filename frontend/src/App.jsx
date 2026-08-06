import { useState, useEffect } from 'react'
import LandingPage from './pages/LandingPage'
import SignInPage from './pages/SignIn'
import SignUpPage from './pages/SignUp'
import './App.css'

function App() {
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    const handleLocationChange = () => {
      setPath(window.location.pathname)
    };

    window.addEventListener('popstate', handleLocationChange)
    window.addEventListener('navigate', handleLocationChange)

    return () => {
      window.removeEventListener('popstate', handleLocationChange)
      window.removeEventListener('navigate', handleLocationChange)
    };
  }, [])

  // Programmatic navigate helper
  const navigate = (to) => {
    window.history.pushState({}, '', to)
    window.dispatchEvent(new Event('navigate'))
  };

  // Attach navigation helper globally
  window.navigateTo = navigate

  if (path === '/signin') {
    return <SignInPage />
  }
  if (path === '/signup') {
    return <SignUpPage />
  }
  return <LandingPage />
}

export default App

