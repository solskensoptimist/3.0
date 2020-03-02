import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Login from 'components/login/';
import Prospect from 'components/prospect/';
import Groups from 'components/groups/';
import Settings from 'components/settings/';

/**
 * Defining routes. Adding a component to a specific route.
 * @constructor
 */
export default () => {
    return (
        <Switch>
            <Route exact path='/prospektera' component={Prospect} />
            <Route exact path='/inloggning' component={Login} />
            <Route exact path='/grupper' component={Groups} />
            <Route exact path='/installningar' component={Settings} />
        </Switch>
    );
};
