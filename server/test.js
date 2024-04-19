const fs = require('fs');
const path = require('path');
const ytdl = require('ytdl-core');


async function downloadVideo(videoUrl) {
    const videoInfo = await ytdl.getInfo(videoUrl);
    const videoTitle = videoInfo.videoDetails.title;
    const videoFormats = videoInfo.formats;
    const videoFormat = ytdl.chooseFormat(videoFormats, { qualityLabel: '1440p' });
    const videoStream = ytdl.downloadFromInfo(videoInfo, { format: videoFormat });
    console.log(videoStream);
}

downloadVideo('https://www.youtube.com/watch?v=k85mRPqvMbE');