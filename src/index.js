import React from 'react';
import ReactDOM from 'react-dom';
import './styles/css/main.css';
import {store} from 'store';
import {Provider} from 'react-redux';
import {AppHolder} from './app_holder';
import {Router} from 'react-router-dom';
import {createBrowserHistory} from 'history';
const history = createBrowserHistory();

// Lägg till google analytics här?
// history.listen(location => analyticsService.track(location.pathname))

/**
 * Application starting point.
 * Wrapping App_holder in router to control url paths.
 */
const app =
        <Provider store={store}>
            <Router history={history}>
                <AppHolder />
            </Router>
        </Provider>;

ReactDOM.render(app, document.querySelector('#root'));
