import React from 'react';
import {Switch, Route} from "react-router-dom";
import Login from 'components/content/login/';
import Prospect from 'components/content/prospect/';
import Agile from 'components/content/agile/';
import Activity from 'components/content/activity/';
import Home from 'components/content/home/';
import Team from 'components/content/team/';
import Prices from 'components/content/prices';
import {connect} from "react-redux";

/**
 * Content component.js
 */
const Content = (state) => {
    const loggedIn = () => {
        return !!(state && state.user && state.user.data && state.user.data.id);
    };

    return ( loggedIn() ?
        <div className='content'>
            <Switch>
                <Route exact path='/team' component={Team} />
                <Route exact path='/inloggning' component={Login} />
                <Route exact path='/bearbeta' component={Agile} />
                <Route exact path='/prospektera' component={Prospect} />
                <Route exact path='/aktivitet' component={Activity} />
                <Route component={Home} />
            </Switch>
        </div> :
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

const MapStateToProps = (state) => {
    return {
        user: state.user,
    };
};

export default connect(
    MapStateToProps,
)(Content);

