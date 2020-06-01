import React from 'react';

/**
 * Item for <Dropdown>.
 * When you want a delimiter for groups of different items in dropdown.
 *
 * props.label - Text to be displayed.
 */
export const DropdownItemDelimiter = (props) => {
    return (
        <div className='dropdownItemDelimiterWrapper'>
            <div className='dropdownItemDelimiterWrapper__dropdownItemDelimiter'>
                {props.label}
            </div>
        </div>
    );
};
