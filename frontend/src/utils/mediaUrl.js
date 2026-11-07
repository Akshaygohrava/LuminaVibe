export const getBackendBaseUrl = () => {
  return import.meta.env.VITE_API_BASE_URL || 'https://luminavibe-backend.onrender.com';
};

export const formatMediaUrl = (url, fallback = '') => {
  if (!url || typeof url !== 'string') return fallback;
  const trimmed = url.trim();
  if (!trimmed) return fallback;

  const backendUrl = getBackendBaseUrl().replace(/\/+$/, '');

  // If pointing to localhost:8080, replace with live deployed backend URL
  if (trimmed.includes('localhost:8080')) {
    return trimmed.replace(/https?:\/\/localhost:8080/g, backendUrl);
  }

  // If it's a relative path starting with /uploads/ or uploads/
  if (trimmed.startsWith('/uploads/') || trimmed.startsWith('uploads/')) {
    const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    return `${backendUrl}${cleanPath}`;
  }

  return trimmed;
};

