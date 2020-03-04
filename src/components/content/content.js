import React from 'react';
import {Switch, Route} from "react-router-dom";
import Login from 'components/content/login/';
import Prospect from 'components/content/prospect/';
import Agile from 'components/content/agile/';
import Activity from 'components/content/activity/';
import Home from 'components/content/home/';
import Team from 'components/content/team/';

/**
 * Content component.js
 */
export default () => {
    return (
        <div className='content-wrapper'>
            <Switch>
                <Route exact path='/' component={Home} />
                <Route exact path='/team' component={Team} />
                <Route exact path='/inloggning' component={Login} />
                <Route exact path='/bearbeta' component={Agile} />
                <Route exact path='/prospektera' component={Prospect} />
                <Route exact path='/aktivitet' component={Activity} />
            </Switch>
        </div>
    );
};
