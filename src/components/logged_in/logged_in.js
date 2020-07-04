import React from 'react';
import {Switch, Route} from "react-router-dom";
import Agile from 'components/agile/';
import Activity from 'components/activity';
import Analyse from 'components/analyse';
import Car from 'components/car/';
import Company from 'components/company';
import Dashboard from 'components/dashboard';
import Deal from 'components/deal/';
import Footer from 'components/footer';
import FlashMessages from 'components/flash_messages';
import FleetAnalysis from 'components/fleet_analysis';
import Header from 'components/header';
import Koncern from 'components/koncern/';
import Leads from 'components/leads/';
import List from 'components/list';
import Lists from 'components/lists';
import Orders from 'components/orders';
import Person from 'components/person/';
import Prospect from 'components/prospect';
import ProspectResult from 'components/prospect_result';
import SearchResults from 'components/search_results';
import Supertemp from 'components/supertemp';

/**
 * Main component for logged in components.
 */
export default () => {
    return (
        <>
            <Header loggedIn={true}/>
            <div className='contentWrapper'>
                <div className='contentWrapper__content'>
                    <Switch>
                        <Route exact path='/affar/:id' component={Deal}/>
                        <Route exact path='/aktivitet' component={Activity}/>
                        <Route exact path='/analysera' component={Analyse}/>
                        <Route exact path='/bearbeta' component={Agile}/>
                        <Route exact path='/bil/:regNr' component={Car}/>
                        <Route exact path='/foretag/:id' component={Company}/>
                        <Route exact path='/koncern/:id' component={Koncern}/>
                        <Route exact path='/leads' component={Leads}/>
                        <Route exact path='/lista/:id' component={List}/>
                        <Route exact path='/listor' component={Lists}/>
                        <Route exact path='/person/:id' component={Person}/>
                        <Route exact path='/prospektera' component={Prospect}/>
                        <Route exact path='/prospektera/resultat' component={ProspectResult}/>
                        <Route exact path='/bestallningar' component={Orders}/>
                        <Route exact path='/sok/:q' component={SearchResults}/>
                        <Route exact path='/supertemp/:id' component={Supertemp}/>
                        <Route exact path='/vagnparksanalys/:id' component={FleetAnalysis}/>
                        <Route component={Dashboard}/>
                    </Switch>
                </div>
            </div>
            <FlashMessages/>
            <Footer/>
        </>
    );
};

