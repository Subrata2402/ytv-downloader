import React, { useEffect, useState } from 'react';
import { RotatingLines } from 'react-loader-spinner';
import VideoDownloader from './VideoDownloader';
import AudioDownloader from './AudioDownloader';
import { BASE_URL, getVideoId } from '../utils/helper';
import RelatedVideos from './RelatedVideos';
import InputBox from './InputBox';
import { toast } from 'react-toastify';
import { BiSolidVideos } from 'react-icons/bi';
import { useLocation } from 'react-router-dom';

function Video() {
    const [url, setUrl] = useState(sessionStorage.getItem('videoUrl') || '');
    const [videoDetails, setVideoDetails] = useState(false);
    const [audioFormats, setAudioFormats] = useState([]);
    const [formats, setFormats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [audioSize, setAudioSize] = useState(0);
    const [relatedVideos, setRelatedVideos] = useState([]);
    const [suggestKeywords, setSuggestKeywords] = useState([]);
    const [searchedVideos, setSearchedVideos] = useState(false);
    const { search, state } = useLocation();

    /**
     * Fetches videos based on the provided query.
     *
     * @param {string} query - The search query for videos.
     * @returns {Promise<void>} - A promise that resolves when the videos are fetched.
     */
    const handleGetVideos = async (query) => {
        const response = await fetch(`${BASE_URL}/search-video?query=${query}`).then(res => res.json());
        if (response.success) {
            // Set the searched videos
            setSearchedVideos(response.videos);
            toast.success('Videos fetched successfully');
        } else {
            toast.error(response.message);
        }
        setLoading(false);
    }


    /**
     * Fetches video details and related information based on the provided URL or keyword.
     * @param {string} [keyword=""] - The keyword to search for. Defaults to an empty string.
     * @returns {Promise<void>} - A promise that resolves once the video details are fetched.
     */
    const handleGetInfo = async (keyword="") => {
        if (!url) return toast.error('Please enter a valid URL');
        setLoading(true); // Set loading to true
        toast.dismiss(); // Dismiss any previous toasts
        // Reset the states
        setSearchedVideos(false); setVideoDetails(false);
        let query = url.replaceAll(" ", "+"); // Replace all spaces with '+'
        if (keyword !== "") {
            query = keyword.replaceAll(" ", "+");
        }
        const response = await fetch(`${BASE_URL}/get-info?videoId=${getVideoId(query)}`).then(res => res.json());
        if (response.success) {
            setVideoDetails(response.data?.videoDetails);
            setFormats(response.data?.formats);
            setAudioSize(Number(response.data?.audioFormat.contentLength));
            setAudioFormats(response.data?.audioFormats);
            setRelatedVideos(response.data?.relatedVideos);
            // set state to the current URL
            window.history.pushState({}, '', `/video?videoUrl=${query}`);
            // console.log(state);
            toast.success('Video details fetched successfully');
            setLoading(false);
        } else {
            handleGetVideos(query);
        }
    }

    useEffect(() => {
        if (search) {
            const query = new URLSearchParams(search);
            if (query.has('videoUrl')) {
                // Set the video URL from the query parameter
                setUrl(query.get('videoUrl'));
            }
        }
    }, [search]);

    useEffect(() => {
        if (url.trim() === '') return;
        const rawUrl = url.replaceAll(" ", "+");
        fetch(`${BASE_URL}/validate-url?videoUrl=${rawUrl}`).then(res => res.json()).then(data => {
            if (data.validate) {
                // Fetch the video details if the URL is valid
                handleGetInfo();
                sessionStorage.setItem('videoUrl', url);
            } else {
                // Fetch the suggest keywords if the URL is invalid
                fetch(`${BASE_URL}/suggest-keywords?q=${rawUrl}`).then(res => res.json()).then(data => {
                    if (data.success) {
                        setSuggestKeywords(data.suggestKeywords);
                    }
                });
            }
        });
    }, [url]);

    return (
        <>
            <InputBox
                url={url}
                setUrl={setUrl}
                loading={loading}
                suggestKeywords={suggestKeywords}
                placeholder="Search or paste the video URL here..."
                handleGetInfo={handleGetInfo}
            />
            {!loading ?
                // Display the video details
                <>
                    {videoDetails &&
                        <div className="row border rounded m-0 p-0 py-3 mb-4">
                            <div className="col-md-4">
                                <div className="card mb-3">
                                    {/* <img src={videoDetails.thumbnails[videoDetails.thumbnails.length - 1].url} alt={videoDetails.title} className='img-fluid rounded' /> */}
                                    <iframe height={230} src={`https://www.youtube.com/embed/${videoDetails.videoId}`} title={videoDetails.title} className='rounded' allowFullScreen></iframe>
                                    <div className="card-body">
                                        <h5 className="card-title fw-bold">{videoDetails.title}</h5>
                                    </div>
                                </div>
                            </div>

                            {!videoDetails.isLiveContent ?
                                <>
                                    <div className="col-md-4 mb-3 table-responsive">

                                        {/* Video Downloader Component */}
                                        <VideoDownloader formats={formats} audioSize={audioSize} videoId={videoDetails.videoId} />

                                    </div>

                                    <div className="col-md-4 mb-3 table-responsive">

                                        {/* Audio Downloader Component */}
                                        <AudioDownloader audioFormats={audioFormats} videoId={videoDetails.videoId} />

                                    </div>
                                </>
                                : <div className="col-md-8">

                                    {/* If the video is live then can't download this video and show this message */}
                                    <h4 className='fw-bold'>This is a live content, you can't download this video.</h4>

                                </div>
                            }
                            <hr />
                            <div className="col-md-12">
                                <h4 className='fw-bold text-center text-white d-flex align-items-center justify-content-center'><BiSolidVideos className="me-2" />Related Videos</h4>
                                <hr />
                                {/* Related Videos Component */}
                                <RelatedVideos Videos={relatedVideos} getInfo={handleGetInfo} />
                            </div>
                        </div>
                    }

                    {/* Searched Videos */}
                    {searchedVideos &&
                        <div className="row border rounded m-0 p-0 py-3 mb-4">
                            <div className="col-md-12">
                                <h4 className='fw-bold text-center text-white d-flex align-items-center justify-content-center'><BiSolidVideos className="me-2" />Searched Videos</h4>
                                <hr />
                                <RelatedVideos Videos={searchedVideos} getInfo={handleGetInfo} />
                            </div>
                        </div>
                    }

                </>
                : <div className="d-flex justify-content-center align-items-center my-4">
                    {/* Show this loader icon if the data isn't loaded completely */}
                    <RotatingLines height='100' width='100' />
                </div>
            }
        </>
    )
}

export default Video;