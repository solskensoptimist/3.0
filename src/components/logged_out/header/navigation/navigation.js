import React from 'react';
import {NavLink} from "react-router-dom";
import {addRouteToHistory, history} from 'routing';

/**
 * Navigation component.
 */
export default () =>  {
    console.log('history', history);



    return (
        <div className='navigation'>
            <div className='navigation__menu'>
                <NavLink exact onClick={() => {addRouteToHistory('hem')}} to={'/'} key='hem'>Vår tjänst</NavLink>
                <NavLink exact onClick={() => {addRouteToHistory('priser')}} to={'/priser'} key='priser'>Priser</NavLink>
                <NavLink exact onClick={() => {addRouteToHistory('team')}} to={'/team'} key='team'>Team</NavLink>
                <NavLink v onClick={() => {addRouteToHistory('inloggning')}} to={'/inloggning'} key='inloggning'>Inloggning</NavLink>
            </div>
        </div>
    );
};
