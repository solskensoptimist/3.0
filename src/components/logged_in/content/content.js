import React  from 'react';
import {Switch, Route} from "react-router-dom";
import Agile from './agile/';
import Activity from './activity/';
import Analyse from './analyse/';
import Company from './company/';
import Deal from './deal/';
import Home from './home/';
import Lists from './lists/';
import Person from './person/';
import Prospect from './prospect/';
import ProspectResult from './prospect/result';

/**
 * Content component.js
 */
export default () => {
    return (
        <div className='contentWrapper'>
            <div className='contentWrapper__content'>
                <Switch>
                    <Route exact path='/affar/:id' component={Deal} />
                    <Route exact path='/aktivitet' component={Activity} />
                    <Route exact path='/analysera' component={Analyse} />
                    <Route exact path='/bearbeta' component={Agile} />
                    <Route exact path='/foretag/:id' component={Company} />
                    <Route exact path='/listor' component={Lists} />
                    <Route exact path='/person/:id' component={Person} />
                    <Route exact path='/prospektera' component={Prospect} />
                    <Route exact path='/prospektera/resultat' component={ProspectResult} />
                    <Route component={Home} />
                </Switch>
            </div>
        </div>
    );
};
