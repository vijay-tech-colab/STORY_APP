import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";
import ChatSection from "./ChatSection";

function App() {
  const [stories, setStories] = useState([]);
  const [currentStory, setCurrentStory] = useState(null);
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);        // for spinner
  const [message, setMessage] = useState(null);         // for success/error messages
  const timerRef = useRef(null);

  useEffect(() => {
    let timer;
    if (message) {
       timer = setTimeout(() => {
        setMessage(null);
      }, 2000)} // 3 seconds
    axios
      .get("http://localhost:5000/api/story?page=1&limit=10&sort=-createdAt")
      .then((res) => setStories(res.data))
      .catch((err) => console.error("Error fetching stories:", err));
      return () => clearTimeout(timer);
  }, [message]);

  const handleClick = (story) => {
    setCurrentStory(story);
    setProgress(0);

    let start = Date.now();
    const duration = 5000;
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress((elapsed / duration) * 100);
      if (elapsed >= duration) {
        clearInterval(timerRef.current);
        setCurrentStory(null);
      }
    }, 100);
  };

  const handleClose = () => {
    clearInterval(timerRef.current);
    setCurrentStory(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!image) return;

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/story",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setStories([res.data, ...stories]); // add new story at front
      setImage(null);
      setMessage({ type: "success", text: "Story uploaded successfully!" });
    } catch (err) {
      console.error("Upload failed:", err);
      setMessage({ type: "error", text: "Upload failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1 className="title">WhatsApp Stories</h1>

      {/* Upload form */}
      <form onSubmit={handleUpload} className="upload-form">
        <label htmlFor="file-upload" className="custom-file-upload">
          + Add Story
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          hidden
        />
        <button type="submit" disabled={!image || loading}>
          {loading ? (
            <div className="spinner"></div> // Spinner component/style
          ) : (
            "Upload"
          )}
        </button>
      </form>

      {/* Show success/error message */}
      {message && (
        <div
          className={`message ${
            message.type === "success" ? "success" : "error"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Story thumbnails */}
      <div className="story-thumbnails">
        {stories.map((story) => (
          <div
            className="story-box"
            key={story._id}
            onClick={() => handleClick(story)}
          >
            <div className="story-card">
              <img src={story.image} alt="story" className="story-image" />
              <img
                src="https://i.pravatar.cc/40"
                alt="avatar"
                className="story-user-avatar"
              />
            </div>
          </div>
        ))}
      </div>

      {/* New Chat Section */}
      <ChatSection />

      {/* Story popup */}
      {currentStory && (
        <div className="popup-overlay" onClick={handleClose}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <img
              src={currentStory.image}
              alt="current"
              className="popup-image"
            />
            <button className="close-btn" onClick={handleClose}>
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
