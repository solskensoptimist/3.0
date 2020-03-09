import React from 'react';
import {Switch, Route} from "react-router-dom";
import Login from './login/';
import Home from './home/';
import Team from './team/';
import Prices from './prices';

/**
 * Content component.js
 */
export default (state) => {
    return (
        <div className='content'>
            <Switch>
                <Route exact path='/team' component={Team} />
                <Route exact path='/priser' component={Prices} />
                <Route exact path='/inloggning' component={Login} />
                <Route component={Home} />
            </Switch>
        </div>
    );
};

