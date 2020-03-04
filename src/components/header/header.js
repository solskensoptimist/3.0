import React from 'react';
import Breadcrumbs from './breadcrumbs';
import Navigation from './navigation';
import Search from './search';

export default () => {
    return (
        <div className='header-wrapper'>
            <Search />
            <Breadcrumbs />
            <Navigation />
        </div>
    );
};
