import React from 'react';
import {NavLink, Route} from 'react-router-dom';
import {connect} from 'react-redux';

// If you create a new route you need to add it here for breadcrumbs to display it.
const routes = {
    affar: 'Affär',
    aktivitet: 'Aktivitet',
    analysera: 'Analysera',
    bearbeta: 'Bearbeta',
    foretag: 'Företag',
    hem: 'Hem',
    inloggning: 'Inloggning',
    listor: 'Listor',
    person: 'Person',
    priser: 'Priser',
    prospektera: 'Prospektera',
    resultat: 'Resultat',
    team: 'Team',
    varTjanst: 'Vår tjänst',
};

/**
 * Render breadcrumbs.
 */
const Breadcrumbs = (state) => {
    return (
        <div className='breadcrumbs'>
            <h4>Här är du</h4>
            <div className='breadcrumbs__content'>
                <Route>
                    {({ location }) => {
                        // Split paths.
                        let pathnames = location.pathname.split('/').filter(x => x.toLowerCase());

                        // Check if any of the values start with number or underscore.
                        // If so, we treat is as an ID parameter (for routes such as person/id, affar/id etc.)...
                        // ...which means concat it with the previous value and remove the value itself.
                        pathnames.forEach((value, index) => {
                            if (Number.isInteger(Number(value.charAt(0)) || value.charAt(0) === '_') ) {
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
                                {(pathnames.length === 0 && state.user && state.user.info && state.user.info.id) && <span key='hem'>{routes['hem']}</span>}
                                {(pathnames.length === 0 && (!state.user || !state.user.info || !state.user.info.id)) && <span key='varTjanst'>{routes['varTjanst']}</span>}
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
