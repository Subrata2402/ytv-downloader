import React, { useEffect, useState } from 'react';
import { RotatingLines } from 'react-loader-spinner';
import VideoDownloader from './VideoDownloader';
import AudioDownloader from './AudioDownloader';
import { BASE_URL } from '../utils/helper';
import RelatedVideos from './RelatedVideos';

function Downloader() {
    const [url, setUrl] = useState(sessionStorage.getItem('url') || '');
    const [videoDetails, setVideoDetails] = useState(false);
    const [audioFormats, setAudioFormats] = useState([]);
    const [formats, setFormats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [audioSize, setAudioSize] = useState(0);
    const [relatedVideos, setRelatedVideos] = useState([]);

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
            setRelatedVideos(responseData.relatedVideos);
        } else {
            alert(responseData.message);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetch(`${BASE_URL}/validateUrl?videoUrl=${url}`).then(res => res.json()).then(data => {
            if (data.validate) {
                handleGetInfo();
                sessionStorage.setItem('url', url);
            };
        });
    }, [url]);

    return (
        <>
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
                            <div className="col-md-4">
                                <div className="card mb-3">
                                    <img src={videoDetails.thumbnails[videoDetails.thumbnails.length - 1].url} alt={videoDetails.title} className='img-fluid rounded' />
                                    <div className="card-body">
                                        <h5 className="card-title fw-bold">{videoDetails.title}</h5>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4 mb-3 table-responsive">
                                <VideoDownloader formats={formats} audioSize={audioSize} videoId={videoDetails.videoId} />
                            </div>

                            <div className="col-md-4 mb-3 table-responsive">
                                <AudioDownloader audioFormats={audioFormats} videoId={videoDetails.videoId} />
                            </div>
                            <hr />
                            <div className="col-md-12">
                                <RelatedVideos relatedVideos={relatedVideos} setUrl={setUrl} getInfo={handleGetInfo} />
                            </div>
                        </div>
                    }
                </>
                : <div className="d-flex justify-content-center align-items-center my-4">
                    <RotatingLines height='100' width='100' />
                </div>
            }
        </>
    )
}

export default Downloader;