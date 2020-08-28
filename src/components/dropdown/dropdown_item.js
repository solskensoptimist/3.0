import React from 'react';
import Icon from 'components/icon';

/**
 * Item for <Dropdown>
 *
 * props.active - boolean - Sets active class, and shows check/checkbox.
 * props.hideCheckbox - boolean (optional) - If we want to hide checkbox.
 * props.label - string - Text to be displayed.
 * props.onClick - func - Handler for onClick.
 */
export const DropdownItem = (props) => {
    return (
        <div className={(props.hideCheckbox) ?
            'dropdownNoCheckboxItemWrapper' :
            'dropdownItemWrapper'}
             onClick={props.onClick}>
            <div className={props.active ? 'dropdownItemWrapper__dropdownItemActive' : 'dropdownItemWrapper__dropdownItem'}>
                {props.label}
                {props.active ? <Icon val='check'/> : <Icon val='checkbox'/>}
            </div>
        </div>
    );
};
