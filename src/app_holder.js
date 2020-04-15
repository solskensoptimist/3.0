import React from 'react';
import LoggedIn from 'components/logged_in';
import LoggedOut from 'components/logged_out';
import Footer from 'components/shared/footer';
import {connect} from "react-redux";

/**
 * Root component which holds all other subcomponents.
 */
const AppHolder = (state) => {
    const loggedIn = () => {
        return !!(state && state.user && state.user.data && state.user.data.id);
    };

    return (
        <div className='appHolder'>
            { loggedIn() ? <LoggedIn /> : <LoggedOut /> }
            <Footer />
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

