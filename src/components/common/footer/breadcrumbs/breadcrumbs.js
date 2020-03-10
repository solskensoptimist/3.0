import React from 'react';
import {NavLink, Route} from 'react-router-dom';
import {addRouteToHistory, routes} from 'routing';

export default (state) => {
    return (
        <div>
            <h3>Här är du</h3>
            <div className='breadcrumbs'>
                <Route>
                    {({ location }) => {
                        const pathnames = location.pathname.split('/').filter(x => x);
                        return (
                            <div className='breadcrumbs'>

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

                                {/*When pathnames is empty we're on the home page*/}
                                {(pathnames.length === 0) &&
                                    <span key='hem'>
                                        {routes['hem']}
                                    </span>
                                }
                            </div>
                        );
                    }}
                </Route>
            </div>
        </div>
    );
};
