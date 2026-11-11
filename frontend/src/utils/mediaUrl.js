export const getBackendBaseUrl = () => {
  return import.meta.env.VITE_API_BASE_URL || 'https://luminavibe-backend.onrender.com';
};

export const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop";
export const DEFAULT_POST_IMAGE = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop";

export const DUMMY_POST_IMAGES = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop"
];

export const getDeterministicDummyImage = (seed = 0) => {
  const num = typeof seed === 'number' ? Math.abs(seed) : Math.abs(String(seed).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0));
  return DUMMY_POST_IMAGES[num % DUMMY_POST_IMAGES.length];
};

export const formatMediaUrl = (url, fallback = DEFAULT_POST_IMAGE) => {
  if (!url || typeof url !== 'string') return fallback;
  const trimmed = url.trim();
  if (!trimmed || trimmed === 'null' || trimmed === 'undefined') return fallback;

  // Upgrade http:// to https:// on production/HTTPS to prevent Mixed Content browser blocks on Vercel
  let processed = trimmed;
  if (typeof window !== 'undefined' && window.location.protocol === 'https:' && processed.startsWith('http://') && !processed.includes('localhost')) {
    processed = processed.replace(/^http:\/\//i, 'https://');
  }

  // If already a full valid external CDN/Unsplash/Cloudinary URL, return as-is
  if (processed.startsWith('https://res.cloudinary.com') || processed.startsWith('http://res.cloudinary.com') ||
      processed.startsWith('https://images.unsplash.com') || processed.startsWith('data:')) {
    return processed;
  }

  const backendUrl = getBackendBaseUrl().replace(/\/+$/, '');

  // If pointing to localhost:8080, replace with live deployed backend URL
  if (processed.includes('localhost:8080')) {
    return processed.replace(/https?:\/\/localhost:8080/g, backendUrl);
  }

  // If it's a relative path starting with /uploads/ or uploads/
  if (processed.startsWith('/uploads/') || processed.startsWith('uploads/')) {
    const cleanPath = processed.startsWith('/') ? processed : `/${processed}`;
    return `${backendUrl}${cleanPath}`;
  }

  return processed;
};

export const handleImageError = (e, fallback = DEFAULT_POST_IMAGE) => {
  if (e && e.currentTarget) {
    if (e.currentTarget.src !== fallback) {
      e.currentTarget.onerror = null;
      e.currentTarget.src = fallback;
    }
  }
};

export const handleAvatarError = (e) => {
  handleImageError(e, DEFAULT_AVATAR);
};
