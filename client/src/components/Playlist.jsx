import React, { useEffect, useState } from 'react'
import InputBox from './InputBox';
import { BASE_URL } from '../utils/helper';
import { BiSolidVideos } from 'react-icons/bi';
import Loader from '../utils/Loader';
import VideoDownloader from './VideoDownloader';
import AudioDownloader from './AudioDownloader';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { toast } from 'react-toastify';

function Playlist() {
    const [url, setUrl] = useState(sessionStorage.getItem('playlistUrl') || '');
    const [playlistLoader, setPlaylistLoader] = useState(false);
    const [videoLoader, setVideoLoader] = useState(false);
    const [loader, setLoader] = useState(false);
    const [playlistDetails, setPlaylistDetails] = useState(false);
    const [playlistVideos, setPlaylistVideos] = useState(false);
    const [videoData, setVideoData] = useState(false);
    const [count, setCount] = useState(0);
    const [selectedVideoId, setSelectedVideoId] = useState({});

    const filterPlaylistId = (url) => {
        const urlParams = new URLSearchParams(new URL(url).search);
        if (urlParams.has('list')) {
            return urlParams.get('list');
        }
        return url;
    }

    const handleGetInfo = async () => {
        if (!url) return toast.error('Please enter a valid URL');
        setVideoData(false);
        setPlaylistLoader(true);
        toast.dismiss();
        const playlistId = filterPlaylistId(url);
        const response = await fetch(`${BASE_URL}/get-playlist-info?playlistId=${playlistId}`).then(res => res.json());
        if (response.success) {
            setPlaylistDetails(response.data);
        } else {
            setPlaylistLoader(false);
            return toast.error("Failed to fetch playlist details");
        }
        setPlaylistLoader(false);
        setVideoLoader(true);
        const responseVideos = await fetch(`${BASE_URL}/get-playlist-items?playlistId=${playlistId}`).then(res => res.json());
        if (responseVideos.success) {
            setPlaylistVideos(responseVideos);
            setCount(0);
            setSelectedVideoId(null);
        } else {
            toast.error("Failed to fetch playlist videos");
        }
        setVideoLoader(false);
    }

    const handleClick = async (videoId) => {
        setLoader(true);
        setSelectedVideoId(videoId);
        toast.dismiss();
        const response = await fetch(`${BASE_URL}/get-info?videoId=${videoId}`).then(res => res.json());
        if (response.success) {
            setVideoData(response);
        } else {
            toast.error("Failed to fetch video details");
        }
        setLoader(false);
    }

    const getNextVideos = async (pageToken, next) => {
        setVideoLoader(true);
        toast.dismiss();
        const playlistId = filterPlaylistId(url);
        const response = await fetch(`${BASE_URL}/get-playlist-items?playlistId=${playlistId}&pageToken=${pageToken}`).then(res => res.json());
        if (response.success) {
            setPlaylistVideos(response);
            if (next) {
                setCount(count + 50);
            } else {
                setCount(count - 50);
            }
        } else {
            toast.error("Failed to fetch playlist videos");
        }
        setVideoLoader(false);
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
                            <h3 className='text-center fw-bold'>{playlistDetails.title}</h3>
                            {videoData && <h5 className='text-center'>{videoData.videoDetails.title}</h5>}
                            <hr />
                            <div className="col-md-4">
                                {!videoLoader && playlistVideos ?
                                    <div className="border p-2" style={{ maxHeight: "520px" }}>
                                        <div className='d-flex bg-success p-2 fw-bold fs-5 text-white align-items-center justify-content-center'>
                                            <BiSolidVideos className="me-2" />List of Videos
                                        </div>
                                        <div className='border mt-2' style={{ maxHeight: "390px", overflow: "auto" }}>
                                            <table className='table table-bordered m-0'>
                                                <thead>
                                                    <tr className='text-center'>
                                                        <th>#</th>
                                                        <th>Videos</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {playlistVideos.data.map((video, index) => (
                                                        <tr key={index} onClick={() => handleClick(video.resourceId.videoId)} style={{ cursor: "pointer" }} className={selectedVideoId === video.resourceId.videoId && "table-success"}>
                                                            <td>{count + index + 1}</td>
                                                            <td className='d-flex'>
                                                                <img src={video.thumbnails.default?.url} alt={video.title} height={50} width={50} className='img-fluid rounded me-2' />
                                                                <span>{video.title}</span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className='text-center mt-2'>
                                            <button
                                                className='btn btn-primary px-4 me-2'
                                                disabled={!playlistVideos.prevPageToken}
                                                onClick={() => getNextVideos(playlistVideos.prevPageToken, false)}
                                            >
                                                <FaArrowLeft />
                                            </button>
                                            <button
                                                className='btn btn-primary px-4'
                                                disabled={!playlistVideos.nextPageToken}
                                                onClick={() => getNextVideos(playlistVideos.nextPageToken, true)}
                                            >
                                                <FaArrowRight />
                                            </button>
                                        </div>
                                    </div>
                                    : <Loader />
                                }

                            </div>
                            {!loader ?
                                <>
                                    {videoData ?
                                        <>
                                            <div className="col-md-4 mb-3 table-responsive">
                                                <VideoDownloader
                                                    formats={videoData.formats}
                                                    audioSize={Number(videoData.audioFormat.contentLength)}
                                                    videoId={videoData.videoDetails.videoId}
                                                />
                                            </div>

                                            <div className="col-md-4 mb-3 table-responsive">
                                                <AudioDownloader
                                                    audioFormats={videoData.audioFormats}
                                                    videoId={videoData.videoDetails.videoId}
                                                />
                                            </div>
                                        </>
                                        : <div className="col-md-8 d-flex align-items-center justify-content-center mt-3">
                                            <h3>Select a video to download</h3>
                                        </div>
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