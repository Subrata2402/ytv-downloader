// const BASE_URL = 'http://localhost:5002/api';
const BASE_URL = 'https://ytv-api.debdevcs.org/api';
// const BASE_URL = 'https://ytv-downloader.onrender.com/api';

/**
 * Converts the given number of bytes into a human-readable format.
 * @param {number} bytes - The number of bytes to convert.
 * @returns {string} The converted size in a human-readable format.
 */
const sizeConverter = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return 'n/a';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    if (i === 0) return bytes + ' ' + sizes[i];
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
};

const getVideoId = (url) => {
    let videoId = '';
    if (url.includes('youtube.com')) {
        videoId = url.split('v=')[1];
    } else if (url.includes('youtu.be')) {
        videoId = url.split('/')[3];
    } else {
        videoId = url;
    }
    return videoId;
}

export { BASE_URL, sizeConverter, getVideoId };