import React, {useEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom';

export const Dropdown = (props) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef();

    useEffect(() => {
        /**
         * When clicking outside dropdown, close it.
         */
        const _closePopup = (e) => {
            if (dropdownRef && dropdownRef.current) {
                const node = ReactDOM.findDOMNode(dropdownRef.current);
                if (node && !node.contains(e.target)) {
                    setShowDropdown(false);
                }
            }
        };

        window.addEventListener('mousedown', _closePopup);
        return () => window.removeEventListener('mousedown', _closePopup);
    }, [props]);

    return (
        <div className='dropdownWrapper' ref={dropdownRef}>
            <div className='dropdownWrapper__dropdown'>
                {!showDropdown &&
                    <div className='dropdownWrapper__dropdown__header' onClick={() => {setShowDropdown(true)}}>
                        {props.displayValue}
                    </div>
                }
                {showDropdown &&
                <div className='dropdownWrapper__dropdown__content'>
                    {props.children}
                </div>
                }
            </div>
        </div>
    );
};
