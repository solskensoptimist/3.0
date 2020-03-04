import React from 'react';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import {Link as RouterLink, Route} from 'react-router-dom';
import {connect} from "react-redux";

// We only show breadcrumbs for logged in routes.
const routes = {
    aktivitet: 'Aktivitet',
    bearbeta: 'Bearbeta',
    listor: 'Listor',
    prospektera: 'Prospektera',
    resultat: 'Resultat',
};

const BreadCrumbs = (state) => {
    const loggedIn = () => {
        return !!(state && state.user && state.user.data && state.user.data.id);
    };

    return (loggedIn() ?
        <Route>
            {({ location }) => {
                const pathnames = location.pathname.split('/').filter(x => x);
                return (
                    <Breadcrumbs aria-label='Breadcrumb'>
                        {pathnames.map((value, index) => {
                            const last = index === pathnames.length - 1;
                            const to = `/${pathnames.slice(0, index + 1).join('/')}`;

                            return last ? (
                                <Typography color='textPrimary' key={to}>
                                    {routes[value]}
                                </Typography>
                            ) : (
                                <RouterLink color='inherit' to={to} key={to}>
                                    {routes[value]}
                                </RouterLink>
                            );
                        })}
                    </Breadcrumbs>
                );
            }}
        </Route> :
            null
    );
};

const MapStateToProps = (state) => {
    return {
        user: state.user,
    };
};

export default connect(
    MapStateToProps,
)(BreadCrumbs);
