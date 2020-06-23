import React, {useEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom';
import Icon from 'components/icon';

/**
 * Dropdown component, should be used with <DropdownItem>.
 *
 * props.children - Should be array of <DropdownItem>.
 * props.displayValue - If we want a value to be displayed at top (such as active value, placeholder etc...)
 * props.highlight - If we want to highlight display value (useful when in edit mode).
 */
export const Dropdown = (props) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        /**
         * When clicking outside events box, close it.
         */
        const _unmountDropdown = (e) => {
            if (dropdownRef && dropdownRef.current) {
                const node = ReactDOM.findDOMNode(dropdownRef.current);
                if (node && !node.contains(e.target)) {
                    setShowDropdown(false);
                }
            }
        };

        window.addEventListener('mousedown', _unmountDropdown);
        return () => window.removeEventListener('mousedown', _unmountDropdown);
    }, []);

    return (
        <div className='dropdownWrapper'
             onClick={() => {
                if (showDropdown) {
                    setTimeout(() => {
                        setShowDropdown(false);
                    }, 200);
                } else {
                    setShowDropdown(true);
                }
            }}
             ref={dropdownRef}
        >
            <div className='dropdownWrapper__dropdown'>
                <div className={props.highlight ? 'dropdownWrapper__dropdown__headerHighlight' : 'dropdownWrapper__dropdown__header'}>
                    <p>{props.displayValue}</p>
                    {showDropdown ? <Icon val='upArrow'/> : <Icon val='downArrow'/>}
                    {/*<div className={showDropdown ? 'dropdownWrapper__dropdown__upArrow' : 'dropdownWrapper__dropdown__downArrow'}/>*/}
                </div>
                {showDropdown &&
                <div className='dropdownWrapper__dropdown__content'>
                    {props.children}
                </div>
                }
            </div>
        </div>
    );
};
