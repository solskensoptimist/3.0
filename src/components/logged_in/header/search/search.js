import React from 'react';
import tc from 'text_content';

export default () => {
    return (
        <div className='search'>
            <div className='search__icon'>
                <i className="fas fa-search" />
            </div>
            <div className='search__input'>
                <input type='text' placeholder={tc.searchPlaceholder} />
            </div>
        </div>
    );
}
