import React from 'react';
import {connect} from 'react-redux';
import LoggedIn from 'components/logged_in';
import LoggedOut from 'components/logged_out';

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

