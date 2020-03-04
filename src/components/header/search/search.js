import React from 'react';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';

export default () => {
    return (
        <div>
            <div>
                <SearchIcon />
            </div>
            <InputBase placeholder="Sök…" />
        </div>
    );
};
