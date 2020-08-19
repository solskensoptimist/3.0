import React from 'react';
import {NavLink, Route} from 'react-router-dom';
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
                    <Route>
                        {({ location }) => {
                            const pathnames = location.pathname.split('/').filter(x => x.toLowerCase());

                            return (
                                <>
                                    <NavLink className={(pathnames[0] === '') ? 'active' : ''} exact to={'/'}>
                                        <Icon val='home'/>
                                        {tc.dashboard}
                                    </NavLink>
                                    <NavLink className={(pathnames[0] === 'aktivitet') ? 'active' : ''} exact to={'/aktivitet'}>
                                        <Icon val='activity'/>
                                        {tc.activity}
                                    </NavLink>
                                    <NavLink className={(pathnames[0] === 'analysera') ? 'active' : ''} exact to={'/analysera'}>
                                        <Icon val='analyze'/>
                                        {tc.analyse}
                                    </NavLink>
                                    <NavLink className={(pathnames[0] === 'bearbeta') ? 'active' : ''} exact to={'/bearbeta'}>
                                        <Icon val='agile'/>
                                        {tc.agile}
                                    </NavLink>
                                    <NavLink className={(pathnames[0] === 'bestallningar') ? 'active' : ''} exact to={'/bestallningar'}>
                                        <Icon val='orders'/>
                                        {tc.orders}
                                    </NavLink>
                                    <NavLink className={(pathnames[0] === 'listor') ? 'active' : ''} exact to={'/listor'}>
                                        <Icon val='lists'/>
                                        {tc.lists}
                                    </NavLink>
                                    <NavLink className={(pathnames[0] === 'prospektera') ? 'active' : ''} exact to={'/prospektera'}>
                                        <Icon val='prospect'/>
                                        {tc.prospect}
                                    </NavLink>
                                </>
                            );
                        }}
                    </Route>
                </div>
                <div className='navigationWrapper__navigation__right'>
                    <Search type='main'/>
                </div>
            </div>
        </div>
    );
};
