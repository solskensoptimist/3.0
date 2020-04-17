import React from 'react';
import ReactDOM from 'react-dom';
import {store} from 'store';
import {Provider} from 'react-redux';
import AppHolder from './app_holder';
import {Router} from 'react-router-dom';
import * as serviceWorker from './service_worker';
import history from './router_history';
import moment from 'moment';

// Setup moment to use swedish time.
require('moment/locale/sv');
moment.updateLocale('sv', {
    relativeTime : {
        past    : '%s sedan',
        future  : 'Om %s',
        s       : 'mindre än 1min',
        m       : '1min',
        mm      : '%dmin',
        h       : '1h',
        hh      : '%dh',
        d       : '1 dag',
        dd      : '%d dagar',
        M       : '1 månad',
        MM      : '%d månader',
        y       : '1 år',
        yy      : '%d år'
    }
});


// Lägg till google analytics här..?
// history.listen(location => analyticsService.track(location.pathname))

/**
 * Application starting point.
 *
 * Provider gives access to redux store.
 * Router controls url paths.
 */
const app =
        <Provider store={store}>
            <Router history={history}>
                <AppHolder />
            </Router>
        </Provider>;

ReactDOM.render(app, document.querySelector('#root'));
serviceWorker.register();
