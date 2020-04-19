import React from 'react';
import {NavLink} from "react-router-dom";
import {tc} from 'helpers';
import Icon from 'components/shared/icon';

/**
 * Navigation component.
 */
export default () => {
    return (
        <div className='navigationWrapper'>
            <div className='navigationWrapper__navigation'>
                <div className='navigationWrapper__navigation__left'>
                    <NavLink exact to={'/'} key='varTjanst'>
                        <Icon val='ourService'/>
                        {tc.ourService}
                    </NavLink>
                    <NavLink exact to={'/priser'} key='priser'>
                        <Icon val='price'/>
                        {tc.prices}
                    </NavLink>
                    <NavLink exact to={'/team'} key='team'>
                        <Icon val='team'/>
                        {tc.team}
                    </NavLink>
                    <NavLink exact to={'/inloggning'} key='inloggning'>
                        <Icon val='login'/>
                        {tc.login}
                    </NavLink>
                </div>
                <div className='navigationWrapper__navigation__right'>
                </div>
            </div>
        </div>
    );
}
