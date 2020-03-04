import React from 'react';
import Navigation from './navigation';
import Search from './search';

export default () => {
    return (
        <div className='header'>
            <Search />
            <Navigation />
        </div>
    );
};
