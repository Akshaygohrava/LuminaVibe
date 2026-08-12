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
  ChevronRight,
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

  const [profileUser, setProfileUser] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(true);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") !== "light");

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
  
  // Dynamic Follow and Privacy States
  const [followStatus, setFollowStatus] = useState("NOT_FOLLOWING");
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [isLoadingFollowData, setIsLoadingFollowData] = useState(true);
  const [searchUrl, setSearchUrl] = useState(window.location.search);

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

  // Dynamic User Posts state (fetched from database based on profileUser)
  const [userPosts, setUserPosts] = useState([]);
  const [isLoadingUserPosts, setIsLoadingUserPosts] = useState(true);

  // Lightbox carousel active index tracking
  const [lightboxSlideIdx, setLightboxSlideIdx] = useState(0);

  // Reset lightbox slide index when selected post is clicked
  useEffect(() => {
    setLightboxSlideIdx(0);
  }, [selectedPost]);

  // Dynamic Bookmarked Posts & Insights
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [isLoadingBookmarks, setIsLoadingBookmarks] = useState(false);
  const [insights, setInsights] = useState(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  const loadBookmarkedPosts = async () => {
    setIsLoadingBookmarks(true);
    try {
      const res = await fetch("http://localhost:8080/bookmarks", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        const normalized = data.map((p) => {
          const mappedMedia = (p.media_list || []).map((m) => ({
            mediaId: m.media_id || m.mediaId,
            mediaUrl: m.media_url || m.mediaUrl,
            mediaType: m.media_type || m.mediaType || "image/jpeg"
          }));
          return {
            id: p.post_id,
            title: p.content ? (p.content.length > 20 ? p.content.substring(0, 20) + "..." : p.content) : "Post",
            imageUrl: mappedMedia.length > 0 ? mappedMedia[0].mediaUrl : "https://images.unsplash.com/photo-1472289065668-ce650ac443d2?w=800&auto=format&fit=crop",
            mediaList: mappedMedia,
            likes: p.likes_count || 0,
            comments: p.comments ? p.comments.length : 0,
            caption: p.content || "",
            location: p.location || "",
          };
        });
        setBookmarkedPosts(normalized);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingBookmarks(false);
    }
  };

  const loadInsights = async () => {
    setIsLoadingInsights(true);
    try {
      const res = await fetch("http://localhost:8080/users/insights", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setInsights(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingInsights(false);
    }
  };

  useEffect(() => {
    if (activeTab === "Bookmarked") {
      loadBookmarkedPosts();
    } else if (activeTab === "Insights") {
      loadInsights();
    }
  }, [activeTab]);

  // Refresh profile details on load
  useEffect(() => {
    setEditName(currentUser?.full_name || currentUser?.fullName || "");
    setEditUsername(currentUser?.username || "");
    setEditBio(currentUser?.bio || "");
    setEditAvatarUrl(currentUser?.profile_picture_url || currentUser?.profile_picture || "");
  }, [currentUser]);

  // Listen for navigation changes (popstate and pushState)
  useEffect(() => {
    const handleUrlChange = () => {
      setSearchUrl(window.location.search);
    };
    window.addEventListener("popstate", handleUrlChange);

    const originalPushState = window.history.pushState;
    window.history.pushState = function () {
      originalPushState.apply(this, arguments);
      handleUrlChange();
    };

    return () => {
      window.removeEventListener("popstate", handleUrlChange);
      window.history.pushState = originalPushState;
    };
  }, []);

  // Fetch or set profile user based on query parameter
  useEffect(() => {
    const params = new URLSearchParams(searchUrl);
    const queryUsername = params.get("username");

    if (queryUsername && queryUsername !== currentUser.username) {
      setIsOwnProfile(false);
      setIsLoadingProfile(true);
      fetch(`http://localhost:8080/users/username/${queryUsername}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("User not found");
          return res.json();
        })
        .then((data) => {
          const normUser = {
            userId: data.userId,
            username: data.username,
            full_name: data.full_name || data.fullName,
            fullName: data.full_name || data.fullName,
            bio: data.bio || "",
            profile_picture_url: data.profile_picture_url || data.profilePictureUrl,
            profilePicture: data.profile_picture_url || data.profilePictureUrl,
            isPrivate: data.private ?? data.isPrivate ?? false,
          };
          setProfileUser(normUser);
          setIsLoadingProfile(false);
        })
        .catch((err) => {
          console.error(err);
          // Fallback if not in database
          setProfileUser({
            userId: 999,
            username: queryUsername,
            full_name: queryUsername.replace(/_/g, " "),
            bio: "🏀 Basketball Creator | Fan of LuminaVibe!",
            profile_picture_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop",
          });
          setIsLoadingProfile(false);
        });
    } else {
      setIsOwnProfile(true);
      setProfileUser(currentUser);
      setIsLoadingProfile(false);
    }
  }, [searchUrl, currentUser]);

  // Fetch user posts dynamically based on profileUser
  useEffect(() => {
    if (!profileUser || profileUser.userId === 0) {
      setIsLoadingUserPosts(false);
      return;
    }
    setIsLoadingUserPosts(true);
    fetch(`http://localhost:8080/posts/user/${profileUser.userId}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load user posts.");
        return res.json();
      })
      .then((data) => {
        const normalized = data.map((p) => {
          const mappedMedia = (p.media_list || []).map((m) => ({
            mediaId: m.media_id || m.mediaId,
            mediaUrl: m.media_url || m.mediaUrl,
            mediaType: m.media_type || m.mediaType || "image/jpeg"
          }));
          return {
            id: p.post_id,
            title: p.content ? (p.content.length > 20 ? p.content.substring(0, 20) + "..." : p.content) : "Post",
            imageUrl: mappedMedia.length > 0 ? mappedMedia[0].mediaUrl : "https://images.unsplash.com/photo-1472289065668-ce650ac443d2?w=800&auto=format&fit=crop",
            mediaList: mappedMedia,
            likes: Math.floor(Math.random() * 200) + 14,
            comments: 0,
            caption: p.content || "",
            location: p.location || "",
          };
        });
        setUserPosts(normalized);
        setIsLoadingUserPosts(false);
      })
      .catch((err) => {
        console.error("Error loading user posts:", err);
        // Fallback mockup
        setUserPosts([
          { id: 1, title: "Training Session", imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&auto=format&fit=crop", likes: 843, comments: 120, caption: "Court views tonight. Working on three-point releases and acceleration drills. 💪🏀", mediaList: [] },
          { id: 2, title: "Match Day", imageUrl: "https://images.unsplash.com/photo-1519766304817-4f37bda74a27?w=600&auto=format&fit=crop", likes: 1102, comments: 245, caption: "Championship playoffs! Team chemistry was on point today. MVP vibes. 🏆🔥", mediaList: [] },
        ]);
        setIsLoadingUserPosts(false);
      });
  }, [profileUser]);

  // Load follower and following counts/lists dynamically
  const loadFollowData = async () => {
    if (!profileUser || profileUser.userId === 0) return;
    setIsLoadingFollowData(true);
    try {
      const headers = {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      };

      // 1. Fetch Follow Status
      const statusRes = await fetch(`http://localhost:8080/follows/status/${profileUser.userId}`, { headers });
      if (statusRes.ok) {
        const statusData = await statusRes.json();
        setFollowStatus(statusData.status);
      }

      // 2. Fetch Followers List
      const followersRes = await fetch(`http://localhost:8080/follows/followers/${profileUser.userId}`, { headers });
      if (followersRes.ok) {
        const followersData = await followersRes.json();
        setFollowersList(followersData);
        setFollowersCount(followersData.length);
      }

      // 3. Fetch Following List
      const followingRes = await fetch(`http://localhost:8080/follows/following/${profileUser.userId}`, { headers });
      if (followingRes.ok) {
        const followingData = await followingRes.json();
        setFollowingList(followingData);
        setFollowingCount(followingData.length);
      }

      // 4. Fetch Pending Requests
      if (isOwnProfile) {
        const requestsRes = await fetch("http://localhost:8080/follows/requests", { headers });
        if (requestsRes.ok) {
          const requestsData = await requestsRes.json();
          setPendingRequests(requestsData);
        }
      }
    } catch (err) {
      console.error("Error loading follow data:", err);
    } finally {
      setIsLoadingFollowData(false);
    }
  };

  useEffect(() => {
    loadFollowData();
  }, [profileUser, isOwnProfile]);

  const handleFollowToggle = async () => {
    if (!profileUser || profileUser.userId === 0) return;
    try {
      const response = await fetch(`http://localhost:8080/follows/toggle/${profileUser.userId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (response.ok) {
        await loadFollowData();
      }
    } catch (err) {
      console.error("Error toggling follow:", err);
    }
  };

  const handleAcceptRequest = async (followerId) => {
    try {
      const response = await fetch(`http://localhost:8080/follows/accept/${followerId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (response.ok) {
        await loadFollowData();
      }
    } catch (err) {
      console.error("Error accepting request:", err);
    }
  };

  const handleRejectRequest = async (followerId) => {
    try {
      const response = await fetch(`http://localhost:8080/follows/reject/${followerId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (response.ok) {
        await loadFollowData();
      }
    } catch (err) {
      console.error("Error rejecting request:", err);
    }
  };

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

  const isProfileLocked = !isOwnProfile && profileUser?.isPrivate && followStatus !== "ACCEPTED";

  const openFollowersList = () => {
    if (isProfileLocked) return;
    setListModalTitle("Followers");
    const followingIds = followingList.map(f => f.userId);
    setListModalUsers(followersList.map(u => ({
      id: u.userId,
      name: u.fullName || u.full_name || "Lumina Creator",
      handle: u.username,
      avatar: u.profilePictureUrl || u.profile_picture_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop",
      isFollowing: followingIds.includes(u.userId),
      followStatus: followingIds.includes(u.userId) ? "ACCEPTED" : "NOT_FOLLOWING"
    })));
    setShowListModal(true);
  };

  const openFollowingList = () => {
    if (isProfileLocked) return;
    setListModalTitle("Following");
    setListModalUsers(followingList.map(u => ({
      id: u.userId,
      name: u.fullName || u.full_name || "Lumina Creator",
      handle: u.username,
      avatar: u.profilePictureUrl || u.profile_picture_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop",
      isFollowing: true,
      followStatus: "ACCEPTED"
    })));
    setShowListModal(true);
  };

  const toggleListFollow = async (userId) => {
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
          setListModalUsers(prev =>
            prev.map(u => {
              if (u.id === userId) {
                return { 
                  ...u, 
                  isFollowing: statusData.status === "ACCEPTED",
                  followStatus: statusData.status 
                };
              }
              return u;
            })
          );
        }
        await loadFollowData();
      }
    } catch (err) {
      console.error("Error toggling list follow:", err);
    }
  };

  const getFollowBtnStyle = () => {
    if (followStatus === "ACCEPTED") {
      return {
        background: "rgba(255, 255, 255, 0.08)",
        color: "#ffffff",
        border: "1px solid rgba(255, 255, 255, 0.15)"
      };
    } else if (followStatus === "PENDING") {
      return {
        background: "rgba(245, 158, 11, 0.18)", // warm amber glow background
        color: "#f59e0b", // distinct amber amber text
        border: "1px solid rgba(245, 158, 11, 0.4)" // clear amber border
      };
    } else {
      return {
        background: "#c5f82a",
        color: "#000000",
        border: "none"
      };
    }
  };

  // Split bio text by newlines for bullet points
  const bioBullets = (profileUser?.bio || "")
    .split("\n")
    .filter(line => line.trim().length > 0);

  return (
    <div className={`feed-page-container ${darkMode ? "profile-page-container-dark" : "profile-page-container light-theme"}`}>
      {/* MOBILE TOP HEADER */}
      <header className="mobile-top-header" style={{ borderBottom: darkMode ? "1px solid rgba(255,255,255,0.03)" : "1px solid rgba(0,0,0,0.05)" }}>
        <button className="cover-btn-pill" onClick={() => window.navigateTo("/feed")} aria-label="Go back">
          <ChevronLeft className="size-5" style={{ color: darkMode ? "#ffffff" : "#0f172a" }} />
        </button>
        <span className="mobile-logo" style={{ color: darkMode ? "#f8fafc" : "#0f172a" }}>
          Profile
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

        {/* CENTER COLUMN (Hero Banner + Stats Grid + Tabs Panels) */}
        <main className="profile-main-column">
          {isLoadingProfile || !profileUser ? (
            <div className="text-center py-20 text-slate-500 font-medium">Syncing profile details...</div>
          ) : (
            <>
              {/* Cover Hero block */}
              <section className="profile-hero-card">
                <div className="profile-cover-banner">
                  <div className="cover-overlay-actions">
                    <button className="cover-btn-pill" onClick={() => window.navigateTo("/feed")} title="Back to Feed">
                      <ChevronLeft className="size-5 text-white" />
                    </button>
                    {isOwnProfile && (
                      <div className="flex gap-2">
                        <button className="cover-btn-pill" onClick={() => setShowEditModal(true)} title="Settings">
                          <Settings className="size-5 text-white" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Avatar overlapping */}
                <div className="profile-avatar-container">
                  <img
                    src={profileUser?.profile_picture_url || profileUser?.profile_picture || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop"}
                    alt=""
                    className="profile-avatar-img"
                  />
                </div>

                {/* User Identity Info */}
                <div className="profile-identity-box">
                  <h2 className="profile-display-name">
                    {profileUser?.full_name || profileUser?.fullName || "Creator Profile"}
                    <span className="inline-flex items-center justify-center bg-indigo-500 text-white rounded-full p-0.5" style={{ width: "16px", height: "16px", fontSize: "10px" }} title="Verified User">✓</span>
                  </h2>
                  <div className="profile-display-handle">@{profileUser?.username || "creator"}</div>
                </div>

                {/* Stats Counter Row */}
                <div className="profile-stats-grid">
                  <div className="profile-stat-box" onClick={() => setActiveTab("Posts")}>
                    <span className="profile-stat-num">{userPosts.length}</span>
                    <span className="profile-stat-lbl">Posts</span>
                  </div>
                  <div className="profile-stat-box" onClick={openFollowersList}>
                    <span className="profile-stat-num">{followersCount}</span>
                    <span className="profile-stat-lbl">Followers</span>
                  </div>
                  <div className="profile-stat-box" onClick={openFollowingList}>
                    <span className="profile-stat-num">{followingCount}</span>
                    <span className="profile-stat-lbl">Following</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="profile-actions-panel">
                  {isOwnProfile ? (
                    <>
                      <button className="profile-btn-primary" onClick={() => setShowEditModal(true)}>
                        Edit profile
                      </button>
                      <button className="profile-btn-secondary" onClick={() => setActiveTab("Insights")}>
                        Insights
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className={`profile-btn-primary ${followStatus !== "NOT_FOLLOWING" ? "following" : ""}`}
                        onClick={handleFollowToggle}
                        style={getFollowBtnStyle()}
                      >
                        {followStatus === "ACCEPTED" ? "Following" : followStatus === "PENDING" ? "Requested" : "Follow"}
                      </button>
                      <button 
                        className="profile-btn-secondary" 
                        onClick={() => window.navigateTo(`/messages?userId=${profileUser.userId}&username=${profileUser.username}&fullName=${encodeURIComponent(profileUser.fullName || profileUser.full_name || "")}&avatar=${encodeURIComponent(profileUser.profilePicture || profileUser.profile_picture_url || "")}`)}
                      >
                        Message
                      </button>
                    </>
                  )}
                </div>

            {/* Follow Requests Pending List */}
            {isOwnProfile && pendingRequests && pendingRequests.length > 0 && (
              <div className="follow-requests-panel bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] p-5 rounded-3xl mb-6">
                <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
                  <Sparkles className="size-4 text-lime-400" />
                  Follow Requests ({pendingRequests.length})
                </h3>
                <div className="flex flex-col gap-3 max-h-[220px] overflow-y-auto pr-2 scrollbar-thin">
                  {pendingRequests.map((req) => (
                    <div key={req.follower.userId} className="flex items-center justify-between py-1 border-b border-[rgba(255,255,255,0.02)] last:border-0">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={req.follower.profilePictureUrl || req.follower.profile_picture_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop"}
                          alt=""
                          className="size-9 rounded-full object-cover"
                        />
                        <div className="text-left">
                          <div className="text-xs font-semibold text-slate-200">{req.follower.fullName || req.follower.full_name || "Lumina Creator"}</div>
                          <div className="text-[10px] text-slate-400">@{req.follower.username}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="text-[10px] bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-1 px-3 rounded-lg transition-colors"
                          onClick={() => handleAcceptRequest(req.follower.userId)}
                        >
                          Accept
                        </button>
                        <button
                          className="text-[10px] bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-slate-300 font-semibold py-1 px-3 rounded-lg transition-colors"
                          onClick={() => handleRejectRequest(req.follower.userId)}
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                  <div className="text-slate-500 text-sm italic">No bio written yet.</div>
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
            isProfileLocked ? (
              <div className="flex flex-col items-center justify-center p-12 text-center bg-[rgba(255,255,255,0.02)] rounded-3xl border border-[rgba(255,255,255,0.05)] col-span-full gap-4 min-h-[300px]" style={{ gridColumn: "1 / -1" }}>
                <Lock className="size-12 text-slate-500 mb-2" />
                <h3 className="text-lg font-semibold text-slate-200">This Account is Private</h3>
                <p className="text-sm text-slate-400 max-w-sm">Follow this account to see their photos and videos.</p>
              </div>
            ) : (
              <section className="profile-posts-grid">
                {userPosts.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-slate-500" style={{ gridColumn: "1 / -1" }}>No posts shared yet.</div>
                ) : (
                  userPosts.map((post) => (
                    <div
                      key={post.id}
                      className="profile-grid-card"
                      onClick={() => setSelectedPost(post)}
                    >
                      {post.mediaList && post.mediaList.length > 0 && post.mediaList[0].mediaType.startsWith("video/") ? (
                        <video src={post.mediaList[0].mediaUrl} className="w-full h-full object-cover" />
                      ) : (
                        <img src={post.imageUrl} alt={post.title} loading="lazy" />
                      )}
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
                  ))
                )}
              </section>
            )
          )}

          {/* TAB 3: Insights Performance meters */}
          {activeTab === "Insights" && (
            isLoadingInsights ? (
              <div className="text-center py-8" style={{ color: "var(--profile-text-dark)" }}>Loading Insights...</div>
            ) : (
              <section className="insights-stats-grid">
                <div className="insight-metric-card">
                  <span className="profile-stat-lbl">Profile Views</span>
                  <div className="insight-metric-num">{insights?.profile_views ?? 0}</div>
                  <div className="progress-track-bar">
                    <div className="progress-fill-bar" style={{ width: "72%" }}></div>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-semibold mt-2 block">+14.2% since last week</span>
                </div>
                <div className="insight-metric-card">
                  <span className="profile-stat-lbl">Engagement Rate</span>
                  <div className="insight-metric-num">{insights?.engagement_rate ?? "0.00%"}</div>
                  <div className="progress-track-bar">
                    <div className="progress-fill-bar" style={{ width: "54%" }}></div>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-semibold mt-2 block">+3.1% since last week</span>
                </div>
                <div className="insight-metric-card">
                  <span className="profile-stat-lbl">Total Posts Shared</span>
                  <div className="insight-metric-num">{insights?.posts_count ?? 0}</div>
                  <div className="progress-track-bar">
                    <div className="progress-fill-bar" style={{ width: "85%" }}></div>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-semibold mt-2 block">All-time posts count</span>
                </div>
                <div className="insight-metric-card">
                  <span className="profile-stat-lbl">Likes Received</span>
                  <div className="insight-metric-num">{insights?.likes_count ?? 0}</div>
                  <div className="progress-track-bar">
                    <div className="progress-fill-bar" style={{ width: "61%" }}></div>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-semibold mt-2 block">All-time likes count</span>
                </div>
              </section>
            )
          )}

          {/* TAB 4: Bookmarked Posts Grid */}
          {activeTab === "Bookmarked" && (
            isLoadingBookmarks ? (
              <div className="text-center py-8" style={{ color: "var(--profile-text-dark)" }}>Loading Bookmarks...</div>
            ) : (
              <section className="profile-posts-grid">
                {bookmarkedPosts.length === 0 ? (
                  <div className="col-span-full text-center py-8" style={{ color: "var(--profile-text-dark)", gridColumn: "1 / -1" }}>No bookmarks yet.</div>
                ) : (
                  bookmarkedPosts.map((post) => (
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
                  ))
                )}
              </section>
            )
          )}
        </>
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
                  {user.id !== currentUser.userId && (
                    <button
                      className={`btn-follow-action ${user.followStatus === "ACCEPTED" ? "following" : user.followStatus === "PENDING" ? "requested" : "follow"}`}
                      onClick={() => toggleListFollow(user.id)}
                    >
                      {user.followStatus === "ACCEPTED" ? "Following" : user.followStatus === "PENDING" ? "Requested" : "Follow"}
                    </button>
                  )}
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
              {selectedPost.mediaList && selectedPost.mediaList.length > 0 ? (
                selectedPost.mediaList.length === 1 ? (
                  /* Single media view inside lightbox */
                  selectedPost.mediaList[0].mediaType.startsWith("video/") ? (
                    <video
                      src={selectedPost.mediaList[0].mediaUrl}
                      controls
                      className="w-full h-full object-cover"
                      style={{ maxHeight: "100vh" }}
                    />
                  ) : (
                    <img
                      src={selectedPost.mediaList[0].mediaUrl}
                      alt={selectedPost.title}
                      className="lightbox-expanded-img"
                    />
                  )
                ) : (
                  /* Instagram-style multiple files carousel view inside lightbox */
                  <div className="post-carousel-wrapper w-full h-full flex items-center justify-center" style={{ minHeight: "350px" }}>
                    <div
                      className="post-carousel-track h-full"
                      style={{
                        transform: `translateX(-${lightboxSlideIdx * 100}%)`,
                        transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                        display: "flex",
                        width: `${selectedPost.mediaList.length * 100}%`
                      }}
                    >
                      {selectedPost.mediaList.map((media, idx) => (
                        <div
                          key={media.mediaId || idx}
                          className="post-carousel-slide flex items-center justify-center"
                          style={{ width: `${100 / selectedPost.mediaList.length}%` }}
                        >
                          {media.mediaType.startsWith("video/") ? (
                            <video
                              src={media.mediaUrl}
                              controls
                              className="w-full h-full object-contain"
                              style={{ maxHeight: "100vh" }}
                            />
                          ) : (
                            <img
                              src={media.mediaUrl}
                              alt={`Post slide ${idx + 1}`}
                              className="lightbox-expanded-img object-contain"
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Left Chevron */}
                    {lightboxSlideIdx > 0 && (
                      <button
                        className="carousel-nav-btn prev"
                        onClick={() => setLightboxSlideIdx(prev => Math.max(prev - 1, 0))}
                        aria-label="Previous slide"
                      >
                        <ChevronLeft className="size-4" />
                      </button>
                    )}

                    {/* Right Chevron */}
                    {lightboxSlideIdx < selectedPost.mediaList.length - 1 && (
                      <button
                        className="carousel-nav-btn next"
                        onClick={() => setLightboxSlideIdx(prev => Math.min(prev + 1, selectedPost.mediaList.length - 1))}
                        aria-label="Next slide"
                      >
                        <ChevronRight className="size-4" />
                      </button>
                    )}

                    {/* Dots Indicators */}
                    <div className="carousel-dots-indicator">
                      {selectedPost.mediaList.map((_, idx) => (
                        <span
                          key={idx}
                          className={`carousel-dot ${
                            lightboxSlideIdx === idx ? "active" : ""
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )
              ) : (
                /* Fallback mock post image */
                <img
                  src={selectedPost.imageUrl}
                  alt={selectedPost.title}
                  className="lightbox-expanded-img"
                />
              )}
            </div>
            <div className="lightbox-details-panel">
              <div>
                <div className="lightbox-creator-row">
                  <div className="lightbox-creator-left">
                    <img
                      src={profileUser?.profile_picture_url || profileUser?.profile_picture || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop"}
                      alt=""
                      className="lightbox-creator-avatar"
                    />
                    <div>
                      <div className="lightbox-creator-name">{profileUser?.full_name || profileUser?.fullName || "Creator Profile"}</div>
                      <div className="lightbox-creator-handle">@{profileUser?.username || "creator"}</div>
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
