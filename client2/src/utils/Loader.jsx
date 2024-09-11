import React from 'react';
import { RotatingLines } from 'react-loader-spinner';

function Loader() {
    return (
        <div className="d-flex justify-content-center align-items-center h-100">
            <RotatingLines height='100' width='100' />
        </div>
    )
}

export default Loader;