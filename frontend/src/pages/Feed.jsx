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

  // Search input state
  const [searchQuery, setSearchQuery] = useState("");

  // Create post modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPostCaption, setNewPostCaption] = useState("");
  const [newPostImage, setNewPostImage] = useState("");
  const [newPostLocation, setNewPostLocation] = useState("");

  // Stories viewer state
  const [selectedStory, setSelectedStory] = useState(null);
  const [storyProgress, setStoryProgress] = useState(0);

  // Suggested follow list state
  const [suggestions, setSuggestions] = useState([
    { id: 1, name: "Randy Bachtiar", handle: "randybchtr", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop", isFollowing: false },
    { id: 2, name: "Sarah Connor", handle: "sarah_c", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop", isFollowing: false },
    { id: 3, name: "Calvin Klein", handle: "calvin_k", avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop", isFollowing: true },
  ]);

  // Feed posts state
  const [posts, setPosts] = useState([
    {
      id: 101,
      user: {
        name: "Akmal Nasrullah",
        username: "akmalnsrllh",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop",
      },
      location: "Bekasi",
      time: "1 mins ago",
      imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop",
      likesCount: 349,
      isLiked: false,
      isBookmarked: false,
      caption: "When life gives you limes, arrange them in a zesty flatlay and create a 'lime-light' masterpiece! Flatlays are always a vibe.",
      comments: [
        { id: 1, username: "randybchtr", text: "Wow, this looks fresh and zesty!", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop", time: "1m ago" },
        { id: 2, username: "calista33", text: "Love the yellow aesthetic!", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop", time: "2m ago" }
      ],
      showComments: false,
    },
    {
      id: 102,
      user: {
        name: "Claire GD",
        username: "calire.gd",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop",
      },
      location: "Bali, Indonesia",
      time: "2 hours ago",
      imageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop",
      likesCount: 1420,
      isLiked: true,
      isBookmarked: true,
      caption: "Coffee first, schemes later. Cozy cafes in Bali always inspire the best creations. Who is down for a coffee chat this weekend? ☕✨",
      comments: [
        { id: 1, username: "azizahrh", text: "Save a cup of cold brew for me!", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop", time: "1h ago" }
      ],
      showComments: false,
    },
    {
      id: 103,
      user: {
        name: "Aditya Prasodjo",
        username: "aditya_prasodjo",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop",
      },
      location: "Surabaya, Indonesia",
      time: "5 hours ago",
      imageUrl: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&auto=format&fit=crop",
      likesCount: 9812,
      isLiked: false,
      isBookmarked: false,
      caption: "Lost in the neon glow of Surabaya nights. Filmmaking in the rainy weather produces some of the most cinematic shots. 🎬🌧️",
      comments: [],
      showComments: false,
    }
  ]);

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

  // Action handlers
  const handleLikePost = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const isLikedNow = !post.isLiked;
          return {
            ...post,
            isLiked: isLikedNow,
            likesCount: isLikedNow ? post.likesCount + 1 : post.likesCount - 1,
          };
        }
        return post;
      })
    );
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

  const handleAddComment = (e, postId, commentText) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const newComment = {
            id: Date.now(),
            username: currentUser.username || "me",
            avatar: currentUser.profile_picture_url || currentUser.profile_picture || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop",
            text: commentText,
            time: "Just now",
          };
          return {
            ...post,
            comments: [...post.comments, newComment],
          };
        }
        return post;
      })
    );
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostCaption.trim()) return;

    // Default image if user hasn't provided one
    const imageToUse = newPostImage.trim() || "https://images.unsplash.com/photo-1472289065668-ce650ac443d2?w=800&auto=format&fit=crop";

    const newPost = {
      id: Date.now(),
      user: {
        name: currentUser.full_name || currentUser.name || "My Creator Account",
        username: currentUser.username || "creator_profile",
        avatar: currentUser.profile_picture_url || currentUser.profile_picture || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop",
      },
      location: newPostLocation.trim() || "World Grid",
      time: "Just now",
      imageUrl: imageToUse,
      likesCount: 0,
      isLiked: false,
      isBookmarked: false,
      caption: newPostCaption,
      comments: [],
      showComments: false,
    };

    setPosts([newPost, ...posts]);
    setNewPostCaption("");
    setNewPostImage("");
    setNewPostLocation("");
    setShowCreateModal(false);
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

  return (
    <div className="feed-page-container">
      {/* MOBILE TOP HEADER */}
      <header className="mobile-top-header">
        <div className="flex items-center gap-2">
          <img src={logoIcon} alt="" className="size-7 rounded-lg object-cover" />
          <span className="mobile-logo">
            LuminaVibe<span className="sidebar-logo-dot">.</span>
          </span>
        </div>
        <div className="mobile-header-actions">
          <button className="icon-badge-btn" aria-label="Notifications">
            <Bell className="size-5" />
            <span className="icon-badge">3</span>
          </button>
          <button className="icon-badge-btn" aria-label="Messages" onClick={() => setActiveNav("Messages")}>
            <MessageSquare className="size-5" />
            <span className="icon-badge">5</span>
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
              { name: "Home", icon: <Home className="size-5" /> },
              { name: "Explore", icon: <Compass className="size-5" /> },
              { name: "Notifications", icon: <Bell className="size-5" /> },
              { name: "Messages", icon: <MessageSquare className="size-5" /> },
              { name: "Profile", icon: <User className="size-5" /> },
              { name: "Settings", icon: <Settings className="size-5" /> },
            ].map((item) => (
              <div
                key={item.name}
                className={`sidebar-nav-item ${activeNav === item.name ? "active" : ""}`}
                onClick={() => {
                  setActiveNav(item.name);
                  if (item.name === "Home") {
                    window.navigateTo("/feed");
                  } else if (item.name === "Explore") {
                    window.navigateTo("/explore");
                  }
                }}
              >
                {item.icon}
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
                    <div className="card-header-left">
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
                    <button className="card-header-right-btn" aria-label="More options">
                      <MoreHorizontal className="size-5" />
                    </button>
                  </div>

                  {/* Card Post Media Image */}
                  <div className="post-media-container">
                    <img
                      src={post.imageUrl}
                      alt="Post content"
                      className="post-media-img"
                      loading="lazy"
                    />
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
                          post.comments.map((comment) => (
                            <div key={comment.id} className="comment-row">
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
                                <span className="comment-time">{comment.time}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Add comment form */}
                      <CommentForm
                        onSubmitComment={(text) => handleAddComment(event, post.id, text)}
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
          onClick={() => setActiveNav("Notifications")}
          aria-label="Notifications"
        >
          <Bell className="size-5" />
        </button>
        <button
          className={`mobile-nav-btn ${activeNav === "Profile" ? "active" : ""}`}
          onClick={() => {
            setActiveNav("Profile");
            // If mobile user clicks profile, we could also give them a logout option
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
                <label className="form-label-title">Image URL (Optional)</label>
                <input
                  type="url"
                  className="form-text-input"
                  placeholder="Paste a photo URL (e.g. from Unsplash)"
                  value={newPostImage}
                  onChange={(e) => setNewPostImage(e.target.value)}
                />
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
                  disabled={!newPostCaption.trim()}
                >
                  <Sparkles className="size-4" />
                  Share Vibe
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
function CommentForm({ onSubmitComment }) {
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
        placeholder="Write a comment..."
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
