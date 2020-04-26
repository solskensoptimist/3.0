import React from 'react';
import LoggedIn from 'components/logged_in';
import LoggedOut from 'components/logged_out';
import {connect} from "react-redux";

/**
 * Root component.
 */
const AppHolder = (state) => {
    const loggedIn = () => {
        return !!(state && state.user && state.user.info && state.user.info.id);
    };

    return (
        <div className='appHolder'>
            { loggedIn() ? <LoggedIn /> : <LoggedOut /> }
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
)(AppHolder);

