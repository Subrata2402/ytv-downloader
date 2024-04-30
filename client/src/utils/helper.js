// const BASE_URL = 'http://localhost:5002/api';
const BASE_URL = 'https://ytv-api.debdevcs.org/api';
// const BASE_URL = 'https://ytv-downloader.onrender.com/api';

const sizeConverter = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return 'n/a';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    if (i === 0) return bytes + ' ' + sizes[i];
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
};

export { BASE_URL, sizeConverter };