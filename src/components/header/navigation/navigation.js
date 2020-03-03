import React, { Fragment }  from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Switch, Route, Link, BrowserRouter } from "react-router-dom";
import Login from 'components/login/';
import Prospect from 'components/prospect/';
import Groups from 'components/groups/';
import Settings from 'components/settings/';
import history from '../../../router_history';

/**
 * Navigation component.
 */
export default () => {
    const _handleChange = (event, value) => {
        history.push(value);
    };

    return (
        <BrowserRouter>
            <div>
                <Route path='/' render={({ location }) => (
                    <Fragment>
                        <Tabs value={location.pathname} onChange={_handleChange}>
                            <Tab label='Prospektera' value='/prospektera' component={Link} to={'/prospektera'} />
                            <Tab label='Inställningar' value='/installningar' component={Link} to={'/installningar'} />
                            <Tab label='Grupper' value='/grupper' component={Link} to={'/grupper'} />
                            <Tab label='Inloggning' value='/inloggning' component={Link} to={'/inloggning'} />
                        </Tabs>
                        <Switch>
                            <Route exact path='/prospektera' component={Prospect} />
                            <Route exact path='/inloggning' component={Login} />
                            <Route exact path='/grupper' component={Groups} />
                            <Route exact path='/installningar' component={Settings} />
                        </Switch>
                    </Fragment>
                )} />
            </div>
        </BrowserRouter>
    );
};
