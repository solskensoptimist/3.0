import React from 'react';
import {Switch, Route} from "react-router-dom";
import Prospect from './prospect/';
import Agile from './agile/';
import Activity from './activity/';

/**
 * Content component.js
 */
export default () => {
    return (
        <div className='content'>
            <Switch>
                <Route exact path='/bearbeta' component={Agile} />
                <Route exact path='/prospektera' component={Prospect} />
                <Route exact path='/aktivitet' component={Activity} />
            </Switch>
        </div>
    );
};
