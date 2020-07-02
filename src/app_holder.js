import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import LoggedIn from 'components/logged_in';
import LoggedOut from 'components/logged_out';

/**
 * Root component.
 */
const AppHolder = (state) => {
    useEffect(() => {
        // Styling for Verendus users.
        if (state.user && state.user.info && state.user.info.verendus_dealer === 1) {
            import('./styles/verendus.css').then().catch((err) => console.error('Could not load custom CSS', err));
        }
    }, [state.user]);

    const loggedIn = () => {
        return !!(state.user && state.user.info && state.user.info.id);
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

