import React from 'react';
import {Switch, Route} from 'react-router-dom';
import {LoginComponent} from 'components/login/';
import ProspectComponent from 'components/prospect/';
import GroupsComponent from 'components/groups/';

/**
 * Defining routes. Adding a component to a specific route.
 * @constructor
 */
export const Router = () => {
    return (
        <Switch>
            <Route exact path='/prospektera' component={ProspectComponent} />
            <Route exact path='/inloggning' component={LoginComponent} />
            <Route exact path='/grupper' component={GroupsComponent} />
            <Route exact path='/prospektera/resultat' component={GroupsComponent} />
        </Switch>
    );
};

export const routes = {
    grupper: 'Grupper',
    inloggning: 'Inloggning',
    prospektera: 'Prospektera',
    resultat: 'Resultat',
};
