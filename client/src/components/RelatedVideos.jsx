import React from 'react';

function RelatedVideos(props) {
    const { relatedVideos, setUrl } = props;

    return (
        <div className='row'>
            {relatedVideos.map((video, index) => (
                <div key={index} className='col-lg-3 col-md-4 col-sm-6 col-12 mb-3'>
                    <div className='card h-100'>
                        <img src={video.thumbnails[video.thumbnails.length - 1].url} className='card-img-top' alt={video.title} />
                        <div className='card-body'>
                            <p className='m-0 fw-semibold' onClick={() => setUrl(`https://youtu.be/${video.id}`)} style={{cursor: "pointer"}}>{video.title}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default RelatedVideos;