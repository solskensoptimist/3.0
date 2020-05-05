import React from 'react';
import {Switch, Route} from "react-router-dom";
import Agile from './agile/';
import Activity from './activity/';
import Analyse from './analyse/';
import Car from './car/';
import Company from './company/';
import Deal from './deal/';
import Footer from 'components/shared/footer';
import Header from './header';
import Home from './home/';
import List from './list/';
import Lists from './lists/';
import Person from './person/';
import Prospect from './prospect/';
import ProspectResult from './prospect_result';
import SearchResults from './search_results';

/**
 * Main component for logged in components.
 */
export default () => {
    return (
        <>
            <Header />
            <div className='contentWrapper'>
                <div className='contentWrapper__content'>
                    <Switch>
                        <Route exact path='/affar/:id' component={Deal} />
                        <Route exact path='/aktivitet' component={Activity} />
                        <Route exact path='/analysera' component={Analyse} />
                        <Route exact path='/bearbeta' component={Agile} />
                        <Route exact path='/bil/:regNr' component={Car} />
                        <Route exact path='/foretag/:id' component={Company} />
                        <Route exact path='/listor' component={Lists} />
                        <Route exact path='/lista/:id' component={List} />
                        <Route exact path='/person/:id' component={Person} />
                        <Route exact path='/prospektera' component={Prospect} />
                        <Route exact path='/prospektera/resultat' component={ProspectResult} />
                        <Route exact path='/sok/:q' component={SearchResults} />
                        <Route component={Home} />
                    </Switch>
                </div>
            </div>
            <Footer/>
        </>
    );
};

