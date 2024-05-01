import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Video from './components/Video';
import Playlist from './components/Playlist';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        // loader: rootLoader,
        children: [
            {
                path: "/",
                element: <Video />,
            },
            {
                path: "/video",
                element: <Video />,
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
    <>
        <RouterProvider router={router}>
            <App />
        </RouterProvider>
        <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
        />
    </>
);