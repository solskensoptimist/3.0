import React, { Fragment, useState }  from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SettingsIcon from '@material-ui/icons/Settings';
import {Route, Link, BrowserRouter} from "react-router-dom";
import history from '../../../router_history';
import Settings from './settings';
import {connect} from "react-redux";

/**
 * Navigation component.
 */
const Navigation = (state) =>  {
    const [showSettings, setShowSettings] = useState(false);

    const _handleChange = (event, value) => {
        history.push(value);
    };

    const loggedIn = () => {
        return !!(state && state.user && state.user.data && state.user.data.id);
    };

    return ( loggedIn() ?
        <div className='navigation'>
            <div className='navigation__menu'>
                <BrowserRouter>
                    <div>
                        <Route path='/' render={({ location }) => (
                            <Fragment>
                                <Tabs value={location.pathname} onChange={_handleChange}>
                                    <Tab label='Bearbeta' value='/bearbeta' component={Link} to={'/bearbeta'} />
                                    <Tab label='Prospektera' value='/prospektera' component={Link} to={'/prospektera'} />
                                    <Tab label='Aktivitet' value='/aktivitet' component={Link} to={'/aktivitet'} />
                                </Tabs>
                            </Fragment>
                        )} />
                    </div>
                </BrowserRouter>
            </div>
            <div className='navigation__settingsBtn'>
                <SettingsIcon onClick={() => setShowSettings(!showSettings)} />
            </div>
            {showSettings &&
                <div className='navigation__settings'>
                    <Settings/>
                </div>
            }
        </div> :
        <div className='navigation'>
            <div className='navigation__menu'>
                <BrowserRouter>
                    <div>
                        <Route path='/' render={({ location }) => (
                            <Fragment>
                                <Tabs value={location.pathname} onChange={_handleChange}>
                                    <Tab label='Vår tjänst' value='/' component={Link} to={'/'} />
                                    <Tab label='Team' value='/team' component={Link} to={'/team'} />
                                    <Tab label='Priser' value='/priser' component={Link} to={'/priser'} />
                                    <Tab label='Inloggning' value='/inloggning' component={Link} to={'/inloggning'} />
                                </Tabs>
                            </Fragment>
                        )} />
                    </div>
                </BrowserRouter>
            </div>
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
)(Navigation);
