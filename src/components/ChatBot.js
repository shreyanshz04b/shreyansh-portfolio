import React, { useEffect, useState } from "react";

const ChatBot = () => {
  const [showMessage, setShowMessage] = useState(false);
  const [typedText, setTypedText] = useState("");
  const welcomeText =
    "👋 Hi there! I'm your personal AI assistant. How can I help you today?";

  // ✅ Load Noupe script only once
  useEffect(() => {
    const existingScript = document.querySelector(
      "script[src='https://www.noupe.com/embed/019a1b563e7375efa5ecb33a6ef652df4e22.js']"
    );

    if (!existingScript) {
      const script = document.createElement("script");
      script.src =
        "https://www.noupe.com/embed/019a1b563e7375efa5ecb33a6ef652df4e22.js";
      script.async = true;
      script.crossOrigin = "anonymous";
      script.id = "noupe-chatbot-script";
      document.body.appendChild(script);
    }

    // Fake chat animation before actual bot loads
    const timer = setTimeout(() => setShowMessage(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // 🪄 Typing animation
  useEffect(() => {
    if (showMessage && typedText.length < welcomeText.length) {
      const timeout = setTimeout(() => {
        setTypedText(welcomeText.slice(0, typedText.length + 1));
      }, 40);
      return () => clearTimeout(timeout);
    }
  }, [showMessage, typedText]);

  return (
    <div style={styles.container}>
      <div id="noupe-embed" style={styles.chatContainer}>
        {!showMessage ? (
          <div style={styles.loadingWrapper}>
            <div style={styles.loadingDots}>
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </div>
          </div>
        ) : (
          <div style={styles.messageBubble}>
            <p style={styles.typingText}>{typedText}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// 🎨 Clean Animated Styles
const styles = {
  container: {
    minHeight: "100vh",
    width: "100%",
    background: "radial-gradient(circle at top left, #141421, #1e1e2f, #323247)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    boxSizing: "border-box",
  },
  chatContainer: {
    width: "100%",
    maxWidth: "900px",
    height: "80vh",
    background: "rgba(255, 255, 255, 0.08)",
    borderRadius: "16px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    position: "relative",
    overflow: "hidden",
  },
  messageBubble: {
    backgroundColor: "rgba(0, 255, 136, 0.1)",
    border: "1px solid #00ff88",
    borderRadius: "15px",
    padding: "15px 20px",
    color: "#aaffc3",
    fontFamily: "'Poppins', sans-serif",
    fontSize: "1.2rem",
    maxWidth: "80%",
    textAlign: "left",
    lineHeight: 1.5,
    boxShadow: "0 0 20px rgba(0,255,136,0.2)",
    animation: "fadeIn 1s ease-in-out",
  },
  typingText: {
    margin: 0,
    whiteSpace: "pre-wrap",
  },
  loadingWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "5px",
  },
  loadingDots: {
    display: "flex",
    gap: "5px",
    fontSize: "2rem",
    color: "#00ff88",
    animation: "pulse 1s infinite ease-in-out",
  },
  "@keyframes pulse": {
    "0%, 100%": { opacity: 0.3 },
    "50%": { opacity: 1 },
  },
  "@media (max-width: 768px)": {
    chatContainer: {
      height: "70vh",
    },
    messageBubble: {
      fontSize: "1rem",
    },
  },
  "@media (max-width: 480px)": {
    chatContainer: {
      height: "60vh",
    },
    messageBubble: {
      fontSize: "0.9rem",
    },
  },
};

export default ChatBot;
