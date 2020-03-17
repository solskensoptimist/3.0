import React  from 'react';
import {NavLink} from "react-router-dom";
import tc from 'text_content';

/**
 * Navigation_logged_in component.
 */
export default () =>  {
    return (
        <div className='navigation'>
            <div className='navigation__menu'>
                <NavLink exact to={'/'} key='hem'>{tc.home}</NavLink>
                <NavLink exact to={'/aktivitet'} key='aktivitet'>{tc.activity}</NavLink>
                <NavLink exact to={'/bearbeta'} key='bearbeta'>{tc.agile}</NavLink>
                <NavLink exact to={'/listor'} key='listor'>{tc.lists}</NavLink>
                <NavLink exact to={'/prospektera'} key='prospektera'>{tc.prospect}</NavLink>
            </div>
        </div>
    );
}
