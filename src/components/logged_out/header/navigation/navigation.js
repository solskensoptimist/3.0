import React from 'react';
import {NavLink} from "react-router-dom";
import {tc} from 'helpers';
// import {Briefcase, DollarSign, LogIn, Users} from 'react-feather';

/**
 * Navigation component.
 */
export default () => {
    return (
        <div className='navigationWrapper'>
            <div className='navigationWrapper__navigation'>
                <div className='navigationWrapper__navigation__left'>
                    <NavLink exact to={'/'} key='varTjanst'>
                        {/*<i className='fas fa/-briefcase' />*/}
                        {/*<Briefcase />*/}
                        {tc.ourService}
                    </NavLink>
                    <NavLink exact to={'/priser'} key='priser'>
                        {/*<i className='fas fa-dollar-sign' />*/}
                        {/*<DollarSign />*/}
                        {tc.prices}
                    </NavLink>
                    <NavLink exact to={'/team'} key='team'>
                        {/*<i className='fas fa-user-friends' />*/}
                        {/*<Users />*/}
                        {tc.team}
                    </NavLink>
                    <NavLink exact to={'/inloggning'} key='inloggning'>
                        {/*<i className='fas fa-sign-in-alt' />*/}
                        {/*<LogIn />*/}
                        {tc.login}
                    </NavLink>
                </div>
                <div className='navigationWrapper__navigation__right'>
                </div>
            </div>
        </div>
    );
}
