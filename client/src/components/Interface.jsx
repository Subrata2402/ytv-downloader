import React, { useState } from 'react';
import { RotatingLines } from 'react-loader-spinner';

function Interface() {
    const [url, setUrl] = useState('');
    const [videoDetails, setVideoDetails] = useState(false);
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
        if (!url) {
            alert("URL is required");
            return;
        }
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/get-info?videoId=${url}`);
        const responseData = await response.json();
        if (responseData.success) {
            setVideoDetails(responseData.videoDetails);
            setFormats(responseData.formats);
            setAudioSize(Number(responseData.audioFormat.contentLength));
        } else {
            alert(responseData.message);
        }
        setLoading(false);
    }

    const handleDownload = async (itag) => {
        const link = document.createElement('a');
        link.href = `http://localhost:5000/api/download-video?url=${url}&itag=${itag}`;
        link.setAttribute('download', videoDetails.title + '.mp4');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <div className="container">
            <div className="bg-primary p-3 rounded mt-3 d-flex justify-content-center align-items-center">
                <img src="youtube_logo.png" alt="Youtube Logo" height={80} width={80} className='img-fluid rounded' />
                <h1 className='fw-bold mx-3'>Youtube Video Downloader</h1>
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
                                    <iframe height={300} src={videoDetails.embed.iframeUrl} title={videoDetails.title} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" className='rounded' allowfullscreen></iframe>
                                    <div className="card-body">
                                        <h5 className="card-title">{videoDetails.title}</h5>
                                        {/* <a href={videoDetails.video_url} target="_blank" rel="noreferrer" className="btn btn-primary">Download</a> */}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <table className='table table-bordered table-striped text-center m-0'>
                                    <thead className='table-dark'>
                                        <tr>
                                            <th>Quality</th>
                                            <th>Size</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {formats.map((format, index) => (
                                            <>
                                                {format.hasVideo && format.container === 'mp4' &&
                                                    <tr key={index}>
                                                        <td>{format.qualityLabel}</td>
                                                        <td>{sizeConverter(Number(format.contentLength) + audioSize)}</td>
                                                        <td>
                                                            <button className="btn btn-primary" onClick={() => handleDownload(format.itag)}>Download</button>
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
                : <div className="d-flex justify-content-center align-items-center mt-4">
                    <RotatingLines height='100' width='100' />
                </div>
            }
        </div>
    )
}

export default Interface;