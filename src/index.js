import React from 'react';
import ReactDOM from 'react-dom';
import {store} from 'store';
import {Provider} from 'react-redux';
import AppHolder from './app_holder';
import {Router} from 'react-router-dom';
import * as serviceWorker from './service_worker';
import history from './router_history';

// Lägg till google analytics här?
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
