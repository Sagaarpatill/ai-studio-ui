// src/components/Message.js

import React from 'react';
import LoadingSpinner from './LoadingSpinner'; // Keep if you use it for message loading states, otherwise can remove

const Message = ({ type, text, relevantOccurrences, isLoading }) => {
    // Determine styles based on message type (user, ai, info, error)
    const messageContainerStyle = {
        display: 'flex',
        justifyContent: type === 'user' ? 'flex-end' : 'flex-start',
        marginBottom: '10px',
    };

    const messageContentStyle = {
        maxWidth: '70%',
        padding: '12px 18px',
        borderRadius: '20px',
        fontSize: '1rem',
        lineHeight: '1.5',
        wordWrap: 'break-word',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
        backgroundColor: type === 'user' ? '#007bff' : '#e9ecef', // Blue for user, light grey for AI/info/error
        color: type === 'user' ? 'white' : '#333',
        border: type === 'error' ? '1px solid #dc3545' : 'none', // Red border for error
    };

    const infoErrorStyle = {
        backgroundColor: type === 'info' ? '#d1ecf1' : (type === 'error' ? '#f8d7da' : '#e9ecef'),
        color: type === 'info' ? '#0c5460' : (type === 'error' ? '#721c24' : '#333'),
        textAlign: 'center',
        fontWeight: type === 'info' ? 'normal' : 'bold',
        fontStyle: type === 'info' ? 'italic' : 'normal',
    };

    const relevantOccurrencesContainerStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '15px',
        marginTop: '15px',
        justifyContent: 'center', // Center images
    };

    const occurrenceItemStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '180px', // Fixed width for each image container
        borderRadius: '8px',
        overflow: 'hidden', // Hide overflow if image is too big
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
        padding: '10px',
        textAlign: 'center',
    };

    const occurrenceImageStyle = {
        width: '100%',
        height: '120px', // Fixed height for consistency
        objectFit: 'cover', // Crop image to fit without stretching
        borderRadius: '4px',
        marginBottom: '8px',
    };

    const occurrenceDescriptionStyle = {
        fontSize: '0.85rem',
        color: '#555',
        marginBottom: '4px',
    };

    const occurrenceTimestampStyle = {
        fontSize: '0.75rem',
        color: '#888',
    };

    // Apply specific styles for info/error messages
    const finalContentStyle = (type === 'info' || type === 'error')
        ? { ...messageContentStyle, ...infoErrorStyle }
        : messageContentStyle;

    return (
        <div style={messageContainerStyle}>
            <div style={finalContentStyle}>
                {text}
                {isLoading && <LoadingSpinner />} {/* Optionally show spinner inside message */}

                {/* Render relevantOccurrences if provided and not empty */}
                {relevantOccurrences && relevantOccurrences.length > 0 && (
                    <>
                        <p style={{marginTop: '15px', marginBottom: '10px', fontWeight: 'bold', color: type === 'user' ? 'white' : '#333'}}>Relevant Moments:</p>
                        <div style={relevantOccurrencesContainerStyle}>
                            {relevantOccurrences.map((occurrence, index) => (
                                <div key={index} style={occurrenceItemStyle}>
                                    <img
                                        src={occurrence.imageUrl}
                                        alt={occurrence.description || "Video moment"}
                                        style={occurrenceImageStyle}
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/180x120?text=Image+Load+Error'; }} // Fallback for image load error
                                    />
                                    <p style={occurrenceDescriptionStyle}>{occurrence.description}</p>
                                    <p style={occurrenceTimestampStyle}>({occurrence.timestamp})</p>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Message;