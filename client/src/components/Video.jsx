import React, { useEffect, useState } from 'react';
import { RotatingLines } from 'react-loader-spinner';
import VideoDownloader from './VideoDownloader';
import AudioDownloader from './AudioDownloader';
import { BASE_URL } from '../utils/helper';
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
    const { search } = useLocation();

    const handleGetVideos = async (query) => {
        const response = await fetch(`${BASE_URL}/search-video?query=${query}`).then(res => res.json());
        if (response.success) {
            setSearchedVideos(response.videos);
            toast.success('Videos fetched successfully');
        } else {
            toast.error(response.message);
        }
        setLoading(false);
    }


    const handleGetInfo = async () => {
        if (!url) return toast.error('Please enter a valid URL');
        setLoading(true);
        toast.dismiss();
        setSearchedVideos(false); setVideoDetails(false);
        const query = url.replaceAll(" ", "+");
        const response = await fetch(`${BASE_URL}/get-info?videoId=${query}`).then(res => res.json());
        if (response.success) {
            setVideoDetails(response.videoDetails);
            setFormats(response.formats);
            setAudioSize(Number(response.audioFormat.contentLength));
            setAudioFormats(response.audioFormats);
            setRelatedVideos(response.relatedVideos);
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
                setUrl(query.get('videoUrl'));
            }
        }
    }, [search]);

    useEffect(() => {
        if (url.trim() === '') return;
        const rawUrl = url.replaceAll(" ", "+");
        fetch(`${BASE_URL}/validateUrl?videoUrl=${rawUrl}`).then(res => res.json()).then(data => {
            if (data.validate) {
                handleGetInfo();
                sessionStorage.setItem('videoUrl', url);
            } else {
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
                                        <VideoDownloader formats={formats} audioSize={audioSize} videoId={videoDetails.videoId} />
                                    </div>

                                    <div className="col-md-4 mb-3 table-responsive">
                                        <AudioDownloader audioFormats={audioFormats} videoId={videoDetails.videoId} />
                                    </div>
                                </>
                                : <div className="col-md-8">
                                    <h4 className='fw-bold'>This is a live content, you can't download this video.</h4>
                                </div>
                            }
                            <hr />
                            <div className="col-md-12">
                                <h4 className='fw-bold text-center text-white d-flex align-items-center justify-content-center'><BiSolidVideos className="me-2" />Related Videos</h4>
                                <hr />
                                <RelatedVideos Videos={relatedVideos} setUrl={setUrl} getInfo={handleGetInfo} />
                            </div>
                        </div>
                    }
                    {searchedVideos &&
                        <div className="row border rounded m-0 p-0 py-3 mb-4">
                            <div className="col-md-12">
                                <h4 className='fw-bold text-center text-white d-flex align-items-center justify-content-center'><BiSolidVideos className="me-2" />Searched Videos</h4>
                                <hr />
                                <RelatedVideos Videos={searchedVideos} setUrl={setUrl} getInfo={handleGetInfo} />
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

export default Video;