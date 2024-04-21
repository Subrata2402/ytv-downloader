import React from 'react';

function InputBox(props) {
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
                    />
                    <button className="btn btn-primary" type="button" disabled={props.loading} onClick={props.handleGetInfo}>Download</button>
                </div>
            </div>
        </div>
    )
}

export default InputBox;