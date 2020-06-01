import React from 'react';
import {NavLink} from "react-router-dom";
import {tc} from 'helpers';
import Icon from 'components/icon';
import Search from 'components/search';

/**
 * Navigation_logged_in component.
 */
export default () =>  {
    return (
        <div className='navigationWrapper'>
            <div className='navigationWrapper__navigation'>
                <div className='navigationWrapper__navigation__left'>
                    <NavLink exact to={'/'} key='hem'>
                        <Icon val='home'/>
                        {tc.home}
                    </NavLink>
                    <NavLink exact to={'/aktivitet'} key='aktivitet'>
                        <Icon val='activity'/>
                        {tc.activity}
                    </NavLink>
                    <NavLink exact to={'/analysera'} key='analysera'>
                        <Icon val='analyze'/>
                        {tc.analyse}
                    </NavLink>
                    <NavLink exact to={'/bearbeta'} key='bearbeta'>
                        <Icon val='agile'/>
                        {tc.agile}
                    </NavLink>
                    <NavLink exact to={'/listor'} key='listor'>
                        <Icon val='lists'/>
                        {tc.lists}
                    </NavLink>
                    <NavLink exact to={'/prospektera'} key='prospektera'>
                        <Icon val='prospect'/>
                        {tc.prospect}
                    </NavLink>
                </div>
                <div className='navigationWrapper__navigation__right'>
                    <Search type='main'/>
                </div>
            </div>
        </div>
    );
};
