import React  from 'react';
import Navigation from './navigation';
import User from './user';
import Logotype from 'components/shared/logotype/logotype';

export default () => {
    return (
        <div className='headerWrapper'>
            <div className='headerWrapper__header'>
                <div className='headerWrapper__header__top'>
                    <div className='headerWrapper__header__top__left'>
                        <Logotype />
                    </div>
                    <div className='headerWrapper__header__top__right'>
                        <User />
                    </div>
                </div>
                <Navigation />
            </div>
        </div>
    );
};
