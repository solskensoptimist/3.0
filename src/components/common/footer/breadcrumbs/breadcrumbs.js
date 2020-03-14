import React from 'react';
import {NavLink, Route} from 'react-router-dom';
import {addRouteToHistory, routes} from 'routing';
import {connect} from 'react-redux';

const Breadcrumbs = (state) => {
    return (
        <div className='breadcrumbs'>
            <h4>Här är du</h4>
            <div className='breadcrumbs__content'>
                <Route>
                    {({ location }) => {
                        const pathnames = location.pathname.split('/').filter(x => x);
                        return (
                            <div>
                                {pathnames.map((value, index) => {
                                    const last = index === pathnames.length - 1;
                                    const to = `/${pathnames.slice(0, index + 1).join('/')}`;

                                    return last ? (
                                        <span key={to}>
                                            {routes[value]}
                                        </span>
                                    ) : (
                                        <NavLink onClick={() => {addRouteToHistory(to)}} to={to} key={to}>
                                            {routes[value]}
                                        </NavLink>
                                    );
                                })}

                                {/* For index routes, logged in and logged out. */}
                                {(pathnames.length === 0 && state.user && state.user.data && state.user.data.email) && <span key='hem'>{routes['hem']}</span>}
                                {(pathnames.length === 0 && (!state.user || !state.user.data || !state.user.data.email)) && <span key='varTjanst'>{routes['varTjanst']}</span>}
                            </div>
                        );
                    }}
                </Route>
            </div>
        </div>
    );
}

const MapStateToProps = (state) => {
    return {
        user: state.user,
    };
};

export default connect(
    MapStateToProps,
)(Breadcrumbs);
