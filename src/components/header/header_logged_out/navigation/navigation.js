import React from 'react';
import {NavLink, Route} from 'react-router-dom';
import {tc} from 'helpers';
import Icon from 'components/icon';

/**
 * Navigation component.
 */
export default () => {
    return (
        <div className='navigationWrapper'>
            <div className='navigationWrapper__navigation'>
                <div className='navigationWrapper__navigation__left'>
                    <Route>
                        {({ location }) => {
                            const pathnames = location.pathname.split('/').filter(x => x.toLowerCase());

                            return (
                                <>
                                    <NavLink className={(pathnames[0] === '') ? 'active' : ''} exact to={'/'}>
                                        <Icon val='service'/>
                                        {tc.whatIsBilprospekt}
                                    </NavLink>
                                    <NavLink className={(pathnames[0] === 'team') ? 'active' : ''} exact to={'/team'}>
                                        <Icon val='team'/>
                                        {tc.theTeam}
                                    </NavLink>
                                    <NavLink className={(pathnames[0] === 'inloggning') ? 'active' : ''} exact to={'/inloggning'}>
                                        <Icon val='login'/>
                                        {tc.login}
                                    </NavLink>
                                </>
                            );
                        }}
                    </Route>
                </div>
                <div className='navigationWrapper__navigation__right'>
                </div>
            </div>
        </div>
    );
}
