import React  from "react";
import {Switch, Route} from "react-router-dom";
import Footer from 'components/footer';
import Header from './header';
import Login from 'components/login/';
import Service from 'components/service/';
import Team from 'components/team/';

/**
 * Main component for logged out components.
 */
export default () => {
    return (
        <>
            <Header />
            <div className='contentWrapper'>
                <div className='contentWrapper__content'>
                    <Switch>
                        <Route exact path='/team' component={Team} />
                        <Route exact path='/inloggning' component={Login} />
                        <Route component={Service} />
                    </Switch>
                </div>
            </div>
            <Footer/>
        </>
    );
}
