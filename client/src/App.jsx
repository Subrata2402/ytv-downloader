import React from 'react';
import './App.css';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { Outlet, useLocation } from 'react-router-dom';
import VSiteInfo from './components/VSiteInfo';
import PSiteInfo from './components/PSiteInfo';

function App() {
    const { pathname } = useLocation();
    return (
        <div className='container'>
            <Navbar />
            <Outlet />
            { pathname === '/video' && <VSiteInfo /> }
            { pathname === '/' && <VSiteInfo /> }
            { pathname === '/playlist' && <PSiteInfo /> }
            <Footer />
        </div>
    )
}

export default App;