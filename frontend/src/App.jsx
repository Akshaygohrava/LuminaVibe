import { useState, useEffect } from 'react'
import LandingPage from './pages/LandingPage'
import SignInPage from './pages/SignIn'
import SignUpPage from './pages/SignUp'
import FeedPage from './pages/Feed'
import ExplorePage from './pages/Explore'
import ProfilePage from './pages/Profile'
import SettingsPage from './pages/Settings'
import MessagesPage from './pages/Messages'
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

  // Simple auth check helper
  const isAuthenticated = () => {
    return !!localStorage.getItem('token')
  };

  if (path === '/feed') {
    if (!isAuthenticated()) {
      setTimeout(() => navigate('/'), 0)
      return null
    }
    return <FeedPage />
  }

  if (path === '/explore') {
    if (!isAuthenticated()) {
      setTimeout(() => navigate('/'), 0)
      return null
    }
    return <ExplorePage />
  }

  if (path === '/profile') {
    if (!isAuthenticated()) {
      setTimeout(() => navigate('/'), 0)
      return null
    }
    return <ProfilePage />
  }

  if (path === '/settings') {
    if (!isAuthenticated()) {
      setTimeout(() => navigate('/'), 0)
      return null
    }
    return <SettingsPage />
  }

  if (path === '/messages') {
    if (!isAuthenticated()) {
      setTimeout(() => navigate('/'), 0)
      return null
    }
    return <MessagesPage />
  }

  if (path === '/signin') {
    if (isAuthenticated()) {
      setTimeout(() => navigate('/feed'), 0)
      return null
    }
    return <SignInPage />
  }

  if (path === '/signup') {
    if (isAuthenticated()) {
      setTimeout(() => navigate('/feed'), 0)
      return null
    }
    return <SignUpPage />
  }

  if (path === '/') {
    if (isAuthenticated()) {
      setTimeout(() => navigate('/feed'), 0)
      return null
    }
    return <LandingPage />
  }

  return <LandingPage />
}

export default App

