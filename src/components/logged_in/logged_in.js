import React from 'react';
import Header from './header';
import Content from './content';
import Settings from "./header/user/settings/settings";
import {setShowSettings} from 'store/settings/tasks';
import {connect} from "react-redux";

/**
 * Main component for logged in content.
 */
const LoggedIn = (state) => {
    const _setShowSettings = () => {
        setShowSettings({showSettings: !state.settings.showSettings});
    };

    return (
        <div>
            {state.settings.showSettings && <div className='settingsWrapper' onClick={_setShowSettings}><Settings/></div>}
            <Header />
            <Content />
        </div>
    );
}

const MapStateToProps = (state) => {
    return {
        settings: state.settings,
    };
};

export default connect(
    MapStateToProps,
)(LoggedIn);


