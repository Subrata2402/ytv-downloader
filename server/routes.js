const express = require('express');
const router = express.Router();
const ytdl = require('ytdl-core');
const ffmpegPath = require('ffmpeg-static');
const cp = require('child_process');

router.get('/get-info', async (req, res) => {
    const videoId = req.query.videoId || req.query.url;
    if (!videoId) {
        res.status(400).json({ success: false, message: "URL or Video Id is required" });
    }
    try {
        const info = await ytdl.getInfo(videoId);
        const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
        const audioFormat = ytdl.chooseFormat(audioFormats, { quality: 'highest' });
        res.status(200).json({ success: true, message: "Video info fetched successfully", videoDetails: info.videoDetails, formats: info.formats, audioFormat: audioFormat, audioFormats: audioFormats });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message, data: null });
    }
});

router.get('/download-video', async (req, res) => {
    const videoUrl = req.query.url;
    const itag = req.query.itag;
    if (!videoUrl) {
        res.status(400).json({ success: false, message: "URL is required" });
    }
    try {
        const videoInfo = await ytdl.getInfo(videoUrl);
        const videoTitle = videoInfo.videoDetails.title;
        const videoFormats = videoInfo.formats;
        const videoFormat = ytdl.chooseFormat(videoFormats, { quality: itag });
        const audioFormats = ytdl.filterFormats(videoFormats, 'audioonly');
        const audioFormat = ytdl.chooseFormat(audioFormats, { quality: 'highest' });
        const audioStream = ytdl.downloadFromInfo(videoInfo, { format: audioFormat });
        const videoStream = ytdl.downloadFromInfo(videoInfo, { format: videoFormat });
        const ffmpeg = cp.spawn(ffmpegPath, [
            '-i', 'pipe:3',
            '-i', 'pipe:4',
            '-c:v', 'copy',
            '-c:a', 'copy',
            '-movflags', 'frag_keyframe',
            '-f', 'mp4',
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
        audioStream.pipe(ffmpeg.stdio[3]);
        videoStream.pipe(ffmpeg.stdio[4]);
        const sanitizedVideoTitle = videoTitle.replace(/[^\w\s]/gi, ''); // Remove special characters from video title
        res.header('Content-Disposition', `attachment; filename="${sanitizedVideoTitle}.mp4"`);
        ffmpeg.stdio[5].pipe(res);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message, data: null });
    }
});

router.get('/download-audio', async (req, res) => {
    const videoUrl = req.query.url;
    const itag = req.query.itag;
    if (!videoUrl) {
        res.status(400).json({ success: false, message: "URL is required" });
    }
    try {
        const videoInfo = await ytdl.getInfo(videoUrl);
        const videoTitle = videoInfo.videoDetails.title;
        const audioFormats = ytdl.filterFormats(videoInfo.formats, 'audioonly');
        const audioFormat = ytdl.chooseFormat(audioFormats, { quality: itag });
        const audioStream = ytdl.downloadFromInfo(videoInfo, { format: audioFormat });
        const ffmpeg = cp.spawn(ffmpegPath, [
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
        ffmpeg.stdio[4].pipe(res);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message, data: null });
    }
});

module.exports = router;