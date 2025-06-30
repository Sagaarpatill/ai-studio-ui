import axios from 'axios';

const API_BASE_URL = 'https://video-analysis-service-812352403145.us-central1.run.app'; // Your deployed Cloud Run backend URL

export const analyzeVideo = async (videoFile, prompt) => {
    try {
        const formData = new FormData();
        formData.append('video', videoFile);
        formData.append('prompt', prompt);

        const response = await axios.post(`${API_BASE_URL}/analyze-video`, formData, { // Changed endpoint here!
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 600000, // Increased timeout to 10 minutes (600,000 ms) for large video processing
        });

        // The backend now sends 'answer' (text) and 'relevantOccurrences' (array of image objects)
        return response.data; // This will contain { answer: "...", relevantOccurrences: [...] }

    } catch (error) {
        console.error("Error in analyzeVideo API call:", error);
        // Re-throw the error so App.js can catch and display it
        throw error;
    }
};

// NEW FUNCTION: matchImageInVideo
export const matchImageInVideo = async (queryImageFile, videoUri, threshold = 0.85, interval = 5) => {
    try {
        const formData = new FormData();
        formData.append('queryImage', queryImageFile);
        formData.append('videoUri', videoUri);
        formData.append('threshold', threshold);
        formData.append('interval', interval);

        const response = await axios.post(`${API_BASE_URL}/match-image-in-video`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 600000, // Increased timeout to 10 minutes (600,000 ms)
        });

        return response.data; // This will contain { message: "...", queryImageUrl: "...", results: [...] }

    } catch (error) {
        console.error("Error in matchImageInVideo API call:", error);
        throw error;
    }
};