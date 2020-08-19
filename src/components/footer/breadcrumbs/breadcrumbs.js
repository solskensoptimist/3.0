import React from 'react';
import {NavLink, Route} from 'react-router-dom';
import {connect} from 'react-redux';
import carHelper from 'shared_helpers/car_helper';
import {tc} from 'helpers';

// If you create a new route you need to add it here for breadcrumbs to display it.
const routes = {
    affar: tc.deal,
    aktivitet: tc.activity,
    analysera: tc.analyse,
    bearbeta: tc.agile,
    bestallningar: tc.orders,
    bil: tc.car,
    bilprospekt: 'Bilprospekt',
    dashboard: tc.dashboard,
    foretag: tc.company,
    inloggning: tc.login,
    koncern: tc.koncern,
    leads: tc.leads,
    lista: tc.list,
    listor: tc.lists,
    person: tc.person,
    priser: tc.prices,
    prospektera: tc.prospect,
    resultat: tc.result,
    supertemp: tc.monitoring,
    sok: tc.aSearch,
    team: tc.team,
    vagnparksanalys: tc.fleetAnalysis,
};

/**
 * Render breadcrumbs.
 */
const Breadcrumbs = (state) => {
    return (
        <div className='breadcrumbsWrapper'>
            <div className='breadcrumbsWrapper__breadcrumbs'>
                <h4>Här är du</h4>
                <div className='breadcrumbsWrapper__breadcrumbs__content'>
                    <Route>
                        {({ location }) => {
                            // Split paths.
                            let pathnames = location.pathname.split('/').filter(x => x.toLowerCase());

                            // Check if value start with number/underscore or is valid reg number,
                            // or if previous path is one where id is expected.
                            // If so, we treat it as an ID parameter (for routes such as person/:id, affar/:id, supertemp/:id etc.)...
                            // ...which means concat it with the previous value and remove the value itself.
                            pathnames.forEach((value, index) => {
                                if (Number.isInteger(Number(value.charAt(0)) ||
                                    value.charAt(0) === '_') ||
                                    carHelper.isValidRegNumber(value) ||
                                    pathnames[index - 1] === 'affar' ||
                                    pathnames[index - 1] === 'bil' ||
                                    pathnames[index - 1] === 'foretag' ||
                                    pathnames[index - 1] === 'koncern' ||
                                    pathnames[index - 1] === 'list' ||
                                    pathnames[index - 1] === 'person' ||
                                    pathnames[index - 1] === 'sok' ||
                                    pathnames[index - 1] === 'supertemp') {
                                    pathnames[index - 1] = pathnames[index - 1] + '/' + value;
                                    pathnames = pathnames.splice(0, index);
                                }
                            });

                            return (
                                <div>
                                    {pathnames.map((value, index) => {
                                        const last = index === pathnames.length - 1;
                                        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                                        let routeValue = value;

                                        if (value.indexOf('/') !== -1) {
                                            // This is a path with an id as parameter, so we need to adjust routeValue.
                                            routeValue = value.split('/')[0];
                                        }

                                        return last ? (
                                            <span key={to}>
                                                {routes[routeValue]}
                                            </span>
                                        ) : (
                                            <NavLink to={to} key={to}>
                                                {routes[routeValue]}
                                            </NavLink>
                                        );
                                    })}

                                    {/* For index routes, when logged in and logged out. */}
                                    {(pathnames.length === 0 && state.user && state.user.info && state.user.info.id) && <span key='dashboard'>{routes['dashboard']}</span>}
                                    {(pathnames.length === 0 && (!state.user || !state.user.info || !state.user.info.id)) && <span key='bilprospekt'>{routes['bilprospekt']}</span>}
                                </div>
                            );
                        }}
                    </Route>
                </div>
            </div>
        </div>
    );
};

const MapStateToProps = (state) => {
    return {
        user: state.user,
    };
};

export default connect(
    MapStateToProps,
)(Breadcrumbs);
