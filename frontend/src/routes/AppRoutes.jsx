import { useState, useEffect, useCallback } from 'react';
import LandingPage from '../pages/LandingPage';
import SignInPage from '../pages/SignIn';
import SignUpPage from '../pages/SignUp';
import FeedPage from '../pages/Feed';
import ExplorePage from '../pages/Explore';
import ProfilePage from '../pages/Profile';
import SettingsPage from '../pages/Settings';
import MessagesPage from '../pages/Messages';
import NotificationsPage from '../pages/Notifications';

export default function AppRoutes() {
  const [path, setPath] = useState(() => window.location.pathname);

  // Normalize path: removes trailing slashes and handles casing
  const normalizePath = (p) => {
    if (!p) return '/';
    const clean = p.split('?')[0].split('#')[0].replace(/\/+$/, '').toLowerCase();
    return clean || '/';
  };

  const handleLocationChange = useCallback(() => {
    setPath(window.location.pathname);
  }, []);

  useEffect(() => {
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('navigate', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('navigate', handleLocationChange);
    };
  }, [handleLocationChange]);

  // Programmatic navigate helper
  const navigate = useCallback((to) => {
    if (window.location.pathname !== to) {
      window.history.pushState({}, '', to);
    }
    setPath(to);
    window.dispatchEvent(new Event('navigate'));
  }, []);

  // Attach navigation helper globally
  window.navigateTo = navigate;

  // Simple auth check helper
  const isAuthenticated = () => {
    try {
      const token = localStorage.getItem('token');
      return !!token && token !== 'undefined' && token !== 'null' && token.trim().length > 0;
    } catch (e) {
      return false;
    }
  };

  const currentPath = normalizePath(path);
  const authed = isAuthenticated();

  // Route matching with immediate rendering and safe background URL sync
  if (currentPath === '/feed') {
    if (!authed) {
      if (window.location.pathname !== '/signin') {
        window.history.replaceState({}, '', '/signin');
      }
      return <SignInPage />;
    }
    return <FeedPage />;
  }

  if (currentPath === '/explore') {
    if (!authed) {
      if (window.location.pathname !== '/signin') {
        window.history.replaceState({}, '', '/signin');
      }
      return <SignInPage />;
    }
    return <ExplorePage />;
  }

  if (currentPath === '/profile') {
    if (!authed) {
      if (window.location.pathname !== '/signin') {
        window.history.replaceState({}, '', '/signin');
      }
      return <SignInPage />;
    }
    return <ProfilePage />;
  }

  if (currentPath === '/settings') {
    if (!authed) {
      if (window.location.pathname !== '/signin') {
        window.history.replaceState({}, '', '/signin');
      }
      return <SignInPage />;
    }
    return <SettingsPage />;
  }

  if (currentPath === '/messages') {
    if (!authed) {
      if (window.location.pathname !== '/signin') {
        window.history.replaceState({}, '', '/signin');
      }
      return <SignInPage />;
    }
    return <MessagesPage />;
  }

  if (currentPath === '/notifications') {
    if (!authed) {
      if (window.location.pathname !== '/signin') {
        window.history.replaceState({}, '', '/signin');
      }
      return <SignInPage />;
    }
    return <NotificationsPage />;
  }

  if (currentPath === '/signin') {
    if (authed) {
      if (window.location.pathname !== '/feed') {
        window.history.replaceState({}, '', '/feed');
      }
      return <FeedPage />;
    }
    return <SignInPage />;
  }

  if (currentPath === '/signup') {
    if (authed) {
      if (window.location.pathname !== '/feed') {
        window.history.replaceState({}, '', '/feed');
      }
      return <FeedPage />;
    }
    return <SignUpPage />;
  }

  if (currentPath === '/') {
    if (authed) {
      if (window.location.pathname !== '/feed') {
        window.history.replaceState({}, '', '/feed');
      }
      return <FeedPage />;
    }
    return <LandingPage />;
  }

  // Fallback for any other path:
  if (authed) {
    if (window.location.pathname !== '/feed') {
      window.history.replaceState({}, '', '/feed');
    }
    return <FeedPage />;
  }

  if (window.location.pathname !== '/') {
    window.history.replaceState({}, '', '/');
  }
  return <LandingPage />;
}
