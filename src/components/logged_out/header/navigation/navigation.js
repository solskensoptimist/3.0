import React from 'react';
import {NavLink} from "react-router-dom";
import {addRouteToHistory, history} from 'routing';
import tc from 'text_content';

/**
 * Navigation component.
 */
export default () => {
    return (
        <div className='navigation'>
            <div className='navigation__menu'>
                <NavLink exact onClick={() => {addRouteToHistory('hem')}} to={'/'} key='hem'>{tc.ourService}</NavLink>
                <NavLink exact onClick={() => {addRouteToHistory('priser')}} to={'/priser'} key='priser'>{tc.prices}</NavLink>
                <NavLink exact onClick={() => {addRouteToHistory('team')}} to={'/team'} key='team'>{tc.team}</NavLink>
                <NavLink v onClick={() => {addRouteToHistory('inloggning')}} to={'/inloggning'} key='inloggning'>{tc.login}</NavLink>
            </div>
        </div>
    );
}
