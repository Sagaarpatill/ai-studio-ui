import React, { useState } from "react";

// Add 'loading' to props, use it to disable input and button
const ChatBar = ({ onSubmit, loading }) => { // <--- ADDED 'loading' HERE
  const [prompt, setPrompt] = useState("");

  const handleSend = () => {
    if (prompt.trim() && !loading) { // <--- ONLY SEND IF NOT LOADING
      onSubmit(prompt);
      setPrompt("");
    }
  };

  const chatBarStyles = {
    container: {
      position: "fixed",
      bottom: "30px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "90%",
      maxWidth: "800px",
      zIndex: 1000,
    },
    chatBox: {
      display: "flex",
      alignItems: "center",
      background: "#fff",
      borderRadius: "25px",
      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
      padding: "12px 25px",
    },
    chatInput: {
      flex: 1,
      border: "none",
      outline: "none",
      fontSize: "16px",
      padding: "8px",
      background: "transparent",
      // Disable input while loading
      cursor: loading ? "not-allowed" : "text", // <--- ADDED CURSOR STYLE
    },
    rightSide: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
      marginLeft: "15px",
    },
    iconButton: {
      backgroundColor: loading ? "#cccccc" : "#007bff", // <--- GRAY OUT WHEN LOADING
      color: "white",
      border: "none",
      borderRadius: "50%",
      width: "40px",
      height: "40px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "18px",
      cursor: loading ? "not-allowed" : "pointer", // <--- CHANGE CURSOR
      transition: "background-color 0.3s ease, transform 0.2s ease",
    },
  };

  return (
    <div style={chatBarStyles.container}>
      <div style={chatBarStyles.chatBox}>
        <input
          type="text"
          placeholder={loading ? "Analyzing..." : "Ask anything about the video..."} // <--- CHANGE PLACEHOLDER WHEN LOADING
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={chatBarStyles.chatInput}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={loading} // <--- DISABLE INPUT FIELD WHEN LOADING
        />

        <div style={chatBarStyles.rightSide}>
          <button
            style={chatBarStyles.iconButton}
            onClick={handleSend}
            disabled={loading} // <--- DISABLE BUTTON WHEN LOADING
          >
            <span role="img" aria-label="send">▶️</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBar;