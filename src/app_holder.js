import React from 'react';
import Header from 'components/header';

/**
 * Root component which holds all other subcomponents.
 */
export const AppHolder = () => {
    return (
        <div>
            <Header />
            <div className='page-holder'>
            </div>
        </div>
    );
};
