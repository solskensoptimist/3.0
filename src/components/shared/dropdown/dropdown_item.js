import React from 'react';

export const DropdownItem = (props) => {
    return (
        <div className='dropdownItemWrapper' onClick={props.onClick}>
            <div className={props.active ? 'dropdownItemWrapper__dropdownItem__active' : 'dropdownItemWrapper__dropdownItem'}>
                {props.label}
            </div>
        </div>
    );
};
