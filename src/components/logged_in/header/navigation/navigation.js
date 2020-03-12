import React  from 'react';
import {NavLink} from "react-router-dom";
import {addRouteToHistory} from 'routing';
import tc from 'text_content';

/**
 * Navigation_logged_in component.
 */
export default () =>  {
    return (
        <div className='navigation'>
            <div className='navigation__menu'>
                <NavLink exact onClick={() => {addRouteToHistory('hem')}} to={'/'} key='hem'>{tc.home}</NavLink>
                <NavLink exact onClick={() => {addRouteToHistory('aktivitet')}} to={'/aktivitet'} key='aktivitet'>{tc.activity}</NavLink>
                <NavLink exact onClick={() => {addRouteToHistory('bearbeta')}} to={'/bearbeta'} key='bearbeta'>{tc.agile}</NavLink>
                <NavLink exact onClick={() => {addRouteToHistory('listor')}} to={'/listor'} key='listor'>{tc.lists}</NavLink>
                <NavLink exact onClick={() => {addRouteToHistory('prospektera')}} to={'/prospektera'} key='prospektera'>{tc.prospect}</NavLink>
            </div>
        </div>
    );
}
