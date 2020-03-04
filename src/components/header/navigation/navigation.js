import React, { Fragment, useState }  from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SettingsIcon from '@material-ui/icons/Settings';
import {Route, Link, BrowserRouter} from "react-router-dom";
import history from '../../../router_history';
import Settings from 'components/header/settings';

/**
 * Navigation component.
 */
export default () => {
    const [showSettings, setShowSettings] = useState(false);

    const _handleChange = (event, value) => {
        history.push(value);
    };

    return (
        <div>
            <BrowserRouter>
                <div>
                    <Route path='/' render={({ location }) => (
                        <Fragment>
                            <Tabs value={location.pathname} onChange={_handleChange}>
                                <Tab label='Prospektera' value='/prospektera' component={Link} to={'/prospektera'} />
                                <Tab label='Grupper' value='/grupper' component={Link} to={'/grupper'} />
                                <Tab label='Inloggning' value='/inloggning' component={Link} to={'/inloggning'} />
                            </Tabs>
                        </Fragment>
                    )} />
                </div>
            </BrowserRouter>
                <SettingsIcon onClick={() => setShowSettings(!showSettings)} />
                {showSettings && <Settings />}
        </div>
    );
};
