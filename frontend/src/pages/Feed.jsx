import { useState, useEffect, useRef } from "react";
import {
  Home,
  Compass,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Bell,
  MessageSquare,
  Plus,
  Search,
  LogOut,
  MoreHorizontal,
  Settings,
  MapPin,
  X,
  Globe,
  Flame,
  User,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "../assets/styles/Feed.css";
import logoIcon from "../assets/icons/logo-icon.jpg";

export default function FeedPage() {
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
    // Fallback user if not found
    return {
      username: "creator_prime",
      name: "Creator Prime",
      profile_picture_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop",
    };
  });

  // Tabs: "Home" or "For You"
  const [activeTab, setActiveTab] = useState("Home");

  // Bottom menu navigation state (for active class on mobile/sidebar)
  const [activeNav, setActiveNav] = useState("Home");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") !== "light");

  useEffect(() => {
    setDarkMode(localStorage.getItem("theme") !== "light");
  }, []);

  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    const loadUnreadCounts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const notifRes = await fetch("http://localhost:8080/notifications/unread-count", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (notifRes.ok) {
          const d = await notifRes.json();
          setUnreadNotifications(d.count);
        }

        const msgRes = await fetch("http://localhost:8080/messages/unread-count", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (msgRes.ok) {
          const d = await msgRes.json();
          setUnreadMessages(d.count);
        }
      } catch (e) {
        console.error(e);
      }
    };

    loadUnreadCounts();
    const interval = setInterval(loadUnreadCounts, 10000);
    return () => clearInterval(interval);
  }, []);

  // Search input state
  const [searchQuery, setSearchQuery] = useState("");

  // Create post modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPostCaption, setNewPostCaption] = useState("");
  const [newPostLocation, setNewPostLocation] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Post management states
  const [activePostMenuId, setActivePostMenuId] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [editCaption, setEditCaption] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeReplyCommentId, setActiveReplyCommentId] = useState(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (!event.target.closest(".post-options-container")) {
        setActivePostMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Carousel slider active index tracking per post
  const [carouselIndices, setCarouselIndices] = useState({});

  // Stories viewer state
  const [selectedStory, setSelectedStory] = useState(null);
  const [storyProgress, setStoryProgress] = useState(0);

  // Suggested follow list state
  const [suggestions, setSuggestions] = useState([
    { id: 1, name: "Randy Bachtiar", handle: "randybchtr", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop", isFollowing: false },
    { id: 2, name: "Sarah Connor", handle: "sarah_c", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop", isFollowing: false },
    { id: 3, name: "Calvin Klein", handle: "calvin_k", avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop", isFollowing: true },
  ]);

  // Feed posts state (fetched dynamically from backend database)
  const [posts, setPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  // Stories mock data
  const stories = [
    {
      id: 1,
      username: "Your story",
      avatar: currentUser?.profile_picture_url || currentUser?.profile_picture || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop",
      isSelf: true,
      storyUrl: "",
      isLive: false
    },
    {
      id: 2,
      username: "calire.gd",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop",
      isSelf: false,
      isLive: true,
      storyUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop",
    },
    {
      id: 3,
      username: "calista33",
      avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop",
      isSelf: false,
      isLive: false,
      storyUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&auto=format&fit=crop",
    },
    {
      id: 4,
      username: "azizahrh",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop",
      isSelf: false,
      isLive: false,
      storyUrl: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&auto=format&fit=crop",
    },
    {
      id: 5,
      username: "adamsuseno",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop",
      isSelf: false,
      isLive: false,
      storyUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop",
    },
    {
      id: 6,
      username: "adelia.k",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop",
      isSelf: false,
      isLive: false,
      storyUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop",
    }
  ];

  // Story Autoclose Timer effect
  useEffect(() => {
    let timer;
    if (selectedStory) {
      setStoryProgress(0);
      timer = setInterval(() => {
        setStoryProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setSelectedStory(null);
            return 0;
          }
          return prev + 1;
        });
      }, 50); // 50ms * 100 = 5 seconds
    }
    return () => {
      clearInterval(timer);
    };
  }, [selectedStory]);

  // Helper to format post timestamps
  const formatPostTime = (timeStr) => {
    if (!timeStr) return "Just now";
    try {
      const date = new Date(timeStr);
      const seconds = Math.floor((new Date() - date) / 1000);
      if (seconds < 60) return "Just now";
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    } catch (e) {
      return "Recently";
    }
  };

  // Fetch posts from backend database
  const loadAllPosts = async () => {
    try {
      const res = await fetch("http://localhost:8080/posts", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (!res.ok) throw new Error("Failed to load posts");
      const data = await res.json();
      
      const normalizeComment = (c) => {
        if (!c) return null;
        return {
          id: c.commentId,
          username: c.username,
          avatar: c.userAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop",
          text: c.content,
          time: formatPostTime(c.createdAt),
          replies: (c.replies || []).map(r => normalizeComment(r))
        };
      };

      const normalized = data.map(p => ({
        id: p.post_id,
        user: {
          name: p.user?.full_name || p.user?.fullName || "Lumina Creator",
          username: p.user?.username || "creator",
          avatar: p.user?.profile_picture_url || p.user?.profilePictureUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop",
        },
        location: p.location || "",
        time: formatPostTime(p.created_at),
        mediaList: (p.media_list || []).map(m => ({
          mediaId: m.media_id || m.mediaId,
          mediaUrl: m.media_url || m.mediaUrl,
          mediaType: m.media_type || m.mediaType || "image/jpeg"
        })),
        likesCount: p.likes_count || 0,
        isLiked: p.is_liked || false,
        isBookmarked: false,
        caption: p.content || "",
        comments: (p.comments || []).map(c => normalizeComment(c)),
        showComments: false
      }));
      setPosts(normalized);
    } catch (err) {
      console.error("Error loading posts:", err);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  useEffect(() => {
    loadAllPosts();
  }, []);

  // Handle preview images / videos before post creation
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setSelectedFiles(prev => [...prev, ...files]);

    const newPreviews = files.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type,
      name: file.name
    }));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Action handlers
  const handleLikePost = async (postId) => {
    try {
      const response = await fetch("http://localhost:8080/likes/toggle", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetType: "post",
          targetId: postId
        })
      });

      if (!response.ok) {
        throw new Error("Failed to toggle like");
      }

      const data = await response.json();
      
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              isLiked: data.liked,
              likesCount: data.count
            };
          }
          return post;
        })
      );
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleBookmarkPost = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return { ...post, isBookmarked: !post.isBookmarked };
        }
        return post;
      })
    );
  };

  const toggleCommentsAccordion = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return { ...post, showComments: !post.showComments };
        }
        return post;
      })
    );
  };

  const handleAddComment = async (e, postId, commentText, parentCommentId = null) => {
    if (e) e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const response = await fetch(`http://localhost:8080/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: commentText.trim(),
          parentCommentId: parentCommentId
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to post comment");
      }

      await loadAllPosts();
      setActiveReplyCommentId(null);
    } catch (err) {
      alert("Error adding comment: " + err.message);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostCaption.trim()) return;

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("content", newPostCaption.trim());
    formData.append("location", newPostLocation.trim());

    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch("http://localhost:8080/posts", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload your post.");
      }

      setNewPostCaption("");
      setNewPostLocation("");
      setSelectedFiles([]);
      previews.forEach((p) => URL.revokeObjectURL(p.url));
      setPreviews([]);
      setShowCreateModal(false);

      // Refresh post list
      await loadAllPosts();
    } catch (err) {
      alert("Error sharing post: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePostMenu = (postId) => {
    setActivePostMenuId((prev) => (prev === postId ? null : postId));
  };

  const handleStartEditPost = (post) => {
    setEditingPost(post);
    setEditCaption(post.caption || "");
    setEditLocation(post.location || "");
    setShowEditModal(true);
    setActivePostMenuId(null);
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    if (!editCaption.trim() || !editingPost) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`http://localhost:8080/posts/${editingPost.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editCaption.trim(),
          location: editLocation.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update post.");
      }

      setShowEditModal(false);
      setEditingPost(null);
      setEditCaption("");
      setEditLocation("");
      
      // Refresh posts
      await loadAllPosts();
    } catch (err) {
      alert("Error updating post: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePostClick = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await fetch(`http://localhost:8080/posts/${postId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete post.");
      }

      // Close menu
      setActivePostMenuId(null);

      // Refresh posts
      await loadAllPosts();
    } catch (err) {
      alert("Error deleting post: " + err.message);
    }
  };

  const toggleFollowSuggestion = (suggestionId) => {
    setSuggestions((prev) =>
      prev.map((sugg) => {
        if (sugg.id === suggestionId) {
          return { ...sugg, isFollowing: !sugg.isFollowing };
        }
        return sugg;
      })
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.navigateTo("/");
  };

  // Expandable caption states
  const [expandedCaptions, setExpandedCaptions] = useState({});
  const toggleCaptionExpand = (postId) => {
    setExpandedCaptions((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const renderComment = (comment, postId) => {
    if (!comment) return null;
    return (
      <div key={comment.id} className="comment-thread-container">
        <div className="comment-row">
          <img
            src={comment.avatar}
            alt=""
            className="comment-avatar"
          />
          <div className="comment-bubble">
            <div>
              <span className="comment-user">{comment.username}</span>
              <span className="comment-text">{comment.text}</span>
            </div>
            <div className="comment-meta-actions">
              <span className="comment-time">{comment.time}</span>
              <button 
                type="button"
                className="comment-reply-btn"
                onClick={() => setActiveReplyCommentId(prev => prev === comment.id ? null : comment.id)}
              >
                Reply
              </button>
            </div>
          </div>
        </div>

        {/* Nested replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="comment-replies-list">
            {comment.replies.map(reply => renderComment(reply, postId))}
          </div>
        )}

        {/* Reply input field */}
        {activeReplyCommentId === comment.id && (
          <div className="reply-input-form-wrapper">
            <CommentForm
              placeholder={`Reply to @${comment.username}...`}
              onSubmitComment={(text) => handleAddComment(null, postId, text, comment.id)}
            />
          </div>
        )}
      </div>
    );
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
              src={currentUser?.profile_picture_url || currentUser?.profile_picture || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop"}
              alt="Profile avatar"
              className="sidebar-avatar"
            />
            <div className="sidebar-profile-info">
              <div className="sidebar-profile-name">{currentUser?.full_name || currentUser?.name || "Creator Profile"}</div>
              <div className="sidebar-profile-handle">@{currentUser?.username || "creator"}</div>
            </div>
            <button className="sidebar-logout-btn" onClick={handleLogout} title="Log Out">
              <LogOut className="size-5" />
            </button>
          </div>
        </aside>

        {/* CENTER COLUMN (Stories + Main Feed) */}
        <main className="main-feed-column">
          {/* Tabs for Home / For You */}
          <div className="feed-tabs">
            <div
              className={`feed-tab ${activeTab === "Home" ? "active" : ""}`}
              onClick={() => setActiveTab("Home")}
            >
              Home
            </div>
            <div
              className={`feed-tab ${activeTab === "For You" ? "active" : ""}`}
              onClick={() => setActiveTab("For You")}
            >
              For You
            </div>
          </div>

          {/* Stories Horizontal Bar */}
          <section className="stories-section">
            <div className="stories-carousel">
              {stories.map((story) => (
                <div
                  key={story.id}
                  className="story-item"
                  onClick={() => !story.isSelf && story.storyUrl && setSelectedStory(story)}
                >
                  <div className="story-ring-container">
                    <div
                      className={`story-ring-gradient ${
                        story.isLive
                          ? "story-ring-live"
                          : !story.storyUrl
                          ? "story-ring-none"
                          : ""
                      }`}
                    />
                    <img
                      src={story.avatar}
                      alt={story.username}
                      className="story-avatar-img"
                    />
                    {story.isSelf && (
                      <div className="story-self-add" onClick={() => setShowCreateModal(true)}>
                        +
                      </div>
                    )}
                    {story.isLive && <span className="story-live-badge">LIVE</span>}
                  </div>
                  <span className="story-user-name">{story.username}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Posts Feed Vertical List */}
          <section className="feed-posts-list">
            {posts.map((post) => {
              const isExpanded = !!expandedCaptions[post.id];
              const shouldShowMoreButton = post.caption.length > 90;
              const displayedCaption = isExpanded
                ? post.caption
                : post.caption.substring(0, 90);

              return (
                <article key={post.id} className="feed-card-item">
                  {/* Card Header */}
                  <div className="card-header">
                    <div
                      className="card-header-left"
                      style={{ cursor: "pointer" }}
                      onClick={() => window.navigateTo(`/profile?username=${post.user.username}`)}
                    >
                      <img
                        src={post.user.avatar}
                        alt={`${post.user.name}'s avatar`}
                        className="user-avatar-circle"
                      />
                      <div>
                        <div className="user-name-title">{post.user.name}</div>
                        <div className="post-meta-row">
                          <span>@{post.user.username}</span>
                          <span>•</span>
                          <span>{post.time}</span>
                          <span>•</span>
                          <Globe className="size-3" />
                        </div>
                      </div>
                    </div>
                    <div className="post-options-container">
                      <button 
                        className="card-header-right-btn" 
                        aria-label="More options"
                        onClick={() => togglePostMenu(post.id)}
                      >
                        <MoreHorizontal className="size-5" />
                      </button>

                      {activePostMenuId === post.id && (
                        <div className="post-options-menu">
                          {currentUser?.username === post.user.username ? (
                            <>
                              <button type="button" onClick={() => handleStartEditPost(post)}>Edit Post</button>
                              <button type="button" onClick={() => handleDeletePostClick(post.id)} className="delete-option">Delete Post</button>
                            </>
                          ) : (
                            <button type="button" onClick={() => alert("Reported post successfully")}>Report Post</button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Post Media Image / Carousel */}
                  <div className="post-media-container">
                    {post.mediaList && post.mediaList.length > 0 ? (
                      post.mediaList.length === 1 ? (
                        /* Single media view */
                        post.mediaList[0].mediaType.startsWith("video/") ? (
                          <video
                            src={post.mediaList[0].mediaUrl}
                            controls
                            className="post-media-video w-full"
                            style={{ maxHeight: "520px", objectFit: "cover" }}
                          />
                        ) : (
                          <img
                            src={post.mediaList[0].mediaUrl}
                            alt="Post media content"
                            className="post-media-img"
                            loading="lazy"
                          />
                        )
                      ) : (
                        /* Instagram-style multiple files carousel view */
                        <div className="post-carousel-wrapper">
                          <div
                            className="post-carousel-track"
                            style={{
                              transform: `translateX(-${(carouselIndices[post.id] || 0) * 100}%)`,
                              transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                              display: "flex",
                              width: `${post.mediaList.length * 100}%`
                            }}
                          >
                            {post.mediaList.map((media, idx) => (
                              <div
                                key={media.mediaId || idx}
                                className="post-carousel-slide"
                                style={{ width: `${100 / post.mediaList.length}%` }}
                              >
                                {media.mediaType.startsWith("video/") ? (
                                  <video
                                    src={media.mediaUrl}
                                    controls
                                    className="w-full h-full object-cover"
                                    style={{ maxHeight: "520px" }}
                                  />
                                ) : (
                                  <img
                                    src={media.mediaUrl}
                                    alt={`Post slide ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                    style={{ maxHeight: "520px" }}
                                    loading="lazy"
                                  />
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Left Arrow */}
                          {(carouselIndices[post.id] || 0) > 0 && (
                            <button
                              className="carousel-nav-btn prev"
                              onClick={() =>
                                setCarouselIndices((prev) => ({
                                  ...prev,
                                  [post.id]: Math.max((prev[post.id] || 0) - 1, 0)
                                }))
                              }
                              aria-label="Previous slide"
                            >
                              <ChevronLeft className="size-4" />
                            </button>
                          )}

                          {/* Right Arrow */}
                          {(carouselIndices[post.id] || 0) < post.mediaList.length - 1 && (
                            <button
                              className="carousel-nav-btn next"
                              onClick={() =>
                                setCarouselIndices((prev) => ({
                                  ...prev,
                                  [post.id]: Math.min((prev[post.id] || 0) + 1, post.mediaList.length - 1)
                                }))
                              }
                              aria-label="Next slide"
                            >
                              <ChevronRight className="size-4" />
                            </button>
                          )}

                          {/* Dots Indicators */}
                          <div className="carousel-dots-indicator">
                            {post.mediaList.map((_, idx) => (
                              <span
                                key={idx}
                                className={`carousel-dot ${
                                  (carouselIndices[post.id] || 0) === idx ? "active" : ""
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      )
                    ) : (
                      /* Fallback mock post image */
                      <img
                        src={post.imageUrl}
                        alt="Post content"
                        className="post-media-img"
                        loading="lazy"
                      />
                    )}
                  </div>

                  {/* Interactions Button Bar */}
                  <div className="card-interactions">
                    <div className="interaction-group">
                      <button
                        className={`interaction-btn like-btn ${post.isLiked ? "active" : ""}`}
                        onClick={() => handleLikePost(post.id)}
                      >
                        <Heart className="size-5" />
                        <span>{post.likesCount}</span>
                      </button>
                      <button
                        className="interaction-btn"
                        onClick={() => toggleCommentsAccordion(post.id)}
                      >
                        <MessageCircle className="size-5" />
                        <span>{post.comments.length}</span>
                      </button>
                      <button className="interaction-btn" aria-label="Send post">
                        <Send className="size-5" />
                      </button>
                    </div>

                    <button
                      className={`interaction-btn bookmark-btn ${post.isBookmarked ? "active" : ""}`}
                      onClick={() => handleBookmarkPost(post.id)}
                      aria-label="Bookmark post"
                    >
                      <Bookmark className="size-5" />
                    </button>
                  </div>

                  {/* Likes indicator */}
                  <div className="likes-indicator">
                    <div className="likes-avatar-stack">
                      <img
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&auto=format&fit=crop"
                        className="likes-stack-avatar"
                        alt=""
                      />
                      <img
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&auto=format&fit=crop"
                        className="likes-stack-avatar"
                        alt=""
                      />
                    </div>
                    <span className="likes-text">
                      Liked by <strong>randybchtr</strong> and {post.likesCount - 1} others
                    </span>
                  </div>

                  {/* Caption */}
                  <div className="card-caption-block">
                    <span className="caption-username">{post.user.username}</span>
                    <span>{displayedCaption}</span>
                    {shouldShowMoreButton && (
                      <button
                        className="caption-toggle-more"
                        onClick={() => toggleCaptionExpand(post.id)}
                      >
                        {isExpanded ? "less" : "...more"}
                      </button>
                    )}
                  </div>

                  {/* Comments accordion drawer */}
                  {post.showComments && (
                    <div className="post-comments-section">
                      <div className="comments-scroller">
                        {post.comments.length === 0 ? (
                          <div className="text-center py-4 text-xs text-foreground/40">
                            No comments yet. Start the conversation!
                          </div>
                        ) : (
                          post.comments.map((comment) => renderComment(comment, post.id))
                        )}
                      </div>

                      {/* Add comment form */}
                      <CommentForm
                        onSubmitComment={(text) => handleAddComment(null, post.id, text, null)}
                      />
                    </div>
                  )}
                </article>
              );
            })}
          </section>
        </main>

        {/* RIGHT SIDEBAR (Search, Trends, Follows) */}
        <aside className="sidebar-right">
          {/* Search bar */}
          <div className="search-bar-container">
            <Search className="size-4" />
            <input
              type="text"
              placeholder="Search vibe..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Trends panel */}
          <div className="right-sidebar-panel">
            <h3 className="panel-title">Trending Vibes</h3>
            <div className="trends-list">
              {[
                { category: "Creator Tech", tag: "#LuminaVibe", volume: "125K posts" },
                { category: "Design • Trending", tag: "#LimeNeonStyle", volume: "84K posts" },
                { category: "Travel", tag: "#BaliCafes", volume: "42K posts" },
                { category: "Entertainment", tag: "#DoomScrollFree", volume: "19K posts" },
              ].map((trend) => (
                <div key={trend.tag} className="trend-item-row">
                  <span className="trend-category">{trend.category}</span>
                  <span className="trend-tag-name">{trend.tag}</span>
                  <span className="trend-volume">{trend.volume}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Who to Follow panel */}
          <div className="right-sidebar-panel">
            <h3 className="panel-title">Who to Follow</h3>
            <div className="follow-suggestions-list">
              {suggestions.map((sugg) => (
                <div key={sugg.id} className="suggestion-row">
                  <div className="suggestion-left">
                    <img
                      src={sugg.avatar}
                      alt={sugg.name}
                      className="suggestion-avatar"
                    />
                    <div className="suggestion-info">
                      <span className="suggestion-name">{sugg.name}</span>
                      <span className="suggestion-handle">@{sugg.handle}</span>
                    </div>
                  </div>
                  <button
                    className={`btn-follow-action ${sugg.isFollowing ? "following" : "follow"}`}
                    onClick={() => toggleFollowSuggestion(sugg.id)}
                  >
                    {sugg.isFollowing ? "Following" : "Follow"}
                  </button>
                </div>
              ))}
            </div>
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

      {/* MODAL: CREATE POST */}
      {showCreateModal && (
        <div className="modal-overlay-bg" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Create New Vibe</span>
              <button className="modal-close-btn" onClick={() => setShowCreateModal(false)}>
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost}>
              <div className="form-field-wrapper">
                <label className="form-label-title">Caption</label>
                <textarea
                  className="form-textarea"
                  placeholder="What is the vibe today? Add hashtags..."
                  value={newPostCaption}
                  onChange={(e) => setNewPostCaption(e.target.value)}
                  required
                />
              </div>

              <div className="form-field-wrapper">
                <label className="form-label-title">Photos or Videos (Select multiple if desired)</label>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="form-text-input"
                  style={{ display: "none" }}
                  id="post-file-upload-input"
                />
                <button
                  type="button"
                  onClick={() => document.getElementById("post-file-upload-input").click()}
                  className="form-text-input text-left flex items-center justify-between"
                  style={{ 
                    background: darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", 
                    color: darkMode ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)",
                    borderColor: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"
                  }}
                >
                  <span>Select media files...</span>
                  <span className="text-[10px] bg-indigo-600 text-white py-1 px-2.5 rounded-md font-semibold">Browse</span>
                </button>

                {/* Horizontal Scrollable Previews list */}
                {previews.length > 0 && (
                  <div className="create-post-previews-bar mt-3">
                    {previews.map((prev, idx) => (
                      <div key={idx} className="create-post-preview-card">
                        {prev.type.startsWith("video/") ? (
                          <video src={prev.url} className="w-full h-full object-cover" />
                        ) : (
                          <img src={prev.url} alt="" className="w-full h-full object-cover" />
                        )}
                        <button
                          type="button"
                          className="create-post-preview-remove"
                          onClick={() => removeFile(idx)}
                          aria-label="Remove media"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-field-wrapper">
                <label className="form-label-title">Location</label>
                <input
                  type="text"
                  className="form-text-input"
                  placeholder="e.g. Jakarta, Indonesia"
                  value={newPostLocation}
                  onChange={(e) => setNewPostLocation(e.target.value)}
                />
              </div>

              <div className="form-submit-btn-bar">
                <button
                  type="submit"
                  className="btn-submit-post"
                  disabled={isSubmitting || !newPostCaption.trim()}
                >
                  <Sparkles className="size-4" />
                  {isSubmitting ? "Uploading Vibe..." : "Share Vibe"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT POST */}
      {showEditModal && editingPost && (
        <div className="modal-overlay-bg" onClick={() => { setShowEditModal(false); setEditingPost(null); }}>
          <div className="modal-content-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Edit Vibe</span>
              <button className="modal-close-btn" onClick={() => { setShowEditModal(false); setEditingPost(null); }}>
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleUpdatePost}>
              <div className="form-field-wrapper">
                <label className="form-label-title">Caption</label>
                <textarea
                  className="form-textarea"
                  placeholder="Update your caption..."
                  value={editCaption}
                  onChange={(e) => setEditCaption(e.target.value)}
                  required
                />
              </div>

              <div className="form-field-wrapper">
                <label className="form-label-title">Location</label>
                <input
                  type="text"
                  className="form-text-input"
                  placeholder="e.g. Jakarta, Indonesia"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                />
              </div>

              <div className="form-submit-btn-bar">
                <button
                  type="submit"
                  className="btn-submit-post"
                  disabled={isSubmitting || !editCaption.trim()}
                >
                  <Sparkles className="size-4" />
                  {isSubmitting ? "Updating Vibe..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: STORIES VIEWER */}
      {selectedStory && (
        <div className="modal-overlay-bg" onClick={() => setSelectedStory(null)}>
          <div className="story-viewer-content" onClick={(e) => e.stopPropagation()}>
            {/* Story progress ticks */}
            <div className="story-progress-bar-list">
              <div className="story-progress-bar-bg">
                <div
                  className="story-progress-bar-fill active"
                  style={{ animationDuration: "5s" }}
                />
              </div>
            </div>

            {/* Viewer Header */}
            <div className="story-viewer-header">
              <div className="story-viewer-user">
                <img
                  src={selectedStory.avatar}
                  alt=""
                  className="story-viewer-avatar"
                />
                <div>
                  <div className="story-viewer-name">{selectedStory.username}</div>
                  <div className="story-viewer-time">Active Now</div>
                </div>
              </div>
              <button className="story-viewer-close" onClick={() => setSelectedStory(null)}>
                <X className="size-5" />
              </button>
            </div>

            {selectedStory.isLive && (
              <span className="story-viewer-live-badge">LIVE VIEWER</span>
            )}

            {/* Viewer Media */}
            <div className="story-viewer-media-panel">
              <img
                src={selectedStory.storyUrl}
                alt={`${selectedStory.username}'s story`}
                className="story-viewer-img"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-component for adding comments with its own text field state
function CommentForm({ onSubmitComment, placeholder = "Write a comment..." }) {
  const [commentText, setCommentText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onSubmitComment(commentText);
    setCommentText("");
  };

  return (
    <form onSubmit={handleSubmit} className="comment-input-form">
      <input
        type="text"
        placeholder={placeholder}
        className="comment-input-field"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
      />
      <button
        type="submit"
        className="comment-submit-btn"
        disabled={!commentText.trim()}
      >
        Post
      </button>
    </form>
  );
}
