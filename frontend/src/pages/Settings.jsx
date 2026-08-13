import { useState, useEffect } from "react";
import api from "../services/api";
import {
  Home,
  Compass,
  Heart,
  Bell,
  MessageSquare,
  Plus,
  LogOut,
  Settings,
  Lock,
  Moon,
  Sun,
  Globe,
  User,
  Check,
  Languages,
} from "lucide-react";
import "../assets/styles/Feed.css";
import "../assets/styles/Settings.css";
import logoIcon from "../assets/icons/logo-icon.jpg";

export default function SettingsPage() {
  // Authentication & User state
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
      console.error("Error parsing user data from localStorage", e);
    }
    return {
      userId: 0,
      username: "creator_prime",
      fullName: "Creator Prime",
      profilePictureUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop",
    };
  });

  const [activeNav, setActiveNav] = useState("Settings");

  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    const loadUnreadCounts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const notifRes = await api.get("/notifications/unread-count");
        setUnreadNotifications(notifRes.data.count);

        const msgRes = await api.get("/messages/unread-count");
        setUnreadMessages(msgRes.data.count);
      } catch (e) {
        console.error(e);
      }
    };

    loadUnreadCounts();
    const interval = setInterval(loadUnreadCounts, 10000);
    return () => clearInterval(interval);
  }, []);

  // Preferences states
  const [isPrivate, setIsPrivate] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [language, setLanguage] = useState("en");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(false);

  // Load preferences from backend
  useEffect(() => {
    const fetchSettings = async () => {
      if (!currentUser || currentUser.userId === 0) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await api.get(`/settings/${currentUser.userId}`);
        const data = response.data;
        setIsPrivate(data.is_private ?? false);
        setDarkMode(data.dark_mode ?? true);
        setNotificationsEnabled(data.notifications_enabled ?? true);
        setLanguage(data.language ?? "en");
      } catch (err) {
        console.error(err);
        setErrorMsg("Could not sync settings from server. Displaying local cache.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [currentUser]);

  // Apply dark mode theme class locally
  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setErrorMsg(null);
    setSuccessMsg(false);

    const payload = {
      is_private: isPrivate,
      dark_mode: darkMode,
      notifications_enabled: notificationsEnabled,
      language: language,
    };

    try {
      await api.put(`/settings/${currentUser.userId}`, payload);

      // Sync local storage user isPrivate state
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const userObj = JSON.parse(userStr);
        userObj.isPrivate = isPrivate;
        localStorage.setItem("user", JSON.stringify(userObj));
      }

      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 2000);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.navigateTo("/");
  };

  return (
    <div className={`feed-page-container settings-page-container ${darkMode ? "dark" : "light light-theme"}`}>
      {/* MOBILE TOP HEADER */}
      <header className="mobile-top-header" style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
        <span className="mobile-logo" style={{ color: darkMode ? "#f8fafc" : "#0f172a" }}>
          Settings
        </span>
        <div className="mobile-header-actions">
          <button className="icon-badge-btn" onClick={handleLogout} aria-label="Log Out">
            <LogOut className="size-5" style={{ color: darkMode ? "#f8fafc" : "#0f172a" }} />
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

          <button
            className="sidebar-btn-create"
            onClick={() => window.navigateTo("/feed")}
            aria-label="Create Post"
          >
            <Plus className="size-5" />
            <span>Create Post</span>
          </button>

          <div className="sidebar-profile">
            <img
              src={currentUser?.profile_picture_url || currentUser?.profile_picture || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop"}
              alt="Profile avatar"
              className="sidebar-avatar"
            />
            <div className="sidebar-profile-info">
              <div className="sidebar-profile-name">{currentUser?.full_name || currentUser?.fullName || "Creator Profile"}</div>
              <div className="sidebar-profile-handle">@{currentUser?.username || "creator"}</div>
            </div>
            <button className="sidebar-logout-btn" onClick={handleLogout} title="Log Out">
              <LogOut className="size-5" />
            </button>
          </div>
        </aside>

        {/* CENTER COLUMN (Settings Options panels) */}
        <main className="settings-main-column mt-4 md:mt-0">
          {errorMsg && (
            <div className="p-3.5 bg-red-50 text-red-600 rounded-2xl text-xs font-semibold border border-red-100 mx-4 md:mx-0">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl text-xs font-semibold border border-emerald-100 flex items-center gap-1.5 mx-4 md:mx-0">
              <Check className="size-4" />
              <span>Settings updated successfully!</span>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-12 text-sm text-slate-500">
              Syncing preferences...
            </div>
          ) : (
            <>
              {/* Privacy Panel */}
              <section className="settings-section-card">
                <h3 className="settings-section-title">
                  <Lock className="size-5 text-indigo-500" />
                  <span>Privacy Settings</span>
                </h3>

                <div className="settings-option-row">
                  <div className="settings-option-info">
                    <span className="settings-option-label">Private Account</span>
                    <span className="settings-option-desc">
                      When your account is private, only people you approve can see your vibes and media.
                    </span>
                  </div>
                  <label className="toggle-switch-container">
                    <input
                      type="checkbox"
                      checked={isPrivate}
                      onChange={(e) => setIsPrivate(e.target.checked)}
                    />
                    <span className="toggle-switch-slider"></span>
                  </label>
                </div>
              </section>

              {/* Theme Settings */}
              <section className="settings-section-card">
                <h3 className="settings-section-title">
                  {darkMode ? (
                    <Moon className="size-5 text-indigo-500" />
                  ) : (
                    <Sun className="size-5 text-amber-500" />
                  )}
                  <span>Appearance</span>
                </h3>

                <div className="settings-option-row">
                  <div className="settings-option-info">
                    <span className="settings-option-label">Dark Mode Theme</span>
                    <span className="settings-option-desc">
                      Switch between the luminous neon dark mode and the clean white glassmorphic light theme.
                    </span>
                  </div>
                  <label className="toggle-switch-container">
                    <input
                      type="checkbox"
                      checked={darkMode}
                      onChange={(e) => setDarkMode(e.target.checked)}
                    />
                    <span className="toggle-switch-slider"></span>
                  </label>
                </div>
              </section>

              {/* Notification Preferences */}
              <section className="settings-section-card">
                <h3 className="settings-section-title">
                  <Bell className="size-5 text-indigo-500" />
                  <span>Notifications</span>
                </h3>

                <div className="settings-option-row">
                  <div className="settings-option-info">
                    <span className="settings-option-label">Push Notifications</span>
                    <span className="settings-option-desc">
                      Receive alerts on likes, comments, and new followers instantly.
                    </span>
                  </div>
                  <label className="toggle-switch-container">
                    <input
                      type="checkbox"
                      checked={notificationsEnabled}
                      onChange={(e) => setNotificationsEnabled(e.target.checked)}
                    />
                    <span className="toggle-switch-slider"></span>
                  </label>
                </div>
              </section>

              {/* Languages */}
              <section className="settings-section-card">
                <h3 className="settings-section-title">
                  <Languages className="size-5 text-indigo-500" />
                  <span>Language</span>
                </h3>

                <div className="settings-option-row">
                  <div className="settings-option-info">
                    <span className="settings-option-label">Display Language</span>
                    <span className="settings-option-desc">
                      Select your preferred interface display language.
                    </span>
                  </div>
                  <select
                    className="settings-select-input"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="id">Bahasa Indonesia</option>
                  </select>
                </div>
              </section>

              {/* Save settings action button */}
              <div className="settings-save-row">
                <button
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="btn-settings-save"
                >
                  {isSaving ? "Saving..." : "Save Preferences"}
                </button>
              </div>

              {/* Log out box */}
              <section className="settings-logout-card">
                <button className="btn-settings-logout" onClick={handleLogout}>
                  <LogOut className="size-5" />
                  <span>Log Out of Account</span>
                </button>
              </section>
            </>
          )}
        </main>

        {/* RIGHT SIDEBAR (Desktop Settings Sidebar) */}
        <aside className="sidebar-right">
          <div className="right-sidebar-panel" style={{ background: darkMode ? "var(--glass-bg)" : "rgba(255,255,255,0.75)", border: darkMode ? "1px solid var(--glass-border)" : "1px solid rgba(0,0,0,0.06)", boxShadow: darkMode ? "var(--glass-glow)" : "0 10px 30px -5px rgba(0,0,0,0.04)" }}>
            <h3 className="panel-title" style={{ color: darkMode ? "#ffffff" : "#0f172a" }}>Preferences Help</h3>
            <p className="text-xs leading-relaxed text-slate-400 mt-2">
              Syncing settings will save theme selections and privacy configurations directly on the cloud database. If you log in on another device, your settings will sync instantly!
            </p>
          </div>
        </aside>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
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
          onClick={() => window.navigateTo("/feed")}
          aria-label="Create Post"
        >
          <Plus className="size-6" />
        </button>
        <button
          className={`mobile-nav-btn ${activeNav === "Notifications" ? "active" : ""}`}
          onClick={() => setActiveNav("Notifications")}
          aria-label="Notifications"
        >
          <Bell className="size-5" />
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
    </div>
  );
}
