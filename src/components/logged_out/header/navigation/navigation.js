import React from 'react';
import {NavLink} from "react-router-dom";
import {tc} from 'helpers';

/**
 * Navigation component.
 */
export default () => {
    return (
        <div className='navigationWrapper'>
            <div className='navigationWrapper__navigation'>
                <div className='navigationWrapper__navigation__left'>
                    <NavLink exact to={'/'} key='varTjanst'>
                        <i className='fas fa-briefcase' />
                        {tc.ourService}
                    </NavLink>
                    <NavLink exact to={'/priser'} key='priser'>
                        <i className='fas fa-dollar-sign' />
                        {tc.prices}
                    </NavLink>
                    <NavLink exact to={'/team'} key='team'>
                        <i className='fas fa-user-friends' />
                        {tc.team}
                    </NavLink>
                    <NavLink exact to={'/inloggning'} key='inloggning'>
                        <i className='fas fa-sign-in-alt' />
                        {tc.login}
                    </NavLink>
                </div>
                <div className='navigationWrapper__navigation__right'>
                </div>
            </div>
        </div>
    );
}
