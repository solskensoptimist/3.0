import React  from 'react';
import {Switch, Route} from "react-router-dom";
import Agile from './agile/';
import Activity from './activity/';
import Lists from './lists/';
import Prospect from './prospect/';
import ProspectResult from './prospect/result';

/**
 * Content component.js
 */
export default () => {
    return (
        <div className='content'>
            <Switch>
                <Route exact path='/aktivitet' component={Activity} />
                <Route exact path='/bearbeta' component={Agile} />
                <Route exact path='/listor' component={Lists} />
                <Route exact path='/prospektera' component={Prospect} />
                <Route exact path='/prospektera/resultat' component={ProspectResult} />
            </Switch>
        </div>
    );
};
