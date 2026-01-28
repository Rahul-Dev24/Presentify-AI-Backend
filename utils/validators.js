/**
 * Validate YouTube URL format
 */
export function validateYouTubeUrl(url) {
    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname;

        // Check for various YouTube domain formats
        const isYouTube =
            hostname === 'www.youtube.com' ||
            hostname === 'youtube.com' ||
            hostname === 'm.youtube.com' ||
            hostname === 'youtu.be';

        if (!isYouTube) {
            return false;
        }

        // Check for video ID
        const videoId = urlObj.searchParams.get('v') || urlObj.pathname.split('/').pop();

        if (!videoId || videoId.length < 10) {
            return false;
        }

        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Extract video ID from YouTube URL
 */
export function extractVideoId(url) {
    try {
        const urlObj = new URL(url);

        // youtube.com/watch?v=VIDEO_ID
        if (urlObj.searchParams.has('v')) {
            return urlObj.searchParams.get('v');
        }

        // youtu.be/VIDEO_ID
        if (urlObj.hostname === 'youtu.be') {
            return urlObj.pathname.slice(1);
        }

        return null;
    } catch (error) {
        return null;
    }
}
