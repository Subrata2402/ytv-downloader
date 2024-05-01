import React from 'react';
import { Link } from 'react-router-dom';

function RelatedVideos(props) {
    const { Videos, setUrl } = props;

    return (
        <div className='row'>
            {Videos.map((video, index) => (
                <div key={index} className='col-lg-3 col-md-4 col-sm-6 col-12 mb-3'>
                    <div className='card h-100'>
                        <div className="card-img-top" style={{ overflow: "hidden", position: "relative" }}>
                            <img
                                src={video.thumbnails[video.thumbnails.length - 1].url}
                                className='related-video-thumbnail'
                                alt={video.title}
                            />
                        </div>
                        <div className='card-body'>
                            <Link
                                className='m-0 fw-semibold'
                                to={`/video?videoUrl=https://youtu.be/${video.id}`}
                                target='_blank'
                                style={{ cursor: "pointer" }}
                                onMouseOver={(e) => e.target.style.textDecoration = "underline"}
                                onMouseOut={(e) => e.target.style.textDecoration = "none"}
                            >
                                {video.title}
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default RelatedVideos;