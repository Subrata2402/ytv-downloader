import React, { useState } from 'react';
import { RotatingLines } from 'react-loader-spinner';
import { FaVideo } from 'react-icons/fa';
import { SiApplemusic } from 'react-icons/si';
import { FaDownload } from 'react-icons/fa';
// const BASE_URL = 'https://ytv-downloader.onrender.com/api';
const BASE_URL = 'http://localhost:5000/api';

function Downloader() {
    const [url, setUrl] = useState('');
    const [videoDetails, setVideoDetails] = useState(false);
    const [audioFormats, setAudioFormats] = useState([]);
    const [formats, setFormats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [audioSize, setAudioSize] = useState(0);

    const sizeConverter = (bytes) => {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return 'n/a';
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        if (i === 0) return bytes + ' ' + sizes[i];
        return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
    }

    const handleGetInfo = async () => {
        if (!url) return alert("URL is required");
        setLoading(true);
        const response = await fetch(`${BASE_URL}/get-info?videoId=${url}`);
        const responseData = await response.json();
        if (responseData.success) {
            setVideoDetails(responseData.videoDetails);
            setFormats(responseData.formats);
            setAudioSize(Number(responseData.audioFormat.contentLength));
            setAudioFormats(responseData.audioFormats);
        } else {
            alert(responseData.message);
        }
        setLoading(false);
    }

    const handleVideoDownload = async (itag) => {
        const link = document.createElement('a');
        link.href = `${BASE_URL}/download-video?url=${url}&itag=${itag}`;
        link.setAttribute('download', videoDetails.title + '.mp4');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log('Downloaded');
    }

    const handleAudioDownload = async (itag) => {
        const link = document.createElement('a');
        link.href = `${BASE_URL}/download-audio?url=${url}&itag=${itag}`;
        link.setAttribute('download', videoDetails.title + '.mp3');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <div className="container">
            <div className="bg-primary p-3 rounded mt-3 d-flex justify-content-center align-items-center">
                <img src="youtube_logo.png" alt="Youtube Logo" height={80} width={80} className='img-fluid rounded' />
                <h1 className='fw-bold mx-3 text-white'>Youtube Video Downloader</h1>
            </div>
            <hr />
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Youtube Video URL e.g. https://www.youtube.com/watch?v=k85mRPqvMbE"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                        <button className="btn btn-primary" type="button" disabled={loading} onClick={handleGetInfo}>Download</button>
                    </div>
                </div>
            </div>
            {!loading ?
                // Display the video details
                <>
                    {videoDetails &&
                        <div className="row border rounded m-0 p-0 py-3 mb-4">
                            <div className="col-md-6">
                                <div className="card mb-3">
                                    <img src={videoDetails.thumbnails[videoDetails.thumbnails.length - 1].url} alt={videoDetails.title} className='img-fluid rounded' />
                                    <div className="card-body">
                                        <h5 className="card-title fw-bold">{videoDetails.title}</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 mb-3 table-responsive">
                                <table className='table table-bordered table-striped table-hover text-center m-0'>
                                    <thead>
                                        <tr className='table-dark'>
                                            <th colSpan={3}>
                                                <div className='d-flex align-items-center justify-content-center'>
                                                    <FaVideo className='me-2' />Video
                                                </div>
                                            </th>
                                        </tr>
                                        <tr>
                                            <th>Quality</th>
                                            <th>Size</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {formats.map((format, index) => (
                                            <>
                                                {format.hasVideo && format.contentLength &&
                                                    <tr key={index}>
                                                        <td>{format.qualityLabel}</td>
                                                        <td>{sizeConverter(Number(format.contentLength) + audioSize)}</td>
                                                        <td className='d-flex justify-content-center'>
                                                            <button className="btn btn-warning d-flex align-items-center" onClick={() => handleVideoDownload(format.itag)}>
                                                                <FaDownload />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                }
                                            </>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-md-3 table-responsive">
                                <table className='table table-bordered table-hover table-striped text-center m-0'>
                                    <thead>
                                        <tr className='table-dark'>
                                            <th colSpan={3}>
                                                <div className='d-flex align-items-center justify-content-center'>
                                                    <SiApplemusic className='me-2' />
                                                    Audio
                                                </div>
                                            </th>
                                        </tr>
                                        <tr>
                                            <th>Quality</th>
                                            <th>Size</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {audioFormats.map((format, index) => (
                                            <>
                                                {format.contentLength &&
                                                    <tr key={index}>
                                                        <td>{format.audioBitrate}kbps</td>
                                                        <td>{sizeConverter(format.contentLength)}</td>
                                                        <td className='d-flex justify-content-center'>
                                                            <button className="btn btn-primary d-flex align-items-center" onClick={() => handleAudioDownload(format.itag)}>
                                                                <FaDownload />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                }
                                            </>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    }
                </>
                : <div className="d-flex justify-content-center align-items-center my-4">
                    <RotatingLines height='100' width='100' />
                </div>
            }
        </div>
    )
}

export default Downloader;