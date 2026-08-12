import { useState, useEffect } from "react";
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
  Sparkles,
  Check,
  X
} from "lucide-react";
import "../assets/styles/Feed.css";
import "../assets/styles/Notifications.css";
import logoIcon from "../assets/icons/logo-icon.jpg";

export default function NotificationsPage() {
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
    return null;
  });

  const [activeNav, setActiveNav] = useState("Notifications");
  const [activeTab, setActiveTab] = useState("Notifications"); // "Notifications" or "For You"
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") !== "light");

  // Notifications state
  const [notifications, setNotifications] = useState([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);

  // Follow requests state
  const [followRequests, setFollowRequests] = useState([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);

  // Unread badge counters
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  // Suggested users
  const [suggestedCreators, setSuggestedCreators] = useState([
    { userId: 101, username: "randybchtr", fullName: "Randy Bachtiar", profilePictureUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop", bio: "Creator & Visual Director", followStatus: "NOT_FOLLOWING" },
    { userId: 102, username: "sarah_c", fullName: "Sarah Connor", profilePictureUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop", bio: "Tech & Coding Enthusiast", followStatus: "NOT_FOLLOWING" },
    { userId: 103, username: "calire.gd", fullName: "Calire GD", profilePictureUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop", bio: "Motion designer & photographer", followStatus: "NOT_FOLLOWING" }
  ]);

  useEffect(() => {
    loadNotifications();
    loadFollowRequests();
    loadUnreadCounts();

    // Mark notifications read on load
    markAllNotificationsRead();

    // Polling counts and data
    const interval = setInterval(() => {
      loadUnreadCounts();
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    setIsLoadingNotifications(true);
    try {
      const res = await fetch("http://localhost:8080/notifications", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  const loadFollowRequests = async () => {
    setIsLoadingRequests(true);
    try {
      const res = await fetch("http://localhost:8080/follows/requests", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setFollowRequests(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingRequests(false);
    }
  };

  const loadUnreadCounts = async () => {
    try {
      // Notifications unread count
      const notifRes = await fetch("http://localhost:8080/notifications/unread-count", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (notifRes.ok) {
        const d = await notifRes.json();
        setUnreadNotifications(d.count);
      }

      // Messages unread count
      const msgRes = await fetch("http://localhost:8080/messages/unread-count", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (msgRes.ok) {
        const d = await msgRes.json();
        setUnreadMessages(d.count);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await fetch("http://localhost:8080/notifications/read", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      setUnreadNotifications(0);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAcceptRequest = async (followerId) => {
    try {
      const res = await fetch(`http://localhost:8080/follows/accept/${followerId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (res.ok) {
        loadFollowRequests();
        loadNotifications();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectRequest = async (followerId) => {
    try {
      const res = await fetch(`http://localhost:8080/follows/reject/${followerId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (res.ok) {
        loadFollowRequests();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFollowSuggestion = async (userId, idx) => {
    try {
      const res = await fetch(`http://localhost:8080/follows/toggle/${userId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setSuggestedCreators(prev => prev.map((item, i) => {
          if (i === idx) {
            return { ...item, followStatus: data.status };
          }
          return item;
        }));
      }
    } catch (err) {
      console.error(err);
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
      window.navigateTo(`/feed`); // Take them to feed to check posts
    } else {
      window.navigateTo(`/profile?username=${notif.creatorUsername}`);
    }
  };

  return (
    <div className={`feed-page-container ${darkMode ? "dark" : "light-theme"}`}>
      {/* MOBILE TOP HEADER */}
      <header className="mobile-top-header" style={{ borderBottom: darkMode ? "1px solid rgba(255,255,255,0.03)" : "1px solid rgba(0,0,0,0.05)" }}>
        <div className="flex items-center gap-2">
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
          <div className="sidebar-logo flex items-center gap-2.5">
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
        </aside>

        {/* NOTIFICATIONS CENTER COLUMN */}
        <main className="notifications-main-column">
          <div className="notifications-card-panel">
            {/* Header Tabs */}
            <div className="notifications-tabs-header">
              <button 
                className={`notif-tab-btn ${activeTab === "Notifications" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("Notifications");
                  markAllNotificationsRead();
                }}
              >
                Notifications
              </button>
              <button 
                className={`notif-tab-btn ${activeTab === "For You" ? "active" : ""}`}
                onClick={() => setActiveTab("For You")}
              >
                For You
              </button>
            </div>

            {/* TAB CONTENT: NOTIFICATIONS */}
            {activeTab === "Notifications" && (
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
            )}

            {/* TAB CONTENT: FOR YOU */}
            {activeTab === "For You" && (
              <div className="notifications-scroller">
                {/* Follow Requests */}
                <div className="for-you-requests-section">
                  <h3 className="section-title-label">Pending Follow Requests</h3>
                  {isLoadingRequests ? (
                    <div className="text-center py-6 text-slate-500 text-sm">Loading requests...</div>
                  ) : followRequests.length === 0 ? (
                    <div className="empty-requests-card">
                      No pending requests. Your profile is active and fully visible.
                    </div>
                  ) : (
                    <div className="requests-vertical-list">
                      {followRequests.map((req) => (
                        <div key={req.follower.userId} className="request-card-row">
                          <img 
                            src={req.follower.profilePictureUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop"} 
                            alt="" 
                            className="request-avatar"
                          />
                          <div className="request-info">
                            <span className="request-fullname">{req.follower.fullName || req.follower.username}</span>
                            <span className="request-username">@{req.follower.username}</span>
                          </div>
                          <div className="request-actions">
                            <button 
                              className="btn-action-accept" 
                              onClick={() => handleAcceptRequest(req.follower.userId)}
                              title="Accept Request"
                            >
                              <Check className="size-4" />
                            </button>
                            <button 
                              className="btn-action-reject" 
                              onClick={() => handleRejectRequest(req.follower.userId)}
                              title="Decline Request"
                            >
                              <X className="size-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Suggestions Grid */}
                <div className="for-you-suggestions-section">
                  <div className="suggestions-header-bar flex items-center gap-2">
                    <Sparkles className="size-4 text-lime-400" />
                    <h3 className="section-title-label m-0">Suggested Creators</h3>
                  </div>
                  <div className="suggestions-card-grid">
                    {suggestedCreators.map((item, idx) => (
                      <div key={item.userId} className="suggestion-grid-card">
                        <img src={item.profilePictureUrl} alt="" className="suggestion-card-avatar" />
                        <span className="suggestion-card-name">{item.fullName}</span>
                        <span className="suggestion-card-handle">@{item.username}</span>
                        <p className="suggestion-card-bio">{item.bio}</p>
                        <button 
                          className={`btn-follow-suggestion ${item.followStatus !== "NOT_FOLLOWING" ? "following" : "follow"}`}
                          onClick={() => handleToggleFollowSuggestion(item.userId, idx)}
                        >
                          {item.followStatus === "ACCEPTED" ? "Following" : item.followStatus === "PENDING" ? "Requested" : "Follow"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="mobile-bottom-nav">
        {[
          { name: "Home", path: "/feed", icon: <Home className="size-6" /> },
          { name: "Explore", path: "/explore", icon: <Compass className="size-6" /> },
          { name: "Notifications", path: "/notifications", icon: <Bell className="size-6" />, badge: unreadNotifications },
          { name: "Messages", path: "/messages", icon: <MessageSquare className="size-6" />, badge: unreadMessages },
          { name: "Profile", path: "/profile", icon: <User className="size-6" /> },
        ].map(item => (
          <button
            key={item.name}
            className={`mobile-nav-btn ${activeNav === item.name ? "active" : ""}`}
            onClick={() => {
              setActiveNav(item.name);
              window.navigateTo(item.path);
            }}
          >
            <div className="relative">
              {item.icon}
              {item.badge > 0 && <span className="mobile-badge-bubble">{item.badge}</span>}
            </div>
          </button>
        ))}
      </nav>
    </div>
  );
}
