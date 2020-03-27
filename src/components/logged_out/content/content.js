import React  from 'react';
import {Switch, Route} from "react-router-dom";
import Login from './login/';
import Service from './service/';
import Team from './team/';
import Prices from './prices';

/**
 * Content component.js
 */
export default () => {
    return (
        <div className='contentWrapper'>
            <div className='contentWrapper__content'>
                <Switch>
                    <Route exact path='/team' component={Team} />
                    <Route exact path='/priser' component={Prices} />
                    <Route exact path='/inloggning' component={Login} />
                    <Route component={Service} />
                </Switch>
            </div>
        </div>
    );
}

