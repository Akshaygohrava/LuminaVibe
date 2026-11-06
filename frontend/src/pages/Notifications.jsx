import { useState, useEffect } from "react";
import api from "../services/api";
import {
  Home,
  Compass,
  Bell,
  MessageSquare,
  User,
  Settings,
  Heart,
  MessageCircle,
  UserPlus,
  Plus,
  LogOut,
} from "lucide-react";
import "../assets/styles/Feed.css";
import "../assets/styles/Notifications.css";
import logoIcon from "../assets/icons/logo-icon.jpg";
import CreatePostModal from "../components/CreatePostModal";

export default function NotificationsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr && userStr !== "undefined") {
        const parsed = JSON.parse(userStr);
        if (parsed && parsed.username) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return {
      userId: 0,
      username: "creator_prime",
      fullName: "Creator Prime",
      profilePictureUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop",
    };
  });

  const [activeNav, setActiveNav] = useState("Notifications");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") !== "light");

  // Notifications state
  const [notifications, setNotifications] = useState([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);

  // Unread badge counters
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    loadNotifications();
    loadUnreadCounts();

    // Mark notifications read on load
    markAllNotificationsRead();

    // Polling counts
    const interval = setInterval(() => {
      loadUnreadCounts();
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    setIsLoadingNotifications(true);
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  const loadUnreadCounts = async () => {
    try {
      const notifRes = await api.get("/notifications/unread-count");
      setUnreadNotifications(notifRes.data.count);

      const msgRes = await api.get("/messages/unread-count");
      setUnreadMessages(msgRes.data.count);
    } catch (e) {
      console.error(e);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await api.put("/notifications/read");
      setUnreadNotifications(0);
    } catch (e) {
      console.error(e);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "LIKE":
        return <Heart className="size-4 text-red-500 fill-red-500" />;
      case "COMMENT":
        return <MessageCircle className="size-4 text-blue-400 fill-blue-400" />;
      case "FOLLOW":
      case "FOLLOW_REQUEST":
        return <UserPlus className="size-4 text-lime-400" />;
      default:
        return <Bell className="size-4 text-slate-400" />;
    }
  };

  const handleNotificationClick = (notif) => {
    if (notif.type === "LIKE" || notif.type === "COMMENT") {
      window.navigateTo(`/feed`);
    } else {
      window.navigateTo(`/profile?username=${notif.creatorUsername}`);
    }
  };

  return (
    <div className={`feed-page-container ${darkMode ? "dark" : "light-theme"}`}>
      {/* MOBILE TOP HEADER */}
      <header className="mobile-top-header" style={{ borderBottom: darkMode ? "1px solid rgba(255,255,255,0.03)" : "1px solid rgba(0,0,0,0.05)" }}>
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => window.navigateTo("/feed")}
          title="Go to Home"
        >
          <img src={logoIcon} alt="" className="size-7 rounded-lg object-cover" />
          <span className="mobile-logo">
            LuminaVibe<span className="sidebar-logo-dot">.</span>
          </span>
        </div>
        <div className="mobile-header-actions">
          <button className="icon-badge-btn" aria-label="Notifications" onClick={() => window.navigateTo("/notifications")}>
            <Bell className="size-5" />
            {unreadNotifications > 0 && <span className="icon-badge">{unreadNotifications}</span>}
          </button>
          <button className="icon-badge-btn" aria-label="Messages" onClick={() => window.navigateTo("/messages")}>
            <MessageSquare className="size-5" />
            {unreadMessages > 0 && <span className="icon-badge">{unreadMessages}</span>}
          </button>
        </div>
      </header>

      <div className="feed-layout">
        {/* LEFT SIDEBAR (Desktop/Tablet) */}
        <aside className="sidebar-left">
          <div
            className="sidebar-logo flex items-center gap-2.5 cursor-pointer"
            onClick={() => window.navigateTo("/feed")}
            title="Go to Home"
          >
            <img src={logoIcon} alt="" className="size-8 rounded-lg object-cover" />
            <span>LuminaVibe<span className="sidebar-logo-dot">.</span></span>
          </div>

          <nav className="sidebar-nav-list">
            {[
              { name: "Home", path: "/feed", icon: <Home className="size-5" /> },
              { name: "Explore", path: "/explore", icon: <Compass className="size-5" /> },
              { name: "Notifications", path: "/notifications", icon: <Bell className="size-5" />, badge: unreadNotifications },
              { name: "Messages", path: "/messages", icon: <MessageSquare className="size-5" />, badge: unreadMessages },
              { name: "Profile", path: "/profile", icon: <User className="size-5" /> },
              { name: "Settings", path: "/settings", icon: <Settings className="size-5" /> },
            ].map((item) => (
              <div
                key={item.name}
                className={`sidebar-nav-item ${activeNav === item.name ? "active" : ""}`}
                onClick={() => {
                  setActiveNav(item.name);
                  window.navigateTo(item.path);
                }}
              >
                <div className="relative flex items-center">
                  {item.icon}
                  {item.badge > 0 && <span className="sidebar-badge">{item.badge}</span>}
                </div>
                <span>{item.name}</span>
              </div>
            ))}
          </nav>

          <button
            className="sidebar-btn-create"
            onClick={() => setShowCreateModal(true)}
            aria-label="Create Post"
          >
            <Plus className="size-5" />
            <span>Create Post</span>
          </button>

          <div className="sidebar-profile">
            <img
              src={currentUser?.profile_picture_url || currentUser?.profilePictureUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop"}
              alt="Profile avatar"
              className="sidebar-avatar"
            />
            <div className="sidebar-profile-info">
              <div className="sidebar-profile-name">{currentUser?.name || currentUser?.full_name || currentUser?.fullName || "Creator"}</div>
              <div className="sidebar-profile-handle">@{currentUser?.username || "creator"}</div>
            </div>
            <button
              className="sidebar-logout-btn"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.navigateTo("/");
              }}
              title="Log Out"
            >
              <LogOut className="size-5" />
            </button>
          </div>
        </aside>

        {/* NOTIFICATIONS CENTER COLUMN */}
        <main className="notifications-main-column">
          <div className="notifications-card-panel">
            <div className="notifications-header-simple" style={{ padding: "20px 24px", borderBottom: "1px solid var(--glass-border)" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0, color: darkMode ? "#ffffff" : "#0f172a" }}>Notifications</h2>
            </div>

            <div className="notifications-scroller">
              {isLoadingNotifications ? (
                <div className="notifications-loader">
                  <div className="spinner"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="empty-notifications">
                  <Bell className="size-12 text-slate-500 mb-4" />
                  <h3>No new notifications</h3>
                  <p>When other creators like your vibes or follow you, they will appear here.</p>
                </div>
              ) : (
                <div className="notifications-list">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.notificationId} 
                      className={`notification-row-card ${!notif.isRead ? "unread" : ""}`}
                      onClick={() => handleNotificationClick(notif)}
                    >
                      <div className="notif-avatar-wrapper">
                        <img 
                          src={notif.creatorProfilePictureUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop"} 
                          alt="" 
                          className="notif-avatar" 
                        />
                        <span className="notif-badge-icon">
                          {getNotificationIcon(notif.type)}
                        </span>
                      </div>
                      <div className="notif-details">
                        <p className="notif-message-text">
                          <strong>{notif.creatorUsername || "A user"}</strong> {notif.message.replace(notif.creatorUsername, "").trim()}
                        </p>
                        <span className="notif-timestamp">
                          {new Date(notif.createdAt).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="mobile-bottom-nav">
        <button
          className={`mobile-nav-btn ${activeNav === "Home" ? "active" : ""}`}
          onClick={() => {
            setActiveNav("Home");
            window.navigateTo("/feed");
          }}
          aria-label="Home"
        >
          <Home className="size-5" />
        </button>
        <button
          className={`mobile-nav-btn ${activeNav === "Explore" ? "active" : ""}`}
          onClick={() => {
            setActiveNav("Explore");
            window.navigateTo("/explore");
          }}
          aria-label="Explore"
        >
          <Compass className="size-5" />
        </button>
        <button
          className="mobile-nav-btn-fab"
          onClick={() => setShowCreateModal(true)}
          aria-label="Create Post"
        >
          <Plus className="size-6" />
        </button>
        <button
          className={`mobile-nav-btn ${activeNav === "Notifications" ? "active" : ""}`}
          onClick={() => {
            setActiveNav("Notifications");
            window.navigateTo("/notifications");
          }}
          aria-label="Notifications"
        >
          <div className="relative">
            <Bell className="size-5" />
            {unreadNotifications > 0 && <span className="mobile-badge-bubble">{unreadNotifications}</span>}
          </div>
        </button>
        <button
          className={`mobile-nav-btn ${activeNav === "Profile" ? "active" : ""}`}
          onClick={() => {
            setActiveNav("Profile");
            window.navigateTo("/profile");
          }}
          aria-label="Profile"
        >
          <User className="size-5" />
        </button>
      </nav>

      {/* CREATE POST MODAL */}
      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onPostCreated={() => window.navigateTo("/feed")}
        darkMode={darkMode}
      />
    </div>
  );
}
