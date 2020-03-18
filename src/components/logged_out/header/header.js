import React from 'react';
import Navigation from './navigation';
import Logotype from "components/common/logotype/logotype";

export default () => {
    return (
        <div className='headerWrapper'>
            <Logotype />
            <div className='headerWrapper__header'>
                <div className='headerWrapper__header__top'>
                    <div className='headerWrapper__header__top__left'>
                        left
                    </div>
                    <div className='headerWrapper__header__top__right'>
                        right
                    </div>
                </div>
                <Navigation />
            </div>
        </div>
    );
};
