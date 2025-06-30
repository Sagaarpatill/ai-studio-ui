// src/components/VideoPlayer.js
import React from 'react';

const VideoPlayer = ({ videoURL, videoRef }) => {
  const videoPlayerStyles = {
    videoPlayerContainer: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000', // Black background for video
      borderRadius: '8px',
      overflow: 'hidden', // Ensure video corners are rounded
    },
    videoElement: {
      width: '100%',
      height: 'auto',
      display: 'block', // Remove extra space below video
    },
    placeholder: {
      backgroundColor: '#f0f0f0',
      color: '#888',
      width: '100%',
      padding: '100px 20px', // Adjust as needed
      textAlign: 'center',
      fontSize: '1.2rem',
      borderRadius: '8px',
    }
  };

  return (
    <div style={videoPlayerStyles.videoPlayerContainer}>
      {videoURL ? (
        <video
          ref={videoRef}
          src={videoURL}
          controls
          style={videoPlayerStyles.videoElement}
          aria-label="Video Player"
        >
          Your browser does not support the video tag.
        </video>
      ) : (
        <div style={videoPlayerStyles.placeholder}>
          No video uploaded.
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;