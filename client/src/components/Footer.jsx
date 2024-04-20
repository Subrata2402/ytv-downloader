import React from 'react';
// import { Link } from 'react-router-dom';
import { FaFacebook, FaGithub, FaInstagram } from 'react-icons/fa';
import { IoLogoGoogleplus } from 'react-icons/io';

function Footer() {
    return (
        <footer className="container bg-primary text-white text-center fs-5`">
            <div className="row align-items-center">
                <div className="col-md-4 my-2 d-flex align-items-center justify-content-center">
                    <img src="youtube_logo.png" alt="Youtube" height={40} width={40} className='img-fluid rounded' />
                    <div className="mx-2">Youtube Video Downloader</div>
                </div>
                <div className='col-md-4'>
                    {/* <Link to="/about" className="text-white mx-2">About</Link> */}
                    <a href="https://github.com/subrata2402" className='mx-2 text-white' target='_blank'><FaGithub /></a>
                    <a href="#" className='mx-2 text-white' target='_blank'><IoLogoGoogleplus /></a>
                    <a href="#" className='mx-2 text-white' target='_blank'><FaFacebook /></a>
                    <a href="#" className='mx-2 text-white' target='_blank'><FaInstagram /></a>
                </div>
                <div className="col-md-4 my-2">
                    <p className='m-0'>Made with ❤️ by <a href="/" className="text-white">Subrata</a></p>
                </div>
            </div>
        </footer>
    )
}

export default Footer;