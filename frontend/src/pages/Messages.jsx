import { useState, useEffect, useRef, useCallback } from "react";
import api from "../services/api";
import {
  Home,
  Compass,
  Bell,
  MessageSquare,
  User,
  Settings,
  Send,
  Search,
  ArrowLeft,
  Plus,
  X,
  Check,
  CheckCheck,
  LogOut,
} from "lucide-react";
import "../assets/styles/Feed.css";
import "../assets/styles/Messages.css";
import logoIcon from "../assets/icons/logo-icon.jpg";
import CreatePostModal from "../components/CreatePostModal";
import { formatMediaUrl, handleAvatarError } from "../utils/mediaUrl";

export default function MessagesPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
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
      username: "creator_prime",
      name: "Creator Prime",
      profile_picture_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop",
    };
  });

  const [activeNav, setActiveNav] = useState("Messages");
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem("theme") !== "light";
    } catch (e) {
      return true;
    }
  });

  useEffect(() => {
    try {
      setDarkMode(localStorage.getItem("theme") !== "light");
    } catch (e) {}
  }, []);

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

  // Message specific states
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null); // holds ConversationDto
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState("");
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [searchUserQuery, setSearchUserQuery] = useState("");
  const [mobileView, setMobileView] = useState("list"); // "list" or "chat"
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const hasCheckedUrlParams = useRef(false);

  // Reliable scroll-to-bottom helper
  const scrollToBottom = useCallback((behavior = "auto") => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
    if (messagesEndRef.current) {
      try {
        messagesEndRef.current.scrollIntoView({ behavior, block: "end" });
      } catch (e) {}
    }
  }, []);

  // Auto-select chat based on query parameters (e.g. from profile redirect)
  useEffect(() => {
    if (conversations.length > 0 && !hasCheckedUrlParams.current) {
      hasCheckedUrlParams.current = true;
      const params = new URLSearchParams(window.location.search);
      const targetUserIdStr = params.get("userId");
      if (targetUserIdStr) {
        const targetUserId = parseInt(targetUserIdStr, 10);
        const targetUsername = params.get("username") || "creator";
        const targetFullName = params.get("fullName") || targetUsername;
        const targetAvatar = params.get("avatar") || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop";

        const existing = conversations.find(c => c.otherUserId === targetUserId);
        if (existing) {
          setActiveChat(existing);
          setMobileView("chat");
          loadChatHistory(targetUserId);
        } else {
          const virtualChat = {
            otherUserId: targetUserId,
            otherUsername: targetUsername,
            otherFullName: targetFullName,
            otherProfilePictureUrl: targetAvatar,
            lastMessage: "",
            lastMessageTime: null,
            lastMessageIsRead: true,
            lastMessageSentByMe: false
          };
          setActiveChat(virtualChat);
          setMobileView("chat");
          loadChatHistory(targetUserId);
        }
      }
    }
  }, [conversations]);

  // Load conversations on component mount & periodically
  useEffect(() => {
    loadConversations();
    const interval = setInterval(loadConversations, 5000); // Poll conversations every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Poll messages history for active chat every 3 seconds
  useEffect(() => {
    if (!activeChat) return;
    loadChatHistory(activeChat.otherUserId, true);
    const interval = setInterval(() => {
      loadChatHistory(activeChat.otherUserId, true); // silent background load
    }, 3000);
    return () => clearInterval(interval);
  }, [activeChat?.otherUserId]);

  // Automatically scroll to bottom whenever messages finish loading or update
  useEffect(() => {
    if (!isLoadingHistory && chatMessages.length > 0) {
      scrollToBottom("auto");
      const t1 = setTimeout(() => scrollToBottom("auto"), 50);
      const t2 = setTimeout(() => scrollToBottom("auto"), 180);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [chatMessages, isLoadingHistory, activeChat?.otherUserId, mobileView, scrollToBottom]);

  const loadConversations = async () => {
    try {
      const res = await api.get("/messages/conversations");
      setConversations(res.data);
    } catch (err) {
      console.error("Error loading conversations:", err);
    }
  };

  const loadChatHistory = async (otherUserId, silent = false) => {
    if (!silent) setIsLoadingHistory(true);
    try {
      const res = await api.get(`/messages/history/${otherUserId}`);
      setChatMessages(res.data);
      
      // Mark messages as read
      await api.put(`/messages/read/${otherUserId}`);
    } catch (err) {
      console.error("Error loading chat history:", err);
    } finally {
      if (!silent) {
        setIsLoadingHistory(false);
        setTimeout(() => scrollToBottom("auto"), 50);
      }
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessageText.trim() || !activeChat) return;

    const text = newMessageText.trim();
    setNewMessageText("");

    try {
      const res = await api.post("/messages", {
        receiverId: activeChat.otherUserId,
        content: text
      });

      const newMsg = res.data;
      setChatMessages(prev => [...prev, newMsg]);
      setTimeout(() => scrollToBottom("smooth"), 50);
      loadConversations();
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const openNewChatWindow = async () => {
    setShowNewChatModal(true);
    try {
      const res = await api.get("/messages/users");
      setAvailableUsers(res.data);
    } catch (err) {
      console.error("Error fetching message users:", err);
    }
  };

  const selectUserToChat = (user) => {
    // Check if conversation already exists in list
    const existing = conversations.find(c => c.otherUserId === user.userId);
    const chatData = existing || {
      otherUserId: user.userId,
      otherUsername: user.username,
      otherFullName: user.fullName || user.username,
      otherProfilePictureUrl: user.profilePictureUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop",
      lastMessage: "",
      lastMessageTime: null,
      lastMessageIsRead: true,
      lastMessageSentByMe: false
    };

    setActiveChat(chatData);
    setChatMessages([]);
    setShowNewChatModal(false);
    setMobileView("chat");
    loadChatHistory(user.userId);
    setTimeout(() => scrollToBottom("auto"), 80);
  };

  const selectConversation = (chat) => {
    setActiveChat(chat);
    setChatMessages([]);
    setMobileView("chat");
    loadChatHistory(chat.otherUserId);
    setTimeout(() => scrollToBottom("auto"), 80);
  };

  const formatMessageTime = (timeStr) => {
    if (!timeStr) return "";
    try {
      const d = new Date(timeStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return "";
    }
  };

  const filteredUsers = availableUsers.filter(u => 
    u.username.toLowerCase().includes(searchUserQuery.toLowerCase()) || 
    (u.fullName && u.fullName.toLowerCase().includes(searchUserQuery.toLowerCase()))
  );

  return (
    <div className={`feed-page-container ${darkMode ? "dark" : "light-theme"}`}>
      {/* MOBILE TOP HEADER */}
      <header className="mobile-top-header" style={{ borderBottom: darkMode ? "1px solid rgba(255,255,255,0.03)" : "1px solid rgba(0,0,0,0.05)" }}>
        {mobileView === "chat" && activeChat ? (
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              className="cover-btn-pill"
              onClick={() => setMobileView("list")}
              title="Back to conversations"
              aria-label="Back to conversations"
            >
              <ArrowLeft className="size-5" style={{ color: darkMode ? "#ffffff" : "#0f172a" }} />
            </button>
            <img
              src={formatMediaUrl(activeChat.otherProfilePictureUrl, "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop")}
              alt=""
              className="size-8 rounded-full object-cover border border-white/10 shrink-0"
              onError={handleAvatarError}
            />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold truncate leading-tight" style={{ color: darkMode ? "#ffffff" : "#0f172a" }}>
                {activeChat.otherFullName || activeChat.otherUsername}
              </span>
              <span className="text-[11px] truncate leading-tight" style={{ color: darkMode ? "rgba(255,255,255,0.45)" : "#64748b" }}>
                @{activeChat.otherUsername}
              </span>
            </div>
          </div>
        ) : (
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
        )}
        {mobileView === "list" && (
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
        )}
      </header>

      <div className="feed-layout">
        {/* LEFT SIDEBAR */}
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
              src={formatMediaUrl(currentUser?.profile_picture_url || currentUser?.profilePictureUrl, "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop")}
              alt="Profile avatar"
              className="sidebar-avatar"
              onError={handleAvatarError}
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

        {/* MESSAGES CORE VIEW */}
        <main className="messages-main-container">
          <div className="messages-card-panel">
            {/* Conversation sidebar */}
            <div className={`chats-sidebar ${mobileView === "chat" ? "mobile-hidden" : ""}`}>
              <div className="chats-sidebar-header">
                <h2>Direct Messages</h2>
                <button className="new-chat-btn" onClick={openNewChatWindow} aria-label="New Message">
                  <Plus className="size-5" />
                </button>
              </div>

              {/* Chat search */}
              <div className="chat-search-bar">
                <Search className="size-4 search-icon" />
                <input type="text" placeholder="Search chats..." className="search-input" />
              </div>

              {/* Conversations scrollbar */}
              <div className="conversations-list">
                {conversations.length === 0 ? (
                  <div className="no-chats-placeholder">
                    <span>No active chats. Start one below!</span>
                    <button className="start-chat-action-btn" onClick={openNewChatWindow}>
                      Start Chatting
                    </button>
                  </div>
                ) : (
                  conversations.map((chat) => (
                    <div 
                      key={chat.otherUserId}
                      className={`conversation-item ${activeChat?.otherUserId === chat.otherUserId ? "active" : ""} ${!chat.lastMessageIsRead && !chat.lastMessageSentByMe ? "unread" : ""}`}
                      onClick={() => selectConversation(chat)}
                    >
                      <img 
                        src={formatMediaUrl(chat.otherProfilePictureUrl, "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop")} 
                        alt="" 
                        className="conversation-avatar" 
                        onError={handleAvatarError}
                      />
                      <div className="conversation-info">
                        <div className="conversation-info-top">
                          <span className="conversation-name">{chat.otherFullName || chat.otherUsername}</span>
                          <span className="conversation-time">
                            {chat.lastMessageTime ? new Date(chat.lastMessageTime).toLocaleDateString([], { month: "short", day: "numeric" }) : ""}
                          </span>
                        </div>
                        <div className="conversation-info-bottom">
                          <span className="conversation-preview-text">
                            {chat.lastMessageSentByMe ? "You: " : ""}{chat.lastMessage}
                          </span>
                          {!chat.lastMessageIsRead && !chat.lastMessageSentByMe && (
                            <span className="unread-dot"></span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Chat content pane */}
            <div className={`chat-pane ${mobileView === "list" ? "mobile-hidden" : ""}`}>
              {activeChat ? (
                <>
                  {/* Desktop Chat header */}
                  <div className="chat-header hidden md:flex">
                    <img 
                      src={formatMediaUrl(activeChat.otherProfilePictureUrl, "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop")} 
                      alt="" 
                      className="chat-header-avatar" 
                      onError={handleAvatarError}
                    />
                    <div className="chat-header-info">
                      <span className="chat-header-name">{activeChat.otherFullName || activeChat.otherUsername}</span>
                      <span className="chat-header-status">@{activeChat.otherUsername}</span>
                    </div>
                  </div>

                  {/* Messages history scroller */}
                  <div className="messages-history" ref={messagesContainerRef}>
                    {isLoadingHistory ? (
                      <div className="loading-spinner-wrapper">
                        <div className="spinner"></div>
                      </div>
                    ) : chatMessages.length === 0 ? (
                      <div className="empty-chat-welcome">
                        <img 
                          src={formatMediaUrl(activeChat.otherProfilePictureUrl, "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop")} 
                          alt="" 
                          className="welcome-avatar" 
                          onError={handleAvatarError}
                        />
                        <h3>Send a message to start the vibe</h3>
                        <p>Direct messages between you and @{activeChat.otherUsername} are secure.</p>
                      </div>
                    ) : (
                      <>
                        <div className="messages-spacer" />
                        {chatMessages.map((msg) => {
                          const isSentByMe = msg.senderId === currentUser?.userId;
                          return (
                            <div 
                              key={msg.messageId} 
                              className={`message-bubble-row ${isSentByMe ? "sent" : "received"}`}
                            >
                              <div className="bubble-wrapper">
                                <div className="bubble-content">
                                  <p>{msg.content}</p>
                                </div>
                                <div className="bubble-meta">
                                  <span className="bubble-time">{formatMessageTime(msg.createdAt)}</span>
                                  {isSentByMe && (
                                    <span className="receipt-icon">
                                      {msg.isRead ? (
                                        <CheckCheck className="size-3 text-lime-400" />
                                      ) : (
                                        <Check className="size-3 text-slate-400" />
                                      )}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message editor send bar */}
                  <form className="message-send-bar" onSubmit={handleSendMessage}>
                    <input 
                      type="text" 
                      placeholder="Type a message..." 
                      className="message-input-text"
                      value={newMessageText}
                      onChange={(e) => setNewMessageText(e.target.value)}
                    />
                    <button 
                      type="submit" 
                      className="message-submit-btn-action"
                      disabled={!newMessageText.trim()}
                    >
                      <Send className="size-5" />
                    </button>
                  </form>
                </>
              ) : (
                <div className="empty-chat-pane">
                  <div className="empty-chat-illustration">
                    <MessageSquare className="size-12" />
                  </div>
                  <h3>Select a conversation</h3>
                  <p>Choose an existing conversation or start a new message with other creators.</p>
                  <button className="start-new-chat-btn-action" onClick={openNewChatWindow}>
                    New Message
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* NEW CHAT MODAL */}
      {showNewChatModal && (
        <div className="modal-overlay-bg" onClick={() => setShowNewChatModal(false)}>
          <div className="modal-content-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">New Vibe Chat</span>
              <button className="modal-close-btn" onClick={() => setShowNewChatModal(false)}>
                <X className="size-5" />
              </button>
            </div>

            <div className="new-chat-search">
              <Search className="size-4 search-icon" />
              <input 
                type="text" 
                placeholder="Search username or name..." 
                className="search-input"
                value={searchUserQuery}
                onChange={(e) => setSearchUserQuery(e.target.value)}
              />
            </div>

            <div className="users-picker-list">
              {filteredUsers.length === 0 ? (
                <div className="no-users-picker">No creators found.</div>
              ) : (
                filteredUsers.map((user) => (
                  <div 
                    key={user.userId} 
                    className="user-picker-item"
                    onClick={() => selectUserToChat(user)}
                  >
                    <img 
                      src={formatMediaUrl(user.profilePictureUrl || user.profile_picture_url, "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop")} 
                      alt="" 
                      className="picker-avatar" 
                      onError={handleAvatarError}
                    />
                    <div className="picker-info">
                      <span className="picker-fullname">{user.fullName || user.username}</span>
                      <span className="picker-username">@{user.username}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

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
