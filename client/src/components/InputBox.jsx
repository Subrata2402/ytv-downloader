import React, { useRef, useState } from 'react';

function InputBox(props) {
    const [selectedItem, setSelectedItem] = useState(-1);
    const dropdownRef = useRef(null);

    /**
     * Handles the keydown event for the input box.
     * @param {Event} e - The keydown event object.
     */
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            // Hide the dropdown
            dropdownRef.current.classList.toggle('show');
            if (selectedItem !== -1) {
                // Set the selected item as the input value
                props.setUrl(props.suggestKeywords[selectedItem]);
                setSelectedItem(-1);
                // Get the info for the selected item
                props.handleGetInfo(props.suggestKeywords[selectedItem]);
            } else {
                // Get the info for the input value
                props.handleGetInfo();
            }
        } else if (e.key === 'ArrowDown') {
            if (selectedItem < props.suggestKeywords.length - 1) {
                setSelectedItem(selectedItem + 1);
            } else {
                setSelectedItem(0);
            }
        } else if (e.key === 'ArrowUp') {
            // Prevent the default behavior of the up arrow key
            if (selectedItem > 0) {
                setSelectedItem(selectedItem - 1);
            } else {
                setSelectedItem(props.suggestKeywords.length - 1);
            }
        }
    }

    /**
     * Handles the change event of the input box.
     *
     * @param {Object} e - The event object.
     */
    const handleOnChange = (e) => {
        // Set the input value
        props.setUrl(e.target.value);
        setSelectedItem(-1);
        // If the input value is empty or contains 'http', hide the dropdown
        if (dropdownRef.current.classList.contains('show') && e.target.value.trim() === '' || e.target.value.includes('http')) {
            dropdownRef.current.classList.remove('show');
        } else {
            dropdownRef.current.setAttribute('data-popper-placement', 'bottom-start');
            dropdownRef.current.classList.add('dropdown-style')
            dropdownRef.current.classList.add('show');
        }
    }

    /**
     * Handles the click event when a keyword is clicked.
     *
     * @param {string} keyword - The keyword that was clicked.
     */
    const handleClick = (keyword) => {
        props.setUrl(keyword);
        setSelectedItem(-1);
        dropdownRef.current.classList.remove('show');
        props.handleGetInfo(keyword);
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
                        disabled={props.loading} // Disable the input box when loading
                        onKeyDown={handleKeyDown}
                    />
                    <ul className="dropdown-menu" ref={dropdownRef}>
                        {props.suggestKeywords.map((keyword, index) => (
                            <li
                                key={index}
                                onClick={() => handleClick(keyword)}
                                className={`dropdown-item ${selectedItem === index ? 'active' : ''}`} // Highlight the selected item
                                id={index}
                                onKeyDown={handleKeyDown}
                            >
                                {keyword}
                            </li>
                        ))}
                    </ul>
                    <button className="btn btn-primary" type="button" disabled={props.loading} onClick={() => props.handleGetInfo()}>Search</button>
                </div>
            </div>
        </div>
    )
}

export default InputBox;