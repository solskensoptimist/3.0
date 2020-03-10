import React from 'react';
import Logotype from 'components/common/logotype';
import Navigation from './navigation';
import Search from './search';
import User from './user';

export default () => {
    return (
        <div className='headerWrapper'>
            <div className='header'>
                <div className='header__item1'>
                    <Logotype />
                </div>
                <div className='header__item2'>
                    <Search />
                </div>
                <div className='header__item3'>
                    <User />
                </div>
            </div>
            <div className='navigationWrapper'>
                <Navigation />
            </div>
        </div>
    );
};
