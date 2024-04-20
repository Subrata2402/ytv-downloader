import React from 'react';
import { FaVideo, FaDownload } from 'react-icons/fa';
import { BASE_URL, sizeConverter } from '../utils/helper';

function VideoDownloader(props) {
    const { formats, audioSize, videoId } = props;

    const handleVideoDownload = async (itag) => {
        const link = document.createElement('a');
        link.href = `${BASE_URL}/download-video?videoId=${videoId}&itag=${itag}`;
        link.setAttribute('download', 'video.mp4');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <div className='border p-2' style={{ maxHeight: "380px" }}>
            <div className='d-flex bg-success p-2 fw-bold fs-5 text-white align-items-center justify-content-center'>
                <FaVideo className='me-2' />Video
            </div>
            <div className='border mt-2' style={{ maxHeight: "270px", overflow: "auto" }}>
                <table className='table table-bordered table-striped table-hover text-center m-0'>
                    <thead>
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
                                            <button className="btn btn-outline-primary d-flex align-items-center" onClick={() => handleVideoDownload(format.itag)}>
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
    )
}

export default VideoDownloader;