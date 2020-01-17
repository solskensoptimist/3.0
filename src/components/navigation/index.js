import React from 'react';
import {Link as RouterLink} from 'react-router-dom';

/**
 * Navigation component.
 */
export const NavigationComponent = () => {
    return (
        <nav>
            <ul>
                <li>
                    <RouterLink to='/inloggning'>Logga in</RouterLink>
                    <RouterLink to='/prospektera'>Prospektera</RouterLink>
                    <RouterLink to='/grupper'>Grupper</RouterLink>
                </li>
            </ul>
        </nav>
    );
};
