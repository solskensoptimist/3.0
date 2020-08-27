import React, {useEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom';
import Icon from 'components/icon';

/**
 * Dropdown component, should be used with <DropdownItem>.
 *
 * props.children - Should be array of <DropdownItem>.
 * props.direction - string (optional) - 'left' | 'right - 'If the content is going to be placed right or left, defaults to right.
 * props.displayValue - string - Value to be displayed at top (such as active value, placeholder etc...)
 * props.transparent - boolean (optional) - If we want the holder to be transparent.
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
                <div className={props.transparent ? 'dropdownWrapper__dropdown__headerTransparent' : 'dropdownWrapper__dropdown__header'}>
                    <p>{props.displayValue}</p>
                    {showDropdown ? <Icon val='upArrowRounded'/> : <Icon val='downArrowRounded'/>}
                </div>
                {showDropdown &&
                <div className={(props.direction === 'left') ?
                        'dropdownWrapper__dropdown__contentLeft':
                        'dropdownWrapper__dropdown__contentRight'}
                >
                    {props.children}
                </div>
                }
            </div>
        </div>
    );
};
