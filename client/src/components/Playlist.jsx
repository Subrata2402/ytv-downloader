import React, { useEffect, useState } from 'react'
import InputBox from './InputBox';
import { BASE_URL } from '../utils/helper';
import { BiSolidVideos } from 'react-icons/bi';
import Loader from '../utils/Loader';
import VideoDownloader from './VideoDownloader';
import AudioDownloader from './AudioDownloader';

function Playlist() {
    const [url, setUrl] = useState(sessionStorage.getItem('playlistUrl') || '');
    const [playlistLoader, setPlaylistLoader] = useState(false);
    const [videoLoader, setVideoLoader] = useState(false);
    const [loader, setLoader] = useState(false);
    const [playlistDetails, setPlaylistDetails] = useState(false);
    const [playlistVideos, setPlaylistVideos] = useState(false);
    const [videoData, setVideoData] = useState(false);

    const filterPlaylistId = (url) => {
        const urlParams = new URLSearchParams(new URL(url).search);
        if (urlParams.has('list')) {
            return urlParams.get('list');
        }
        return url;
    }

    const handleGetInfo = async () => {
        if (!url) return alert("URL is required");
        setVideoData(false);
        setPlaylistLoader(true);
        const playlistId = filterPlaylistId(url);
        const response = await fetch(`${BASE_URL}/get-playlist-info?playlistId=${playlistId}`);
        const responseData = await response.json();
        if (responseData.success) {
            setPlaylistDetails(responseData.data);
        } else {
            setPlaylistLoader(false);
            return alert(responseData.message);
        }
        setPlaylistLoader(false);
        setVideoLoader(true);
        const responseVideos = await fetch(`${BASE_URL}/get-playlist-items?playlistId=${playlistId}`);
        const responseDataVideos = await responseVideos.json();
        if (responseDataVideos.success) {
            setPlaylistVideos(responseDataVideos.data);
        } else {
            alert(responseDataVideos.message);
        }
        setVideoLoader(false);
    }

    const handleClick = async (video) => {
        setLoader(true);
        const response = await fetch(`${BASE_URL}/get-info?videoId=${video.resourceId.videoId}`);
        const responseData = await response.json();
        if (responseData.success) {
            setVideoData(responseData);
        } else {
            alert(responseData.message);
        }
        setLoader(false);
    }

    useEffect(() => {
        if (url.trim() === '') return;
        fetch(`${BASE_URL}/validate-playlist?playlistId=${url}`).then(res => res.json()).then(data => {
            if (data.success) {
                handleGetInfo();
                sessionStorage.setItem('playlistUrl', url);
            };
        });
    }, [url]);

    return (
        <>
            <InputBox
                url={url}
                setUrl={setUrl}
                loading={videoLoader}
                placeholder="https://youtube.com/playlist?list=PLUvfp5G8vYakJRao6jhREH4D6AHeyCA1Z"
                handleGetInfo={handleGetInfo}
            />
            {!playlistLoader ?
                <>
                    {playlistDetails &&
                        <div className="row border rounded m-0 p-0 py-2 mb-4">
                            <h4 className='text-center fw-bold'>{playlistDetails.title}</h4>
                            <hr />
                            <div className="col-md-4">
                                {!videoLoader && playlistVideos ?
                                    <div className="border p-2" style={{ maxHeight: "500px" }}>
                                        <div className='d-flex bg-success p-2 fw-bold fs-5 text-white align-items-center justify-content-center'>
                                            <BiSolidVideos className="me-2" />List of Videos
                                        </div>
                                        <div className='border mt-2' style={{ maxHeight: "390px", overflow: "auto" }}>
                                            <table className='table table-bordered table-striped m-0'>
                                                <thead>
                                                    <tr className='text-center'>
                                                        <th>#</th>
                                                        <th>Videos</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {playlistVideos.map((video, index) => (
                                                        <tr key={index} onClick={() => handleClick(video)} style={{cursor: "pointer"}}>
                                                            <td>{index + 1}</td>
                                                            <td className='d-flex'>
                                                                <img src={video.thumbnails.default?.url} alt={video.title} height={50} width={50} className='img-fluid rounded me-2' />
                                                                <span>{video.title}</span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    : <Loader />
                                }
                            </div>
                            {!loader ?
                                <>
                                    {videoData &&
                                        <>
                                            <div className="col-md-4 mb-3 table-responsive">
                                                <VideoDownloader formats={videoData.formats} audioSize={Number(videoData.audioFormat.contentLength)} videoId={videoData.videoDetails.videoId} />
                                            </div>

                                            <div className="col-md-4 mb-3 table-responsive">
                                                <AudioDownloader audioFormats={videoData.audioFormats} videoId={videoData.videoDetails.videoId} />
                                            </div>
                                        </>
                                    }
                                </>
                                : <div className="col-md-8">
                                    <Loader />
                                </div>}
                        </div>
                    }
                </>
                : <Loader />}

        </>
    )
}

export default Playlist;