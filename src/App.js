// src/App.js (FINAL ENHANCED VERSION - ALL INLINE STYLES)
import React, { useRef, useState, useEffect } from "react";
import ChatBar from "./components/ChatBar.js";
import VideoPlayer from "./components/VideoPlayer";
import Message from "./components/Message";
import LoadingSpinner from "./components/LoadingSpinner";
// Corrected import: Now importing both analyzeVideo and matchImageInVideo
import { analyzeVideo /*, matchImageInVideo */ } from "./api/googleAiService"; // Removed matchImageInVideo as it's not used when the feature is commented out
import UploadIcon from './assets/upload-icon.svg';

function App() {
  // --- State for Video Analysis Feature ---
  const [videoFile, setVideoFile] = useState(null);
  const [videoURL, setVideoURL] = useState("");
  const [messages, setMessages] = useState([]); // For chat history and analysis results
  const [loadingAnalysis, setLoadingAnalysis] = useState(false); // Specific loading for analysis
  const [analysisError, setAnalysisError] = useState(null); // Specific error for analysis
  const videoRef = useRef(); // Ref for the VideoPlayer component's video element
  const messagesEndRef = useRef(null); // Ref for auto-scrolling chat

  // State to store the GCS URI of the last video uploaded via the 'analyze video' section
  const [lastUploadedVideoGCSUri, setLastUploadedVideoGCSUri] = useState('');

  // --- State for Image Matching Feature (COMMENTED OUT as requested) ---
  /*
  const [queryImageFile, setQueryImageFile] = useState(null);
  const [videoUriForMatch, setVideoUriForMatch] = useState(''); // GCS URI (e.g., gs://your-bucket/video.mp4)
  const [matchResult, setMatchResult] = useState(null); // To store results from image matching
  const [loadingMatch, setLoadingMatch] = useState(false); // Specific loading for matching
  const [matchError, setMatchError] = useState(null); // Specific error for matching
  const [similarityThreshold, setSimilarityThreshold] = useState(0.85); // Default threshold
  const [frameSamplingInterval, setFrameSamplingInterval] = useState(5); // Default interval in seconds

  // New state variables for frontend validation errors
  const [queryImageMatchError, setQueryImageMatchError] = useState(null);
  const [videoUriMatchInputError, setVideoUriMatchInputError] = useState(null);
  */

  // Auto-scroll chat to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- Handlers for Video Analysis ---
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setVideoURL(URL.createObjectURL(file)); // Create a URL for the video player
      setMessages([
        { type: 'info', text: `Hi Sagar, this is the video "${file.name}" you uploaded. I've analyzed it, and you can now ask me questions!` }
      ]);
      setAnalysisError(null); // Clear previous errors
    } else {
      setMessages(prev => [...prev, { type: 'error', text: 'Please upload a valid video file.' }]);
      setVideoFile(null);
      setVideoURL("");
    }
  };

  // Handle user's question/prompt for video analysis
  const handleAsk = async (prompt) => {
    if (!videoFile) {
      setMessages(prev => [...prev, { type: 'error', text: 'Please upload a video first.' }]);
      return;
    }

    setMessages(prev => [...prev, { type: 'user', text: prompt }]);
    setLoadingAnalysis(true); // Show loading spinner
    setAnalysisError(null); // Clear previous errors

    try {
      const responseData = await analyzeVideo(videoFile, prompt);
      console.log("Backend response data (Analyze Video):", responseData);

      setMessages(prev => [...prev, {
        type: 'ai',
        text: responseData.answer,
        relevantOccurrences: responseData.relevantOccurrences
      }]);

      // IMPORTANT: Capture the GCS URI returned by the backend after successful analysis
      if (responseData.videoGCSUri) {
        setLastUploadedVideoGCSUri(responseData.videoGCSUri);
      }

    } catch (err) {
      console.error("Error analyzing video:", err);
      const errorMessage = err.response?.data?.error || "Failed to analyze video. Please try again.";
      setAnalysisError(errorMessage); // Set the error for display
      setMessages(prev => [...prev, { type: 'error', text: `Error: ${errorMessage}` }]);
    } finally {
      setLoadingAnalysis(false); // Hide loading spinner
    }
  };

  // --- Handlers for Image Matching (Commented out as requested) ---
  /*
  const handleQueryImageChange = (e) => {
    setQueryImageFile(e.target.files[0]);
  };

  const handleVideoUriForMatchChange = (e) => {
    setVideoUriForMatch(e.target.value);
  };

  const handleSimilarityThresholdChange = (e) => {
    setSimilarityThreshold(parseFloat(e.target.value));
  };

  const handleFrameSamplingIntervalChange = (e) => {
    setFrameSamplingInterval(parseInt(e.target.value, 10));
  };

  const handleImageMatchSubmit = async (e) => {
    e.preventDefault(); // Prevents default form submission behavior (page reload)

    // Clear previous validation errors
    setQueryImageMatchError(null);
    setVideoUriMatchInputError(null);
    setMatchError(null); // Clear previous backend errors from the match section

    // Use the manually entered URI if available, otherwise use the last uploaded one
    const videoToSearchUri = videoUriForMatch || lastUploadedVideoGCSUri;

    // --- Frontend Validation ---
    if (!queryImageFile) {
      setQueryImageMatchError('Please select a query image.');
      console.log("Validation Failed: No query image selected."); // Debug log
      return;
    }
    if (!videoToSearchUri.startsWith('gs://')) {
      setVideoUriMatchInputError('Please provide a valid Google Cloud Storage URI (e.g., gs://your-bucket/your-video.mp4).');
      console.log("Validation Failed: Invalid GCS URI format."); // Debug log
      return;
    }
    // --- End Frontend Validation ---

    setLoadingMatch(true);
    setMatchResult(null);


    try {
      console.log("Sending image match request with:"); // Debug log
      console.log("   Query Image:", queryImageFile ? queryImageFile.name : 'N/A'); // Debug log
      console.log("   Video URI:", videoToSearchUri); // Debug log
      console.log("   Similarity Threshold:", similarityThreshold); // Debug log
      console.log("   Frame Sampling Interval:", frameSamplingInterval); // Debug log

      const result = await matchImageInVideo(
        queryImageFile,
        videoToSearchUri, // Use the determined URI here
        similarityThreshold,
        frameSamplingInterval
      );
      console.log("Backend response data (Image Match):", result);
      setMatchResult(result);
    } catch (err) {
      console.error("Error matching image in video:", err);
      // Display the specific error message from the backend if available
      const errorMessage = err.response?.data?.error || "Failed to match image in video. Please try again.";
      setMatchError(errorMessage); // Set the error for display in UI
    } finally {
      setLoadingMatch(false);
    }
  };
  */

  // --- ALL STYLES FOR App.js AND GLOBAL ---
  const appStyles = {
    appContainer: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#eef2f6', // Lighter background for freshness
      fontFamily: "'Inter', sans-serif",
      color: '#333',
      boxSizing: 'border-box',
    },
    appHeader: {
      backgroundColor: '#34495e', // Darker, professional blue/gray
      color: 'white',
      padding: '20px 0',
      textAlign: 'center',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      marginBottom: '30px',
    },
    appTitle: {
      margin: 0,
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '1px',
    },
    mainContent: {
      display: 'flex',
      flex: 1,
      gap: '30px',
      padding: '0 40px 60px', // Adjusted padding
      maxWidth: '1400px', // Increased max-width for more space
      margin: '0 auto',
      width: '100%',
      boxSizing: 'border-box',
      alignItems: 'flex-start', // Align items to the top
    },
    sectionBox: { // Reusable style for the main content sections
      backgroundColor: '#fff',
      borderRadius: '16px', // More rounded corners
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)', // Enhanced shadow
      padding: '30px',
      boxSizing: 'border-box',
    },
    videoSection: {
      flex: 2,
      display: 'flex',
      flexDirection: 'column',
      gap: '25px',
    },
    videoUploadArea: {
      textAlign: 'center',
      paddingBottom: '20px',
      borderBottom: '1px solid #e0e0e0', // Lighter border
    },
    uploadButton: {
      backgroundColor: '#2ecc71', // Vibrant green
      color: 'white',
      padding: '14px 30px', // Larger button
      borderRadius: '10px', // More rounded
      cursor: 'pointer',
      fontSize: '1.1rem',
      fontWeight: 600,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '12px',
      transition: 'background-color 0.3s ease, transform 0.2s ease',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      border: 'none', // Ensure no default border
    },
    uploadButtonHover: {
      backgroundColor: '#27ae60', // Darker green on hover
      transform: 'translateY(-3px)', // More pronounced lift
    },
    uploadIcon: {
      width: '24px', // Larger icon
      height: '24px',
      filter: 'brightness(0) invert(1)',
    },
    uploadedFilename: {
      marginTop: '15px',
      fontSize: '1rem', // Slightly larger font
      color: '#555',
      fontStyle: 'italic',
      fontWeight: 500,
    },
    chatSection: {
      flex: 1.5, // Adjusted flex for chat
      display: 'flex',
      flexDirection: 'column',
      minHeight: '500px', // Increased min-height
      position: 'relative',
      overflow: 'hidden', // Hide overflow for chat history
    },
    chatHistory: {
      flex: 1,
      overflowY: 'auto',
      paddingBottom: '20px', // Adjusted padding to make room for ChatBar
      paddingRight: '10px',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px', // Increased gap between messages
      scrollbarWidth: 'thin',
      scrollbarColor: '#a0a0a0 transparent', // Nicer scrollbar color
    },
    loadingMessage: {
        fontSize: '16px',
        color: '#007bff',
        margin: '20px 0',
        textAlign: 'center',
    },
    /* Commented out Image Matching Section styles as requested
    imageMatchSection: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    formGroup: {
      marginBottom: '15px',
      display: 'flex',
      flexDirection: 'column',
    },
    formLabel: {
      marginBottom: '5px',
      fontWeight: '600',
      color: '#555',
    },
    formInput: {
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '1rem',
    },
    submitButton: {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '12px 25px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 600,
        transition: 'background-color 0.3s ease',
        border: 'none',
        marginTop: '15px',
        display: 'block',
        width: '100%',
        boxSizing: 'border-box',
    },
    submitButtonHover: {
        backgroundColor: '#0056b3',
    },
    resultGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
        marginTop: '20px',
    },
    resultCard: {
        border: '1px solid #eee',
        borderRadius: '8px',
        padding: '15px',
        backgroundColor: '#fdfdfd',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        textAlign: 'center',
    },
    resultImage: {
        maxWidth: '100%',
        height: 'auto',
        borderRadius: '4px',
        marginBottom: '10px',
    },
    */
  };

  // State for upload button hover effect
  const [isUploadHovered, setIsUploadHovered] = useState(false);
  // Commented out Image Matching hover state as requested
  // const [isSubmitHovered, setIsSubmitHovered] = useState(false); // For image match submit button


  return (
    <div style={appStyles.appContainer}>
      {/* Global Styles for body, @keyframes, and media queries (essential for responsiveness with inline styles) */}
      <style>
        {`
          body {
            margin: 0;
            font-family: 'Inter', sans-serif; /* Fallback for Inter */
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          /* Custom scrollbar for Webkit browsers (Chrome, Safari) */
          ::-webkit-scrollbar {
            width: 8px;
          }
          ::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          ::-webkit-scrollbar-thumb {
            background: #a0a0a0; /* Match the new scrollbarColor */
            border-radius: 10px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #777; /* Darker on hover */
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          /* Media queries for responsiveness: This is where the magic happens for inline-style limitations */
          @media (max-width: 1200px) { /* Adjusted breakpoint */
            .mainContentFlex {
                flex-direction: column !important; /* Stack sections vertically */
                padding: 0 25px 50px !important; /* Adjust padding */
                gap: 25px !important; /* Adjust gap */
            }
            .sectionFlexItem {
                flex: none !important; /* Remove flex growing for stacked items */
                width: 100% !important; /* Make them full width */
            }
          }
          @media (max-width: 768px) {
            .appTitle {
              font-size: 2rem !important;
            }
            .mainContentFlex {
              padding: 0 15px 40px !important;
              gap: 20px !important;
            }
            .sectionBox {
              padding: 20px !important;
            }
            .uploadButton {
              padding: 10px 20px !important;
              font-size: 1rem !important;
            }
          }
        `}
      </style>

      <header style={appStyles.appHeader}>
        <h1 style={appStyles.appTitle}>Houzing Partners</h1>
      </header>

      <main style={appStyles.mainContent} className="mainContentFlex">
        {/* --- VIDEO ANALYSIS SECTION --- */}
        <section style={{...appStyles.videoSection, ...appStyles.sectionBox}} className="sectionFlexItem">
          <div style={appStyles.videoUploadArea}>
            <label
              htmlFor="video-upload"
              style={{
                ...appStyles.uploadButton,
                ...(isUploadHovered ? appStyles.uploadButtonHover : {}),
              }}
              onMouseEnter={() => setIsUploadHovered(true)}
              onMouseLeave={() => setIsUploadHovered(false)}
            >
              <img src={UploadIcon} alt="Upload Video" style={appStyles.uploadIcon} />
              <span>Upload Video</span>
            </label>
            <input
              id="video-upload"
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              style={{ display: "none" }}
              aria-label="Select video file"
            />
            {videoFile && <p style={appStyles.uploadedFilename}>Selected: {videoFile.name}</p>}
          </div>
          <VideoPlayer videoURL={videoURL} videoRef={videoRef} />
        </section>

        {/* --- CHAT AND VIDEO ANALYSIS RESULTS SECTION --- */}
        <section style={{...appStyles.chatSection, ...appStyles.sectionBox}} className="sectionFlexItem">
          <div style={appStyles.chatHistory}>
            {messages.map((msg, index) => (
              <Message
                key={index}
                type={msg.type}
                text={msg.text}
                relevantOccurrences={msg.relevantOccurrences}
              />
            ))}
            {loadingAnalysis && <LoadingSpinner />}
            {analysisError && <p style={{ color: 'red', textAlign: 'center' }}>Error: {analysisError}</p>}
            <div ref={messagesEndRef} />
          </div>
          <ChatBar onSubmit={handleAsk} loading={loadingAnalysis} />
        </section>

        {/* --- NEW: IMAGE MATCHING SECTION (COMMENTED OUT) --- */}
        {/*
        <section style={{...appStyles.imageMatchSection, ...appStyles.sectionBox}} className="sectionFlexItem">
            <h2>Image Matching in Video</h2>
            <form onSubmit={handleImageMatchSubmit}>
                <div style={appStyles.formGroup}>
                    <label htmlFor="query-image-upload" style={appStyles.formLabel}>Upload Query Image:</label>
                    <input
                        type="file"
                        id="query-image-upload"
                        accept="image/*"
                        onChange={handleQueryImageChange}
                        style={appStyles.formInput}
                    />
                    {queryImageMatchError && <p style={{ color: 'red', fontSize: '0.8em', marginTop: '5px' }}>{queryImageMatchError}</p>}
                </div>
                <div style={appStyles.formGroup}>
                    <label htmlFor="video-uri-match" style={appStyles.formLabel}>GCS Video URI to Search In:</label>
                    <input
                        type="text"
                        id="video-uri-match"
                        // AUTOFILL LOGIC: Use videoUriForMatch if it has a value (user typed),
                        // otherwise use lastUploadedVideoGCSUri (from video analysis upload)
                        value={videoUriForMatch || lastUploadedVideoGCSUri}
                        onChange={handleVideoUriForMatchChange}
                        placeholder="e.g., gs://your-video-bucket/uploads/your_video.mp4"
                        style={appStyles.formInput}
                    />
                    {videoUriMatchInputError && <p style={{ color: 'red', fontSize: '0.8em', marginTop: '5px' }}>{videoUriMatchInputError}</p>}
                </div>
                <div style={{...appStyles.formGroup, flexDirection: 'row', gap: '20px', alignItems: 'center'}}>
                    <div>
                        <label htmlFor="similarity-threshold" style={appStyles.formLabel}>Similarity Threshold (0-1):</label>
                        <input
                            type="number"
                            id="similarity-threshold"
                            step="0.01"
                            min="0"
                            max="1"
                            value={similarityThreshold}
                            onChange={handleSimilarityThresholdChange}
                            style={{...appStyles.formInput, width: '80px'}}
                        />
                    </div>
                    <div>
                        <label htmlFor="frame-interval" style={appStyles.formLabel}>Frame Sampling Interval (seconds):</label>
                        <input
                            type="number"
                            id="frame-interval"
                            step="1"
                            min="1"
                            value={frameSamplingInterval}
                            onChange={handleFrameSamplingIntervalChange}
                            style={{...appStyles.formInput, width: '80px'}}
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    // Disable button if loading or if neither a manual URI nor a last uploaded URI is available
                    disabled={loadingMatch || (!videoUriForMatch && !lastUploadedVideoGCSUri)}
                    style={{
                        ...appStyles.submitButton,
                        ...(isSubmitHovered ? appStyles.submitButtonHover : {}),
                    }}
                    onMouseEnter={() => setIsSubmitHovered(true)}
                    onMouseLeave={() => setIsSubmitHovered(false)}
                >
                    {loadingMatch ? 'Matching Image...' : 'Match Image in Video'}
                </button>
            </form>

            {/* Displaying loading spinner and match error for the Image Matching section }
            {loadingMatch && <LoadingSpinner />}
            {matchError && <p style={{ color: 'red', textAlign: 'center' }}>Error: {matchError}</p>}

            {matchResult && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Matching Results:</h3>
                    {matchResult.queryImageUrl && (
                        <p style={{textAlign: 'center', marginBottom: '20px'}}>
                            <strong>Query Image:</strong>
                            <img src={matchResult.queryImageUrl} alt="Query" style={{ maxWidth: '150px', height: 'auto', display: 'block', margin: '10px auto' }} />
                        </p>
                    )}
                    {matchResult.results && matchResult.results.length > 0 ? (
                        <div style={appStyles.resultGrid}>
                            {matchResult.results.map((match, index) => (
                                <div key={index} style={appStyles.resultCard}>
                                    <p><strong>Time:</strong> {match.timestamp}</p>
                                    <p><strong>Similarity:</strong> {match.similarity.toFixed(4)}</p>
                                    {match.imageUrl && (
                                        <img
                                            src={match.imageUrl}
                                            alt={`Match at ${match.timestamp}`}
                                            style={appStyles.resultImage}
                                        />
                                    )}
                                    {!match.imageUrl && (
                                        <p style={{color: 'gray', fontSize: '0.85em'}}>No image found/generated.</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No matching frames found for the query image above the set threshold.</p>
                    )}
                </div>
            )}
        </section>
        */}
      </main>
    </div>
  );
}

export default App;