import React from 'react';
import {Router} from 'router';
import {NavigationComponent} from 'components/navigation';
import {BreadcrumbsComponent} from 'components/breadcrumbs';

/**
 * Root component which holds all other subcomponents.
 */
export const AppHolder = () => {
    return (
        <div>
            <BreadcrumbsComponent />
            <NavigationComponent />
            <div className='page-holder'>
                <Router />
            </div>
        </div>
    );
};
