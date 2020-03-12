import React  from 'react';
import {NavLink} from "react-router-dom";
import {addRouteToHistory} from 'routing';

/**
 * Navigation_logged_in component.
 */
export default () =>  {
    return (
        <div className='navigation'>
            <div className='navigation__menu'>
                <NavLink exact onClick={() => {addRouteToHistory('aktivitet')}} to={'/aktivitet'} key='aktivitet'>Aktivitet</NavLink>
                <NavLink exact onClick={() => {addRouteToHistory('bearbeta')}} to={'/bearbeta'} key='bearbeta'>Bearbeta</NavLink>
                <NavLink exact onClick={() => {addRouteToHistory('listor')}} to={'/listor'} key='listor'>Listor</NavLink>
                <NavLink exact onClick={() => {addRouteToHistory('prospektera')}} to={'/prospektera'} key='prospektera'>Prospektera</NavLink>
            </div>
        </div>
    );
}
