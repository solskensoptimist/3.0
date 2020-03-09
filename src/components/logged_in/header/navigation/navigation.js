import React, {Fragment}  from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {Route, Link, BrowserRouter, Link as RouterLink} from "react-router-dom";
import history from '../../../../router_history';
import {connect} from "react-redux";

/**
 * Navigation_logged_in component.
 */
const Navigation = (state) =>  {
    const _handleChange = (event, value) => {
        history.push(value);
    };

    return (
        <div className='navigation'>
            <div className='navigation__menu'>
                <div className='navigation__menu__item'><RouterLink to={'/bearbeta'} key='bearbeta'>Bearbeta</RouterLink></div>
                <div className='navigation__menu__item'><RouterLink to={'/listor'} key='listor'>Listor</RouterLink></div>
                <div className='navigation__menu__item'><RouterLink to={'/prospektera'} key='bearbeta'>Prospektera</RouterLink></div>

                {/*<BrowserRouter>*/}
                {/*    <div>*/}
                {/*        <Route path='/' render={({ location }) => (*/}
                {/*            <Fragment>*/}
                {/*                <Tabs value={location.pathname} onChange={_handleChange}>*/}
                {/*                    <Tab label='Bearbeta' value='/bearbeta' component={Link} to={'/bearbeta'} />*/}
                {/*                    <Tab label='Prospektera' value='/prospektera' component={Link} to={'/prospektera'} />*/}
                {/*                    <Tab label='Aktivitet' value='/aktivitet' component={Link} to={'/aktivitet'} />*/}
                {/*                </Tabs>*/}
                {/*            </Fragment>*/}
                {/*        )} />*/}
                {/*    </div>*/}
                {/*</BrowserRouter>*/}
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
