import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import "./Navbar.css";

function Navbar() {
    const { pathname } = useLocation();

    return (
        <div className="navbar bg-primary">
            <div className="d-flex justify-content-center align-items-center">
                <img src="youtube_logo.png" alt="Youtube Logo" height={40} width={40} className='img-fluid rounded' />
                <div className='mx-3'>Youtube Video Downloader</div>
            </div>
            <div>
                <Link to="/video" className={`mx-2 ${pathname === "/video" ? "navlink-active" : ""}`}>Video</Link>
                <Link to="/playlist" className={pathname === "/playlist" ? "navlink-active" : ""}>Playlist</Link>
            </div>
        </div>
    )
}

export default Navbar;