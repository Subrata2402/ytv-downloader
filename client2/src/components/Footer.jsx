import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaFacebook, FaGithub, FaInstagram } from 'react-icons/fa';
import { IoLogoGoogleplus } from 'react-icons/io';
import { BsTwitterX } from 'react-icons/bs';

function Footer() {
    const { pathname } = useLocation();

    return (
        <footer className="text-white text-center rounded mb-3">
            <div className="row align-items-center">
                <div className="col-md-4 my-2 d-flex align-items-center justify-content-center">
                    <img src="youtube_logo.png" alt="Youtube" height={40} width={40} className='img-fluid rounded' />
                    <div className="mx-2">
                        {pathname === '/playlist' ? "Youtube Playlist Downloader" : "Youtube Video Downloader"}
                    </div>
                </div>
                <div className='col-md-4'>
                    {/* <Link to="/about" className="text-white mx-2">About</Link> */}
                    <Link to="https://github.com/subrata2402" className='mx-2 text-white' target='_blank'><FaGithub /></Link>
                    <Link to="mailto:subrata3250das@gmail.com" className='mx-2 text-white' target='_blank'><IoLogoGoogleplus /></Link>
                    <Link to="https://facebook.com/subrata3250" className='mx-2 text-white'><FaFacebook /></Link>
                    <Link to="/" className='mx-2 text-white'><FaInstagram /></Link>
                    <Link to="https://twitter.com/Subrata3250" className='mx-2 text-white' target='_blank'><BsTwitterX /></Link>
                </div>
                <div className="col-md-4 my-2">
                    <p className='m-0'>Made with ❤️ by <Link to="/" className="text-white">Subrata</Link></p>
                </div>
            </div>
        </footer>
    )
}

export default Footer;