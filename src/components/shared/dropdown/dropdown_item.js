import React from 'react';
import Icon from 'components/shared/icon';

/**
 * Item for <Dropdown>
 *
 * props.active - Sets active class.
 * props.label - Text to be displayed.
 * props.onClick - Handler for onClick.
 */
export const DropdownItem = (props) => {
    return (
        <div className='dropdownItemWrapper' onClick={props.onClick}>
            <div className={props.active ? 'dropdownItemWrapper__dropdownItemActive' : 'dropdownItemWrapper__dropdownItem'}>
                {props.label}
                {props.active ? <Icon val='check'/> : <Icon val='checkbox'/>}
            </div>
        </div>
    );
};
