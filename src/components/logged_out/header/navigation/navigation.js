import React, {Fragment}  from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {Route, Link, BrowserRouter} from "react-router-dom";
import history from '../../../../router_history';

/**
 * Navigation component.
 */
export default () =>  {
    const _handleChange = (event, value) => {
        if (value === '/') {
            value = '/hem';
        }
        history.push(value);
    };

    return (
        <div className='navigation'>
            <div className='navigation__menu'>
                <BrowserRouter>
                    <div>
                        <Route path='/' render={({ location }) => (
                            <Fragment>
                                <Tabs value={location.pathname} onChange={_handleChange}>
                                    <Tab label='Vår tjänst' value='/' component={Link} to={'/'} />
                                    <Tab label='Team' value='/team' component={Link} to={'/team'} />
                                    <Tab label='Priser' value='/priser' component={Link} to={'/priser'} />
                                    <Tab label='Inloggning' value='/inloggning' component={Link} to={'/inloggning'} />
                                </Tabs>
                            </Fragment>
                        )} />
                    </div>
                </BrowserRouter>
            </div>
        </div>
    );
};
