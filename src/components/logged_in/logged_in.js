import React from 'react';
import Header from './header';
import Content from './content';
import Search from "./header/search";
import Settings from "./header/user/settings/settings";
import {setShowSearch} from 'store/search/tasks';
import {setShowSettings} from 'store/settings/tasks';
import {connect} from "react-redux";

/**
 * Main component for logged in content.
 */
const LoggedIn = (state) => {
    const _setShowSearch = () => {
        setShowSearch({showSearch: !state.settings.showSearch});
    };

    const _setShowSettings = () => {
        setShowSettings({showSettings: !state.settings.showSettings});
    };

    return (
        <div>
            {state.settings.showSettings && <div className='settingsWrapper' onClick={_setShowSettings}><Settings /></div>}
            {state.settings.showSearch && <div className='searchWrapper' onClick={_setShowSearch}><Search /></div>}
            <Header />
            <Content />
        </div>
    );
}

const MapStateToProps = (state) => {
    return {
        settings: state.settings,
        search: state.settings,
    };
};

export default connect(
    MapStateToProps,
)(LoggedIn);


