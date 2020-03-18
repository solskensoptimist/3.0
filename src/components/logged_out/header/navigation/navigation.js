import React from 'react';
import {NavLink} from "react-router-dom";
import tc from 'text_content';

/**
 * Navigation component.
 */
export default () => {
    return (
        <div className='navigationWrapper'>
            <div className='navigationWrapper__navigation'>
                <div className='navigationWrapper__navigation__menu'>
                    <NavLink exact to={'/'} key='varTjanst'>
                        <i className='fas fa-home' />
                        {tc.ourService}
                    </NavLink>
                    <NavLink exact to={'/priser'} key='priser'>
                        <i className='fas fa-home' />
                        {tc.prices}
                    </NavLink>
                    <NavLink exact to={'/team'} key='team'>
                        <i className='fas fa-user-friends' />
                        {tc.team}
                    </NavLink>
                    <NavLink exact to={'/inloggning'} key='inloggning'>
                        <i className='fas fa-home' />
                        {tc.login}
                    </NavLink>
                </div>
            </div>
        </div>
    );
}
