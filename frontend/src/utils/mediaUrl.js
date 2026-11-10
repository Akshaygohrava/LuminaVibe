export const getBackendBaseUrl = () => {
  return import.meta.env.VITE_API_BASE_URL || 'https://luminavibe-backend.onrender.com';
};

export const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop";
export const DEFAULT_POST_IMAGE = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop";

export const formatMediaUrl = (url, fallback = '') => {
  if (!url || typeof url !== 'string') return fallback;
  const trimmed = url.trim();
  if (!trimmed) return fallback;

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
