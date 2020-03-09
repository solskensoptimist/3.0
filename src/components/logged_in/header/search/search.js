import React from 'react';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';

export default () => {
    return (
        <div className='search'>
            <div className='search__icon'>
                <SearchIcon />
            </div>
            <div className='search__input'>
                <InputBase placeholder="Sök…" />
            </div>
        </div>
    );
};
