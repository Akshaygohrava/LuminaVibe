import { useState, useRef } from "react";
import api from "../services/api";
import { X, Sparkles, MapPin, Image as ImageIcon } from "lucide-react";

export default function CreatePostModal({ isOpen, onClose, onPostCreated, darkMode = true }) {
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setSelectedFiles((prev) => [...prev, ...files]);

    const newPreviews = files.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type,
      file,
    }));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeFile = (index) => {
    URL.revokeObjectURL(previews[index].url);
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    previews.forEach((p) => URL.revokeObjectURL(p.url));
    setCaption("");
    setLocation("");
    setSelectedFiles([]);
    setPreviews([]);
    setErrorMessage(null);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption.trim()) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("content", caption.trim());
    formData.append("location", location.trim());

    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      await api.post("/posts", formData);

      previews.forEach((p) => URL.revokeObjectURL(p.url));
      setCaption("");
      setLocation("");
      setSelectedFiles([]);
      setPreviews([]);

      if (onPostCreated) {
        onPostCreated();
      }
      onClose();
    } catch (err) {
      console.error("Error sharing post:", err);
      setErrorMessage(err.response?.data?.message || err.message || "Failed to share post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay-bg" onClick={handleClose}>
      <div className="modal-content-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title flex items-center gap-2">
            <Sparkles className="size-5 text-lime-400" />
            Create New Vibe
          </span>
          <button className="modal-close-btn" onClick={handleClose} aria-label="Close">
            <X className="size-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-field-wrapper">
            <label className="form-label-title">Caption</label>
            <textarea
              className="form-textarea"
              placeholder="What is the vibe today? Add hashtags..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              required
              rows={3}
            />
          </div>

          <div className="form-field-wrapper">
            <label className="form-label-title">Photos or Videos</label>
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="form-text-input text-left flex items-center justify-between cursor-pointer"
              style={{
                background: darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
                borderColor: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
              }}
            >
              <span className="flex items-center gap-2 text-xs sm:text-sm">
                <ImageIcon className="size-4" />
                {selectedFiles.length > 0 ? `${selectedFiles.length} file(s) selected` : "Select media files..."}
              </span>
              <span className="text-[11px] bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-3 rounded-lg font-semibold transition-colors">
                Browse
              </span>
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
            <label className="form-label-title">Location (Optional)</label>
            <div className="relative">
              <input
                type="text"
                className="form-text-input"
                placeholder="e.g. Jakarta, Indonesia"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="form-submit-btn-bar flex gap-3 justify-end items-center mt-6">
            <button
              type="button"
              className="text-xs sm:text-sm px-4 py-2.5 rounded-xl text-slate-400 hover:text-white transition-colors"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit-post"
              disabled={isSubmitting || !caption.trim()}
            >
              <Sparkles className="size-4" />
              {isSubmitting ? "Uploading Vibe..." : "Share Vibe"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

