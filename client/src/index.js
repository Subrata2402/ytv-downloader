import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Downloader from './components/Downloader';
import Playlist from './components/Playlist';

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        // loader: rootLoader,
        children: [
            {
                path: "/",
                element: <Downloader />,
            },
            {
                path: "/video",
                element: <Downloader />,
            },
            {
                path: "/playlist",
                element: <Playlist />,
            },
        ],
    },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={router}>
        <App />
    </RouterProvider>
);