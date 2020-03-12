import React from 'react';
import {NavLink} from "react-router-dom";
import {addRouteToHistory} from 'routing';
import tc from 'text_content';

/**
 * Navigation component.
 */
export default () => {
    return (
        <div className='navigation'>
            <div className='navigation__menu'>
                <NavLink exact onClick={() => {addRouteToHistory('varTjanst')}} to={'/'} key='varTjanst'>{tc.ourService}</NavLink>
                <NavLink exact onClick={() => {addRouteToHistory('priser')}} to={'/priser'} key='priser'>{tc.prices}</NavLink>
                <NavLink exact onClick={() => {addRouteToHistory('team')}} to={'/team'} key='team'>{tc.team}</NavLink>
                <NavLink onClick={() => {addRouteToHistory('inloggning')}} to={'/inloggning'} key='inloggning'>{tc.login}</NavLink>
            </div>
        </div>
    );
}
