import { useState, useEffect, useCallback } from "react";
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
  Settings,
  X,
  Globe,
  User,
  Sparkles,
  Check,
} from "lucide-react";
import "../assets/styles/Feed.css";
import "../assets/styles/Explore.css";
import logoIcon from "../assets/icons/logo-icon.jpg";

export default function ExplorePage() {
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
      fullName: "Creator Prime",
      profilePictureUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop",
    };
  });

  const [activeNav, setActiveNav] = useState("Explore");
  const [activeTab, setActiveTab] = useState("Trending");

  // Search input & backend results state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // Lightbox modal state
  const [selectedPost, setSelectedPost] = useState(null);

  // Mock post follow states (for suggestions)
  const [suggestions, setSuggestions] = useState([
    { id: 1, name: "Randy Bachtiar", handle: "randybchtr", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop", isFollowing: false },
    { id: 2, name: "Sarah Connor", handle: "sarah_c", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop", isFollowing: false },
  ]);

  // Explore grid mock posts
  const explorePosts = [
    {
      id: 1,
      title: "Cozy Studio Aesthetic",
      category: "Aesthetics",
      imageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop",
      creator: { name: "Claire GD", handle: "calire.gd", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop" },
      likes: 1240,
      comments: 320,
      layoutClass: "tall",
      caption: "Sipping matcha and editing some scenic photos. Cozy studio setups are always the biggest vibe! 🍵💻✨"
    },
    {
      id: 2,
      title: "Setup Lights Check",
      category: "Tech",
      imageUrl: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&auto=format&fit=crop",
      creator: { name: "Akmal Nasrullah", handle: "akmalnsrllh", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop" },
      likes: 832,
      comments: 98,
      layoutClass: "normal",
      caption: "Vivid desk lighting sets the workspace tone. Purple and neon lime contrasts are hit hits right now! 💡⌨️"
    },
    {
      id: 3,
      title: "Neon Streets After Hours",
      category: "Trending",
      imageUrl: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&auto=format&fit=crop",
      creator: { name: "Aditya Prasodjo", handle: "aditya_prasodjo", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop" },
      likes: 3102,
      comments: 420,
      layoutClass: "wide",
      caption: "Lost in the neon flow of Surabaya nights. Rainy streets produce some of the most cinematic reflections. 🎬🌧️"
    },
    {
      id: 4,
      title: "Vibe Playlists Cover",
      category: "Music",
      imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop",
      creator: { name: "Rian D", handle: "riand_sound", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop" },
      likes: 412,
      comments: 29,
      layoutClass: "normal",
      caption: "Late night DJ sets and lo-fi playlist beats. Turn up the base and vibe out. 🎧🎛️🎵"
    },
    {
      id: 5,
      title: "Mechanical Keyboards",
      category: "Tech",
      imageUrl: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop",
      creator: { name: "Key Vibes", handle: "keyboard_art", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop" },
      likes: 914,
      comments: 110,
      layoutClass: "normal",
      caption: "Clicky blue switches or buttery linear yellow switches? Building my new custom keyboard deck today. ⌨️💛"
    },
    {
      id: 6,
      title: "Gaming RGB Rig",
      category: "Gaming",
      imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop",
      creator: { name: "Esports Hub", handle: "esports_hub", avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop" },
      likes: 2154,
      comments: 312,
      layoutClass: "tall",
      caption: "Battlestation values are ready! Ready to stream tonight's championship matches. Tune in. 🎮🏆✨"
    },
    {
      id: 7,
      title: "Lo-fi Coffee Vibe",
      category: "Aesthetics",
      imageUrl: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=800&auto=format&fit=crop",
      creator: { name: "Claire GD", handle: "calire.gd", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop" },
      likes: 934,
      comments: 64,
      layoutClass: "wide",
      caption: "Warm shadows and hot coffee drafts. Sketching ideas for the next creator drops. ☕🎨"
    }
  ];

  // Backend Search Effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsSearching(true);
      setSearchError(null);
      try {
        const response = await fetch(`http://localhost:8080/users/search?query=${encodeURIComponent(searchQuery)}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Failed to load user search results.");
        }

        const data = await response.json();
        // Add follow toggle status property dynamically
        const processed = await Promise.all(data.map(async (u) => {
          if (u.userId === currentUser.userId) {
            return { ...u, followStatus: "SELF" };
          }
          try {
            const statusRes = await fetch(`http://localhost:8080/follows/status/${u.userId}`, {
              headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
            if (statusRes.ok) {
              const statusData = await statusRes.json();
              return { ...u, followStatus: statusData.status };
            }
          } catch (e) {}
          return { ...u, followStatus: "NOT_FOLLOWING" };
        }));
        setSearchResults(processed);
      } catch (err) {
        setSearchError(err.message);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const toggleSearchFollow = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/follows/toggle/${userId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (response.ok) {
        const statusRes = await fetch(`http://localhost:8080/follows/status/${userId}`, {
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        if (statusRes.ok) {
          const statusData = await statusRes.json();
          setSearchResults(prev =>
            prev.map(user => {
              if (user.userId === userId) {
                return { ...user, followStatus: statusData.status };
              }
              return user;
            })
          );
        }
      }
    } catch (err) {
      console.error("Error toggling follow from search results:", err);
    }
  };

  const toggleSuggestionFollow = (id) => {
    setSuggestions(prev =>
      prev.map(s => {
        if (s.id === id) {
          return { ...s, isFollowing: !s.isFollowing };
        }
        return s;
      })
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.navigateTo("/");
  };

  // Filter explore posts by active category
  const filteredPosts = explorePosts.filter(post => 
    activeTab === "Trending" || post.category === activeTab
  );

  return (
    <div className="feed-page-container explore-page-container">
      {/* MOBILE TOP HEADER */}
      <header className="mobile-top-header">
        <span className="mobile-logo">
          LuminaVibe<span className="sidebar-logo-dot">.</span>
        </span>
        <div className="mobile-header-actions">
          <button className="icon-badge-btn" aria-label="Notifications">
            <Bell className="size-5" />
            <span className="icon-badge">3</span>
          </button>
          <button className="icon-badge-btn" aria-label="Messages">
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
                  } else if (item.name === "Profile") {
                    window.navigateTo("/profile");
                  } else if (item.name === "Settings") {
                    window.navigateTo("/settings");
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
              <div className="sidebar-profile-name">{currentUser?.fullName || currentUser?.name || "Creator Profile"}</div>
              <div className="sidebar-profile-handle">@{currentUser?.username || "creator"}</div>
            </div>
            <button className="sidebar-logout-btn" onClick={handleLogout} title="Log Out">
              <LogOut className="size-5" />
            </button>
          </div>
        </aside>

        {/* CENTER COLUMN (Search Bar + Category Filters + Masonry Grid) */}
        <main className="explore-main-column">
          {/* Sticky Search bar */}
          <div className="explore-search-header">
            <div className="explore-search-box">
              <Search className="size-5" />
              <input
                type="text"
                placeholder="Search username or full name..."
                className="explore-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-1 hover:text-white"
                  aria-label="Clear search"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          </div>

          {/* DYNAMIC USER SEARCH RESULTS SECTION */}
          {searchQuery && (
            <div className="search-results-section">
              <h3 className="search-results-title">User Results</h3>
              {isSearching ? (
                <div className="text-center py-6 text-sm text-muted-foreground">
                  Searching profiles...
                </div>
              ) : searchError ? (
                <div className="text-center py-6 text-sm text-destructive">
                  Error: {searchError}
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-6 text-sm text-muted-foreground">
                  No creators found for "{searchQuery}"
                </div>
              ) : (
                <div className="search-results-list">
                  {searchResults.map((user) => (
                    <div key={user.userId} className="search-user-card">
                      <div
                        className="search-user-left"
                        style={{ cursor: "pointer" }}
                        onClick={() => window.navigateTo(`/profile?username=${user.username}`)}
                      >
                        <img
                          src={user.profile_picture_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop"}
                          alt=""
                          className="search-user-avatar"
                        />
                        <div className="search-user-details">
                          <span className="search-user-fullname">{user.full_name || user.fullName || "Lumina Creator"}</span>
                          <span className="search-user-username">@{user.username}</span>
                          {user.bio && <p className="search-user-bio">{user.bio}</p>}
                        </div>
                      </div>
                      {user.followStatus !== "SELF" && (
                        <button
                          className={`btn-follow-action ${user.followStatus !== "NOT_FOLLOWING" ? "following" : "follow"}`}
                          onClick={() => toggleSearchFollow(user.userId)}
                        >
                          {user.followStatus === "ACCEPTED" ? "Following" : user.followStatus === "PENDING" ? "Requested" : "Follow"}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Category Tabs list */}
          <div className="explore-tabs-bar">
            {["Trending", "Aesthetics", "Tech", "Music", "Gaming"].map((category) => (
              <button
                key={category}
                className={`explore-category-tab ${activeTab === category ? "active" : ""}`}
                onClick={() => setActiveTab(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Pinterest/Instagram Media Grid */}
          <section className="explore-grid-container">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className={`explore-grid-item ${post.layoutClass}`}
                onClick={() => setSelectedPost(post)}
              >
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="explore-grid-img"
                  loading="lazy"
                />
                <div className="explore-grid-overlay">
                  <div className="explore-overlay-title">
                    <Sparkles className="size-4 text-primary" />
                    <span>{post.title}</span>
                  </div>
                  <div className="explore-overlay-stats">
                    <span className="explore-stat">
                      <Heart className="size-3.5 fill-white" />
                      {post.likes}
                    </span>
                    <span className="explore-stat">
                      <MessageCircle className="size-3.5 fill-white" />
                      {post.comments}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </section>
        </main>

        {/* RIGHT SIDEBAR (Trending / Suggested Users) */}
        <aside className="sidebar-right">
          {/* Trending Vibes */}
          <div className="right-sidebar-panel">
            <h3 className="panel-title">Trending Vibes</h3>
            <div className="trends-list">
              {[
                { category: "Creator Tech", tag: "#LuminaVibe", volume: "125K posts" },
                { category: "Design • Trending", tag: "#LimeNeonStyle", volume: "84K posts" },
                { category: "Travel", tag: "#BaliCafes", volume: "42K posts" },
              ].map((trend) => (
                <div key={trend.tag} className="trend-item-row">
                  <span className="trend-category">{trend.category}</span>
                  <span className="trend-tag-name">{trend.tag}</span>
                  <span className="trend-volume">{trend.volume}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested creators */}
          <div className="right-sidebar-panel">
            <h3 className="panel-title">Suggested Creators</h3>
            <div className="follow-suggestions-list">
              {suggestions.map((sugg) => (
                <div key={sugg.id} className="suggestion-row">
                  <div className="suggestion-left">
                    <img
                      src={sugg.avatar}
                      alt=""
                      className="suggestion-avatar"
                    />
                    <div className="suggestion-info">
                      <span className="suggestion-name">{sugg.name}</span>
                      <span className="suggestion-handle">@{sugg.handle}</span>
                    </div>
                  </div>
                  <button
                    className={`btn-follow-action ${sugg.isFollowing ? "following" : "follow"}`}
                    onClick={() => toggleSuggestionFollow(sugg.id)}
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

      {/* LIGHTBOX POPUP MODAL */}
      {selectedPost && (
        <div className="lightbox-modal-overlay" onClick={() => setSelectedPost(null)}>
          <div className="lightbox-modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Expanded Media Image */}
            <div className="lightbox-image-panel">
              <img
                src={selectedPost.imageUrl}
                alt={selectedPost.title}
                className="lightbox-expanded-img"
              />
            </div>

            {/* Information panel */}
            <div className="lightbox-details-panel">
              <div>
                <div className="lightbox-creator-row">
                  <div className="lightbox-creator-left">
                    <img
                      src={selectedPost.creator.avatar}
                      alt=""
                      className="lightbox-creator-avatar"
                    />
                    <div>
                      <div className="lightbox-creator-name">{selectedPost.creator.name}</div>
                      <div className="lightbox-creator-handle">@{selectedPost.creator.handle}</div>
                    </div>
                  </div>
                  <button className="lightbox-close-btn" onClick={() => setSelectedPost(null)}>
                    <X className="size-5" />
                  </button>
                </div>

                <div className="lightbox-caption-box">
                  <h4 className="lightbox-caption-title">{selectedPost.title}</h4>
                  <p className="lightbox-caption-text">{selectedPost.caption}</p>
                </div>
              </div>

              <div className="lightbox-action-row">
                <div className="flex gap-4">
                  <button className="interaction-btn active">
                    <Heart className="size-5 fill-red-500 text-red-500" />
                    <span>{selectedPost.likes}</span>
                  </button>
                  <button className="interaction-btn">
                    <MessageCircle className="size-5" />
                    <span>{selectedPost.comments}</span>
                  </button>
                </div>
                <button className="interaction-btn" aria-label="Share post">
                  <Send className="size-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
