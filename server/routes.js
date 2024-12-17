const express = require('express');
const router = express.Router();
const ytdl = require("@distube/ytdl-core");
const ffmpegPath = require('ffmpeg-static');
const cp = require('child_process');

router.get('/validate-id', (req, res) => {
    const videoId = req.query.videoId;
    if (!videoId) {
        res.status(400).json({ success: false, message: "Video Id is required" });
    }
    try {
        const validate = ytdl.validateID(videoId);
        res.status(200).json({ success: true, validate: validate });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message, data: null });
    }
});

router.get('/validate-url', (req, res) => {
    const videoUrl = req.query.videoUrl;
    if (!videoUrl) {
        res.status(400).json({ success: false, message: "Video URL is required" });
    }
    try {
        const validate = ytdl.validateURL(videoUrl);
        res.status(200).json({ success: true, validate: validate });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message, data: null });
    }
});

router.get('/get-video-id', (req, res) => {
    const videoUrl = req.query.videoUrl;
    if (!videoUrl) {
        res.status(400).json({ success: false, message: "Video URL is required" });
    }
    try {
        const validate = ytdl.validateURL(videoUrl);
        if (validate) {
            const videoId = ytdl.getVideoID(videoUrl);
            if (videoId) {
                return res.status(200).json({ success: true, videoId: videoId });
            }
        }
        res.status(400).json({ success: false, validate: validate, message: "Invalid video URL" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message, data: null });
    }
});

router.get('/get-info', async (req, res) => {
    const videoId = req.query.videoId || req.query.url;
    if (!videoId) {
        res.status(400).json({ success: false, message: "Video Id is required" });
    }
    try {
        const info = await ytdl.getInfo(videoId);
        const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
        const audioFormat = ytdl.chooseFormat(audioFormats, { quality: 'highest' });
        res.status(200).json({ success: true, message: "Video info fetched successfully", data: {videoDetails: info.videoDetails, formats: info.formats, audioFormat: audioFormat, audioFormats: audioFormats, relatedVideos: info.related_videos} });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message, data: null });
    }
});

router.get('/search-video', async (req, res) => {
    const query = req.query.query;
    if (!query) {
        res.status(400).json({ success: false, message: "Query is required" });
    }
    try {
        const response = await fetch(`${process.env.YT_API_URI}/search?part=snippet&q=${query}&key=${process.env.YT_API_KEY}&maxResults=48&type=video&pageToken=${req.query.pageToken || ""}`).then(res => res.json());
        res.status(200).json({
            success: true,
            message: "Videos fetched successfully",
            videos: response.items.map((item) => ({
                title: item.snippet.title,
                id: item.id.videoId,
                thumbnails: Object.values(item.snippet.thumbnails).map(thumbnail => ({ url: thumbnail.url }))
            })),
            nextPageToken: response.nextPageToken,
            prevPageToken: response.prevPageToken,
            totalResults: response.pageInfo.totalResults
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message, data: null });
    }
});

router.get('/suggest-keywords', async (req, res) => {
    const query = req.query.q;
    if (!query) {
        res.status(400).json({ success: false, message: "Query is required" });
    }
    try {
        const response = await fetch(`http://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${query}`).then(res => res.json());
        res.status(200).json({ success: true, message: "Keywords fetched successfully", suggestKeywords: response[1] });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message, data: null });
    }
});

router.get('/download-video', async (req, res) => {
    const videoId = req.query.url || req.query.videoId;
    const itag = req.query.itag;
    if (!videoId) {
        res.status(400).json({ success: false, message: "Video Id is required" });
    }
    try {
        const videoInfo = await ytdl.getInfo(videoId);
        const videoTitle = videoInfo.videoDetails.title;
        const videoFormats = videoInfo.formats;
        const videoFormat = ytdl.chooseFormat(videoFormats, { quality: itag });
        const audioFormats = ytdl.filterFormats(videoFormats, 'audioonly');
        const audioFormat = ytdl.chooseFormat(audioFormats, { quality: 'highest' });
        const audioStream = ytdl.downloadFromInfo(videoInfo, { format: audioFormat });
        const videoStream = ytdl.downloadFromInfo(videoInfo, { format: videoFormat });
        res.header('Content-Length', Number(videoFormat.contentLength) + Number(audioFormat.contentLength));
        console.log(videoFormat.container);
        const ffmpeg = cp.spawn(ffmpegPath, [
            '-loglevel', '8', '-hide_banner',
            '-i', 'pipe:3',
            '-i', 'pipe:4',
            '-c:v', 'copy',
            '-c:a', 'copy',
            '-movflags', 'frag_keyframe',
            '-f', videoFormat.container,
            'pipe:5'
        ], {
            windowsHide: true,
            stdio: [
                'inherit',
                'inherit',
                'inherit',
                'pipe',
                'pipe',
                'pipe'
            ]
        });
        ffmpeg.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });
        console.log(ffmpeg.stdio);
        audioStream.pipe(ffmpeg.stdio[3]);
        videoStream.pipe(ffmpeg.stdio[4]);
        const sanitizedVideoTitle = videoTitle.replace(/[^\w\s]/gi, ''); // Remove special characters from video title
        res.header('Content-Disposition', `attachment; filename="${sanitizedVideoTitle}.${videoFormat.container}"`);
        res.header('Content-Type', 'video/mp4');
        res.header('Transfer-Encoding', 'chunked');
        ffmpeg.stdio[5].pipe(res);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message, data: null });
    }
});

router.get('/download-audio', async (req, res) => {
    const videoId = req.query.url || req.query.videoId;
    const itag = req.query.itag;
    if (!videoId) {
        res.status(400).json({ success: false, message: "Video Id is required" });
    }
    try {
        const videoInfo = await ytdl.getInfo(videoId);
        const videoTitle = videoInfo.videoDetails.title;
        const audioFormats = ytdl.filterFormats(videoInfo.formats, 'audioonly');
        const audioFormat = ytdl.chooseFormat(audioFormats, { quality: itag });
        const audioStream = ytdl.downloadFromInfo(videoInfo, { format: audioFormat });
        res.header('Content-Length', audioFormat.contentLength);
        const ffmpeg = cp.spawn(ffmpegPath, [
            '-loglevel', '8', '-hide_banner',
            '-i', 'pipe:3',
            '-f', 'mp3',
            'pipe:4'
        ], {
            windowsHide: true,
            stdio: [
                'inherit',
                'inherit',
                'inherit',
                'pipe',
                'pipe'
            ]
        });
        audioStream.pipe(ffmpeg.stdio[3]);
        const sanitizedVideoTitle = videoTitle.replace(/[^\w\s]/gi, ''); // Remove special characters from video title
        res.header('Content-Disposition', `attachment; filename="${sanitizedVideoTitle}.mp3"`);
        res.header('Content-Type', 'audio/mp3');
        res.header('Accept-Ranges', 'bytes');
        res.header('Cache-Control', 'no-cache');
        res.header('Transfer-Encoding', 'chunked');
        ffmpeg.stdio[4].pipe(res);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message, data: null });
    }
});

router.get('/get-playlist-items', async (req, res) => {
    const playlistId = req.query.playlistId;
    if (!playlistId) {
        res.status(400).json({ success: false, message: "Playlist Id is required" });
    }
    try {
        const response = await fetch(`${process.env.YT_API_URI}/playlistItems?part=snippet&playlistId=${playlistId}&key=${process.env.YT_API_KEY}&maxResults=50&pageToken=${req.query.pageToken || ''}`).then(res => res.json());
        res.status(200).json({ success: true, message: "Playlist fetched successfully", data: response.items.map((item) => item.snippet), nextPageToken: response.nextPageToken, prevPageToken: response.prevPageToken, totalResults: response.pageInfo.totalResults });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message, data: null });
    }
});

router.get('/get-playlist-info', async (req, res) => {
    const playlistId = req.query.playlistId;
    if (!playlistId) {
        res.status(400).json({ success: false, message: "Playlist Id is required" });
    }
    try {
        const response = await fetch(`${process.env.YT_API_URI}/playlists?part=snippet&id=${playlistId}&key=${process.env.YT_API_KEY}`).then(res => res.json());
        res.status(200).json({ success: true, message: "Playlist fetched successfully", data: response.items[0].snippet });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message, data: null });
    }
});

router.get('/validate-playlist', async (req, res) => {
    const playlistId = req.query.playlistId;
    if (!playlistId) {
        return res.status(400).json({ success: false, message: "Playlist Id is required" });
    }

    let errorOccurred = false;

    try {
        let response;
        if (playlistId.includes('playlist?list=')) {
            response = await fetch(playlistId);
        } else {
            response = await fetch(`https://youtube.com/playlist?list=${playlistId}`);
        }

        if (response.status !== 200) {
            errorOccurred = true;
            return res.status(400).json({ success: false, message: "Playlist not found" });
        }
    } catch (error) {
        errorOccurred = true;
        return res.status(400).json({ success: false, message: error.message, data: null });
    }

    if (!errorOccurred) {
        return res.status(200).json({ success: true, message: "Playlist is valid" });
    }
});

module.exports = router;