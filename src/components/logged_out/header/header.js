import React from 'react';
import Navigation from './navigation';
import Logotype from "../../common/logotype/logotype";

export default () => {
    return (
        <div className='headerWrapper'>
            <div className='header'>
                <div className='header__item1'>
                    <Logotype />
                </div>
                <div className='header__item2'>
                    Header1
                </div>
                <div className='header__item3'>
                    Header2
                </div>
            </div>
            <div className='navigationWrapper'>
                <Navigation />
            </div>
        </div>
    );
};
