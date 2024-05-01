import React, { useRef, useState } from 'react';

function InputBox(props) {
    const [selectedItem, setSelectedItem] = useState(-1);
    const dropdownRef = useRef(null);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            dropdownRef.current.classList.toggle('show');
            if (selectedItem !== -1) {
                props.setUrl(props.suggestKeywords[selectedItem]);
                setSelectedItem(-1);
            }
            props.handleGetInfo();
        } else if (e.key === 'ArrowDown') {
            if (selectedItem < props.suggestKeywords.length - 1) {
                setSelectedItem(selectedItem + 1);
            } else {
                setSelectedItem(0);
            }
        } else if (e.key === 'ArrowUp') {
            if (selectedItem > 0) {
                setSelectedItem(selectedItem - 1);
            } else {
                setSelectedItem(props.suggestKeywords.length - 1);
            }
        }
    }

    const handleOnChange = (e) => {
        props.setUrl(e.target.value);
        setSelectedItem(-1);
        if (dropdownRef.current.classList.contains('show') && e.target.value.trim() === '' || e.target.value.includes('http')) {
            dropdownRef.current.classList.remove('show');
        } else {
            dropdownRef.current.setAttribute('data-popper-placement', 'bottom-start');
            dropdownRef.current.classList.add('dropdown-style')
            dropdownRef.current.classList.add('show');
        }
    }

    const handleClick = (keyword) => {
        props.setUrl(keyword);
        setSelectedItem(-1);
        dropdownRef.current.classList.remove('show');
        props.handleGetInfo();
    }

    return (
        <div className="row">
            <div className="col-md-8 offset-md-2">
                <div className="input-group mb-3 dropdown">
                    <input
                        type="search"
                        aria-label="Search"
                        className="form-control dropdown-toggle"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        placeholder={props.placeholder}
                        value={props.url}
                        onChange={handleOnChange}
                        disabled={props.loading}
                        onKeyDown={handleKeyDown}
                    />
                    <ul className="dropdown-menu" ref={dropdownRef}>
                        {props.suggestKeywords.map((keyword, index) => (
                            <li
                                key={index}
                                onClick={() => handleClick(keyword)}
                                className={`dropdown-item ${selectedItem === index ? 'active' : ''}`}
                                id={index}
                                onKeyDown={handleKeyDown}
                            >
                                {keyword}
                            </li>
                        ))}
                    </ul>
                    <button className="btn btn-primary" type="button" disabled={props.loading} onClick={props.handleGetInfo}>Search</button>
                </div>
            </div>
        </div>
    )
}

export default InputBox;