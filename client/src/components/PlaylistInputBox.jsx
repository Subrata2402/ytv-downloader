import React from 'react';

function PlaylistInputBox(props) {

    return (
        <div className="row">
            <div className="col-md-8 offset-md-2">
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder={props.placeholder}
                        value={props.url}
                        onChange={(e) => props.setUrl(e.target.value)}
                        disabled={props.loading}
                    />
                    <button className="btn btn-primary" type="button" disabled={props.loading} onClick={props.handleGetInfo}>Search</button>
                </div>
            </div>
        </div>
    )
}

export default PlaylistInputBox;