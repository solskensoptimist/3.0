import React from 'react';
import {Switch, Route} from "react-router-dom";
import Login from 'components/content/login/';
import Prospect from 'components/content/prospect/';
import Groups from 'components/content/groups/';

/**
 * Content component.js
 */
export default () => {
    return (
        <div className='content-wrapper'>
            <Switch>
                <Route exact path='/prospektera' component={Prospect} />
                <Route exact path='/inloggning' component={Login} />
                <Route exact path='/grupper' component={Groups} />
            </Switch>
        </div>
    );
};
