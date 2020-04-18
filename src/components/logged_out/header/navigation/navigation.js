import React from 'react';
import {NavLink} from "react-router-dom";
import {iconHelper, tc} from 'helpers';

/**
 * Navigation component.
 */
export default () => {
    return (
        <div className='navigationWrapper'>
            <div className='navigationWrapper__navigation'>
                <div className='navigationWrapper__navigation__left'>
                    <NavLink exact to={'/'} key='varTjanst'>
                        {iconHelper.getIcon('ourService')}
                        {tc.ourService}
                    </NavLink>
                    <NavLink exact to={'/priser'} key='priser'>
                        {iconHelper.getIcon('price')}
                        {tc.prices}
                    </NavLink>
                    <NavLink exact to={'/team'} key='team'>
                        {iconHelper.getIcon('team')}
                        {tc.team}
                    </NavLink>
                    <NavLink exact to={'/inloggning'} key='inloggning'>
                        {iconHelper.getIcon('login')}
                        {tc.login}
                    </NavLink>
                </div>
                <div className='navigationWrapper__navigation__right'>
                </div>
            </div>
        </div>
    );
}
