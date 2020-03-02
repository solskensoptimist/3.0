import React from 'react';
import Router from 'router';
import Navigation from 'components/navigation';
import Breadcrumbs from 'components/breadcrumbs';

/**
 * Root component which holds all other subcomponents.
 */
export const AppHolder = () => {
    return (
        <div>
            <Breadcrumbs />
            <Navigation />
            <div className='page-holder'>
                <Router />
            </div>
        </div>
    );
};
