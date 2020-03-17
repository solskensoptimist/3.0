import React from 'react';
import {NavLink} from "react-router-dom";
import tc from 'text_content';

/**
 * Navigation component.
 */
export default () => {
    return (
        <div className='navigation'>
            <div className='navigation__menu'>
                <NavLink exact to={'/'} key='varTjanst'>{tc.ourService}</NavLink>
                <NavLink exact to={'/priser'} key='priser'>{tc.prices}</NavLink>
                <NavLink exact to={'/team'} key='team'>{tc.team}</NavLink>
                <NavLink exact to={'/inloggning'} key='inloggning'>{tc.login}</NavLink>
            </div>
        </div>
    );
}
