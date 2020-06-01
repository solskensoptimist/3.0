import React from 'react';
import {Switch, Route} from "react-router-dom";
import Agile from 'components/agile/';
import Activity from 'components/activity/';
import Analyse from 'components/analyse/';
import Car from 'components/car/';
import Company from 'components/company/';
import Deal from 'components/deal/';
import Footer from 'components/footer';
import FlashMessages from 'components/flash_messages';
import Header from './header';
import Home from 'components/home/';
import List from 'components/list/';
import Lists from 'components/lists/';
import Person from 'components/person/';
import Prospect from 'components/prospect/';
import ProspectResult from 'components/prospect_result';
import SearchResults from 'components/search_results';

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
            <FlashMessages/>
            <Footer/>
        </>
    );
};

