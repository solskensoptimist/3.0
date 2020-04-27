import React  from "react";
import {Switch, Route} from "react-router-dom";
import Footer from 'components/shared/footer';
import Header from './header';
import Login from './login/';
import Service from './service/';
import Team from './team/';

/**
 * Main component for logged out content.
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
