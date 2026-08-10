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
  LogOut,
  Settings,
  X,
  Sparkles,
  Camera,
  User,
  Check,
  ChevronLeft,
  Users,
  Award,
  BarChart2,
  Globe,
} from "lucide-react";
import "../assets/styles/Feed.css";
import "../assets/styles/Profile.css";
import logoIcon from "../assets/icons/logo-icon.jpg";

export default function ProfilePage() {
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
      userId: 0,
      username: "creator_prime",
      fullName: "Creator Prime",
      profilePictureUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop",
      bio: "🏀 Basketball Addict | ⛹️ Point Guard\n💪 Training daily | MVP in local league\n🌠 Dreaming of the WNBA 🌟\n💻 Highlights & tips | Stay motivated!",
    };
  });

  const [activeNav, setActiveNav] = useState("Profile");
  const [activeTab, setActiveTab] = useState("About");

  // Edit profile form states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(currentUser?.full_name || currentUser?.fullName || "");
  const [editUsername, setEditUsername] = useState(currentUser?.username || "");
  const [editBio, setEditBio] = useState(currentUser?.bio || "");
  const [editAvatarUrl, setEditAvatarUrl] = useState(currentUser?.profile_picture_url || currentUser?.profile_picture || "");

  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Avatar upload states
  const fileInputRef = useRef(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Followers/Following Overlay list modal states
  const [showListModal, setShowListModal] = useState(false);
  const [listModalTitle, setListModalTitle] = useState("");
  const [listModalUsers, setListModalUsers] = useState([]);

  // Lightbox modal state
  const [selectedPost, setSelectedPost] = useState(null);

  // Suggested followers
  const [suggestedFollowers] = useState([
    { id: 1, name: "Randy Bachtiar", handle: "randybchtr", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop" },
    { id: 2, name: "Sarah Connor", handle: "sarah_c", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop" },
    { id: 3, name: "Calire GD", handle: "calire.gd", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop" },
  ]);

  const [followingList, setFollowingList] = useState([
    { id: 4, name: "Akmal Nasrullah", handle: "akmalnsrllh", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop" },
    { id: 5, name: "Aditya Prasodjo", handle: "aditya_prasodjo", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop" },
  ]);

  // Mock User Posts
  const userPosts = [
    { id: 1, title: "Training Session", imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&auto=format&fit=crop", likes: 843, comments: 120, caption: "Court views tonight. Working on three-point releases and acceleration drills. 💪🏀" },
    { id: 2, title: "Match Day", imageUrl: "https://images.unsplash.com/photo-1519766304817-4f37bda74a27?w=600&auto=format&fit=crop", likes: 1102, comments: 245, caption: "Championship playoffs! Team chemistry was on point today. MVP vibes. 🏆🔥" },
    { id: 3, title: "Pre-Game Fuel", imageUrl: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=600&auto=format&fit=crop", likes: 432, comments: 40, caption: "Healthy breakfast fuel: double espresso and oatmeal before court setup. ☕🍳" },
    { id: 4, title: "New Sneakers", imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop", likes: 984, comments: 189, caption: "Unboxing these custom basketball treads. The neon contrasts are hit hits! 👟✨" },
  ];

  // Mock Bookmarked Posts
  const bookmarkedPosts = [
    { id: 101, title: "Cozy Studio Setup", imageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop", likes: 1420, comments: 320, caption: "Inspirational workspace colors from calire.gd. Neon layouts are a vibe." },
    { id: 102, title: "Surabaya Rainy Lights", imageUrl: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&auto=format&fit=crop", likes: 9812, comments: 412, caption: "Cinematic neon reflection values." },
  ];

  // Refresh profile details on load
  useEffect(() => {
    setEditName(currentUser?.full_name || currentUser?.fullName || "");
    setEditUsername(currentUser?.username || "");
    setEditBio(currentUser?.bio || "");
    setEditAvatarUrl(currentUser?.profile_picture_url || currentUser?.profile_picture || "");
  }, [currentUser]);

  // Avatar Image Upload
  const handleAvatarFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    setUpdateError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8080/users/upload-avatar", {
        method: "POST",
        body: formData, // No Authorization headers required by backend upload endpoint
      });

      if (!response.ok) {
        throw new Error("Avatar upload failed");
      }

      const resData = await response.json();
      setEditAvatarUrl(resData.url);
    } catch (err) {
      setUpdateError(err.message || "Failed to upload profile picture.");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Submit Profile Updates
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    const updatedData = {
      username: editUsername.trim(),
      full_name: editName.trim(), // support json mapping
      fullName: editName.trim(), // DTO field name compatibility
      bio: editBio.trim(),
      profile_picture_url: editAvatarUrl.trim(), // support json mapping
      profilePictureUrl: editAvatarUrl.trim(), // DTO field compatibility
    };

    try {
      const response = await fetch(`http://localhost:8080/users/${currentUser.userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let displayMessage = errorText;
        try {
          const parsed = JSON.parse(errorText);
          if (parsed && parsed.message) {
            displayMessage = parsed.message;
          }
        } catch (err) {
          // not json
        }
        throw new Error(displayMessage || "Failed to save profile changes.");
      }

      const updatedUser = await response.json();
      // Ensure backend keys match what local storage expects
      const storageUser = {
        userId: updatedUser.userId,
        username: updatedUser.username,
        full_name: updatedUser.full_name || updatedUser.fullName,
        fullName: updatedUser.full_name || updatedUser.fullName,
        bio: updatedUser.bio,
        profile_picture_url: updatedUser.profile_picture_url || updatedUser.profilePictureUrl,
        profilePictureUrl: updatedUser.profile_picture_url || updatedUser.profilePictureUrl,
      };

      localStorage.setItem("user", JSON.stringify(storageUser));
      setCurrentUser(storageUser);
      setUpdateSuccess(true);
      setTimeout(() => {
        setShowEditModal(false);
        setUpdateSuccess(false);
      }, 1000);
    } catch (err) {
      setUpdateError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.navigateTo("/");
  };

  const openFollowersList = () => {
    setListModalTitle("Followers");
    setListModalUsers(suggestedFollowers);
    setShowListModal(true);
  };

  const openFollowingList = () => {
    setListModalTitle("Following");
    setListModalUsers(followingList);
    setShowListModal(true);
  };

  const toggleListFollow = (userId) => {
    setListModalUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          return { ...u, isFollowing: !u.isFollowing };
        }
        return u;
      })
    );
  };

  // Split bio text by newlines for bullet points
  const bioBullets = (currentUser?.bio || "")
    .split("\n")
    .filter(line => line.trim().length > 0);

  return (
    <div className="feed-page-container profile-page-container">
      {/* MOBILE TOP HEADER */}
      <header className="mobile-top-header">
        <button className="cover-btn-pill" onClick={() => window.navigateTo("/feed")} aria-label="Go back">
          <ChevronLeft className="size-5 text-slate-800" />
        </button>
        <span className="mobile-logo" style={{ color: "#0f172a" }}>
          Profile
        </span>
        <div className="mobile-header-actions">
          <button className="icon-badge-btn" onClick={handleLogout} aria-label="Log Out">
            <LogOut className="size-5 text-slate-800" />
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
              <div className="sidebar-profile-name">{currentUser?.full_name || currentUser?.fullName || "Creator Profile"}</div>
              <div className="sidebar-profile-handle">@{currentUser?.username || "creator"}</div>
            </div>
            <button className="sidebar-logout-btn" onClick={handleLogout} title="Log Out">
              <LogOut className="size-5" />
            </button>
          </div>
        </aside>

        {/* CENTER COLUMN (Hero Banner + Stats Grid + Tabs Panels) */}
        <main className="profile-main-column">
          {/* Cover Hero block */}
          <section className="profile-hero-card">
            <div className="profile-cover-banner">
              <div className="cover-overlay-actions">
                <button className="cover-btn-pill" onClick={() => window.navigateTo("/feed")} title="Back to Feed">
                  <ChevronLeft className="size-5 text-white" />
                </button>
                <div className="flex gap-2">
                  <button className="cover-btn-pill" onClick={() => setShowEditModal(true)} title="Settings">
                    <Settings className="size-5 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Avatar overlapping */}
            <div className="profile-avatar-container">
              <img
                src={currentUser?.profile_picture_url || currentUser?.profile_picture || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop"}
                alt=""
                className="profile-avatar-img"
              />
            </div>

            {/* User Identity Info */}
            <div className="profile-identity-box">
              <h2 className="profile-display-name">
                {currentUser?.full_name || currentUser?.fullName || "Creator Profile"}
                <span className="inline-flex items-center justify-center bg-indigo-500 text-white rounded-full p-0.5" style={{ width: "16px", height: "16px", fontSize: "10px" }} title="Verified User">✓</span>
              </h2>
              <div className="profile-display-handle">@{currentUser?.username || "creator"}</div>
            </div>

            {/* Stats Counter Row */}
            <div className="profile-stats-grid">
              <div className="profile-stat-box">
                <span className="profile-stat-num">256.7K</span>
                <span className="profile-stat-lbl">Rating</span>
              </div>
              <div className="profile-stat-box" onClick={openFollowersList}>
                <span className="profile-stat-num">1.5K</span>
                <span className="profile-stat-lbl">Followers</span>
              </div>
              <div className="profile-stat-box" onClick={openFollowingList}>
                <span className="profile-stat-num">1.2K</span>
                <span className="profile-stat-lbl">Following</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="profile-actions-panel">
              <button className="profile-btn-primary" onClick={() => setShowEditModal(true)}>
                Edit profile
              </button>
              <button className="profile-btn-secondary" onClick={() => setActiveTab("Insights")}>
                Insights
              </button>
            </div>

            {/* Horizontal Sub-Tabs Row */}
            <div className="profile-subtabs-row">
              {["About", "Posts", "Insights", "Bookmarked"].map((tab) => (
                <button
                  key={tab}
                  className={`profile-tab-item ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "About" && <Award className="size-4" />}
                  {tab === "Posts" && <Sparkles className="size-4" />}
                  {tab === "Insights" && <BarChart2 className="size-4" />}
                  {tab === "Bookmarked" && <Bookmark className="size-4" />}
                  <span>{tab}</span>
                </button>
              ))}
            </div>
          </section>

          {/* TAB 1: About Info section */}
          {activeTab === "About" && (
            <section className="profile-info-card">
              <h3 className="profile-card-heading">Bio</h3>
              <div className="bio-bullet-list">
                {bioBullets.length > 0 ? (
                  bioBullets.map((bullet, idx) => (
                    <div key={idx} className="bio-bullet-item">
                      <span className="bio-bullet-emoji">💡</span>
                      <span>{bullet}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-slate-500 text-sm italic">No bio written yet. Click Edit Profile to add one!</div>
                )}
              </div>

              {/* Social icons row */}
              <div className="profile-socials-row">
                {["Instagram", "Facebook", "Youtube", "TikTok", "Twitter"].map((social) => (
                  <button key={social} className="social-icon-btn" title={social}>
                    <Globe className="size-4" />
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* TAB 2: User Posts Grid */}
          {activeTab === "Posts" && (
            <section className="profile-posts-grid">
              {userPosts.map((post) => (
                <div
                  key={post.id}
                  className="profile-grid-card"
                  onClick={() => setSelectedPost(post)}
                >
                  <img src={post.imageUrl} alt={post.title} loading="lazy" />
                  <div className="profile-grid-hover">
                    <div className="flex items-center gap-1.5">
                      <Heart className="size-4 fill-white" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MessageCircle className="size-4 fill-white" />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* TAB 3: Insights Performance meters */}
          {activeTab === "Insights" && (
            <section className="insights-stats-grid">
              <div className="insight-metric-card">
                <span className="profile-stat-lbl">Profile Views</span>
                <div className="insight-metric-num">12,408</div>
                <div className="progress-track-bar">
                  <div className="progress-fill-bar" style={{ width: "72%" }}></div>
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold mt-2 block">+14.2% since last week</span>
              </div>
              <div className="insight-metric-card">
                <span className="profile-stat-lbl">Engagement Rate</span>
                <div className="insight-metric-num">8.42%</div>
                <div className="progress-track-bar">
                  <div className="progress-fill-bar" style={{ width: "54%" }}></div>
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold mt-2 block">+3.1% since last week</span>
              </div>
              <div className="insight-metric-card">
                <span className="profile-stat-lbl">Content Reach</span>
                <div className="insight-metric-num">325.4K</div>
                <div className="progress-track-bar">
                  <div className="progress-fill-bar" style={{ width: "85%" }}></div>
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold mt-2 block">+24.8% since last week</span>
              </div>
              <div className="insight-metric-card">
                <span className="profile-stat-lbl">Interactions</span>
                <div className="insight-metric-num">42,912</div>
                <div className="progress-track-bar">
                  <div className="progress-fill-bar" style={{ width: "61%" }}></div>
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold mt-2 block">+9.4% since last week</span>
              </div>
            </section>
          )}

          {/* TAB 4: Bookmarked Posts Grid */}
          {activeTab === "Bookmarked" && (
            <section className="profile-posts-grid">
              {bookmarkedPosts.map((post) => (
                <div
                  key={post.id}
                  className="profile-grid-card"
                  onClick={() => setSelectedPost(post)}
                >
                  <img src={post.imageUrl} alt={post.title} loading="lazy" />
                  <div className="profile-grid-hover">
                    <div className="flex items-center gap-1.5">
                      <Heart className="size-4 fill-white" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MessageCircle className="size-4 fill-white" />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          )}
        </main>

        {/* RIGHT SIDEBAR (Desktop Suggested Follow list) */}
        <aside className="sidebar-right">
          <div className="right-sidebar-panel" style={{ background: "var(--profile-glass-bg)", border: "1px solid var(--profile-glass-border)", boxShadow: "var(--profile-card-shadow)" }}>
            <h3 className="panel-title" style={{ color: "var(--profile-text-dark)" }}>Suggested Creators</h3>
            <div className="follow-suggestions-list">
              {suggestedFollowers.map((sugg) => (
                <div key={sugg.id} className="suggestion-row">
                  <div className="suggestion-left">
                    <img
                      src={sugg.avatar}
                      alt=""
                      className="suggestion-avatar"
                    />
                    <div className="suggestion-info">
                      <span className="suggestion-name" style={{ color: "var(--profile-text-dark)" }}>{sugg.name}</span>
                      <span className="suggestion-handle">@{sugg.handle}</span>
                    </div>
                  </div>
                  <button className="btn-follow-action follow" onClick={openFollowersList}>
                    Follow
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

      {/* EDIT PROFILE MODAL DIALOG */}
      {showEditModal && (
        <div className="create-post-modal-overlay active" onClick={() => setShowEditModal(false)}>
          <div className="create-post-modal-content active" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Edit Profile</h3>
              <button className="modal-close-btn" onClick={() => setShowEditModal(false)}>
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="modal-form-grid p-5">
              {updateError && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs font-medium border border-red-150">
                  {updateError}
                </div>
              )}
              {updateSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-medium border border-emerald-150 flex items-center gap-1.5">
                  <Check className="size-4" />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              {/* Avatar Upload Container */}
              <div className="avatar-upload-row">
                <img
                  src={editAvatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop"}
                  alt=""
                  className="avatar-preview-circle"
                />
                <div>
                  <button
                    type="button"
                    className="btn-upload-avatar"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingAvatar}
                  >
                    {isUploadingAvatar ? "Uploading..." : "Change avatar"}
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
              </div>

              {/* Name */}
              <div className="modal-input-group">
                <label className="modal-input-lbl">Full Name</label>
                <input
                  type="text"
                  required
                  className="modal-input-val"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>

              {/* Username */}
              <div className="modal-input-group">
                <label className="modal-input-lbl">Username</label>
                <input
                  type="text"
                  required
                  className="modal-input-val"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                />
              </div>

              {/* Bio */}
              <div className="modal-input-group">
                <label className="modal-input-lbl">Bio</label>
                <textarea
                  className="modal-input-val modal-textarea-val"
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="flex gap-3 justify-end mt-4">
                <button
                  type="button"
                  className="profile-btn-secondary py-2"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="profile-btn-primary py-2"
                  disabled={isUpdating || isUploadingAvatar}
                >
                  {isUpdating ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OVERLAY FOLLOWERS/FOLLOWING USER LIST MODAL */}
      {showListModal && (
        <div className="create-post-modal-overlay active" onClick={() => setShowListModal(false)}>
          <div className="create-post-modal-content active animate-zoom" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{listModalTitle}</h3>
              <button className="modal-close-btn" onClick={() => setShowListModal(false)}>
                <X className="size-5" />
              </button>
            </div>
            <div className="modal-overlay-list p-5">
              {listModalUsers.map((user) => (
                <div key={user.id} className="modal-user-row">
                  <div className="modal-user-left">
                    <img src={user.avatar} alt="" className="modal-user-avatar" />
                    <div>
                      <div className="modal-user-name">{user.name}</div>
                      <div className="modal-user-handle">@{user.handle}</div>
                    </div>
                  </div>
                  <button
                    className={`btn-follow-action ${user.isFollowing ? "following" : "follow"}`}
                    onClick={() => toggleListFollow(user.id)}
                  >
                    {user.isFollowing ? "Following" : "Follow"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX POST MODAL */}
      {selectedPost && (
        <div className="lightbox-modal-overlay" onClick={() => setSelectedPost(null)}>
          <div className="lightbox-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-image-panel">
              <img
                src={selectedPost.imageUrl}
                alt={selectedPost.title}
                className="lightbox-expanded-img"
              />
            </div>
            <div className="lightbox-details-panel">
              <div>
                <div className="lightbox-creator-row">
                  <div className="lightbox-creator-left">
                    <img
                      src={currentUser?.profile_picture_url || currentUser?.profile_picture || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop"}
                      alt=""
                      className="lightbox-creator-avatar"
                    />
                    <div>
                      <div className="lightbox-creator-name">{currentUser?.full_name || currentUser?.fullName || "Creator Profile"}</div>
                      <div className="lightbox-creator-handle">@{currentUser?.username || "creator"}</div>
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
                    <Heart className="size-5 fill-red-500 text-red-500" style={{ color: "#ef4444" }} />
                    <span style={{ color: "#0f172a" }}>{selectedPost.likes}</span>
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
