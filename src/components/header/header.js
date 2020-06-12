import React from 'react';
import HeaderLoggedIn from './header_logged_in';
import HeaderLoggedOut from './header_logged_out';

export default (props) => {
    if (props.loggedIn) {
        return <HeaderLoggedIn/>;
    } else {
        return <HeaderLoggedOut/>;
    }
};
