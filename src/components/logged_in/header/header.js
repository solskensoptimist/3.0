import React from 'react';
import Logotype from 'components/common/logotype';
import Navigation from './navigation';
import Search from './search';
import User from './user';

export default () => {
    return (
        <div className='header'>
            <div className='header__logotype'>
                <Logotype />
            </div>
            <div className='header__search'>
                <Search />
            </div>
            <div className='header__user'>
                <User />
            </div>
            <div className='header__navigation'>
                <Navigation />
            </div>
        </div>
    );
};
