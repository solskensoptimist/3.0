import React  from 'react';
import {NavLink} from "react-router-dom";
import tc from 'text_content';

/**
 * Navigation_logged_in component.
 */
export default (state) =>  {
    return (
        <div className='navigationWrapper'>
            <div className='navigationWrapper__navigation'>
                <div className='navigationWrapper__navigation__menu'>
                    <NavLink exact to={'/'} key='hem'>
                        <i className='fas fa-home' />
                        {tc.home}
                    </NavLink>
                    <NavLink exact to={'/aktivitet'} key='aktivitet'>
                        <i className='fas fa-tachometer-alt' />
                        {tc.activity}
                    </NavLink>
                    <NavLink exact to={'/analysera'} key='analysera'>
                        <i className='fas fa-chart-bar' />
                        {tc.analyse}
                    </NavLink>
                    <NavLink exact to={'/bearbeta'} key='bearbeta'>
                        <i className='fas fa-columns' />
                        {tc.agile}
                    </NavLink>
                    <NavLink exact to={'/listor'} key='listor'>
                        <i className='fas fa-list' />
                    {tc.lists}
                    </NavLink>
                    <NavLink exact to={'/prospektera'} key='prospektera'>
                        <i className='fas fa-sliders-h' />
                        {tc.prospect}
                    </NavLink>
                </div>
            </div>
        </div>
    );
};
