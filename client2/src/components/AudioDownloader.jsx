import React from 'react';
import { SiApplemusic } from 'react-icons/si';
import { FaDownload } from 'react-icons/fa';
import { BASE_URL, sizeConverter } from '../utils/helper';

function AudioDownloader(props) {
    const { audioFormats, videoId } = props;

    /**
     * Handles the audio download for a given itag.
     * @param {number} itag - The itag of the audio to be downloaded.
     */
    const handleAudioDownload = async (itag) => {
        const link = document.createElement('a');
        link.href = `${BASE_URL}/download-audio?videoId=${videoId}&itag=${itag}`;
        link.setAttribute('download', 'audio.mp3');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <div className='border p-2' style={{ maxHeight: "380px" }}>
            <div className='bg-success fw-bold fs-5 text-white p-2 d-flex align-items-center justify-content-center'>
                <SiApplemusic className='me-2' />
                Audio
            </div>
            <div className='border mt-2' style={{ maxHeight: "270px", overflow: "auto" }}>
                <table className='table table-bordered bg-dark table-hover table-striped text-center m-0'>
                    <thead>
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
                                            <button className="btn btn-outline-primary d-flex align-items-center" onClick={() => handleAudioDownload(format.itag)}>
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

export default AudioDownloader;