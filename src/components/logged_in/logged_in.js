import React from 'react';
import Header from './header';
import Content from './content';
import Settings from "./header/user/settings/settings";
import {setShowSearch} from 'store/search/tasks';
import {setShowSettings} from 'store/settings/tasks';
import {connect} from "react-redux";

/**
 * Main component for logged in content.
 *
 * Some handling for showing/hiding components here.
 * (For instance: when we have clicked on search icon and state.search.showSearch is true we render a
 * div that covers the whole screen (searchClickHandler), and listens on clicks to close search box.
 * Search component itself use e.stopPropagation() to stop it from closing when clicking inside it.)
 */
const LoggedIn = (state) => {
    const _closeShowSearch = () => {
        setShowSearch({showSearch: false});
    };

    const _closeShowSettings = () => {
        setShowSettings({showSettings: false});
    };

    return (
        <div>
            {state.search.showSearch && <div className='searchClickHandler' onClick={_closeShowSearch} />}
            {state.settings.showSettings && <div className='settingsWrapper' onClick={_closeShowSettings}><Settings /></div>}
            <Header />
            <Content />
        </div>
    );
};

const MapStateToProps = (state) => {
    return {
        search: state.search,
        settings: state.settings,
    };
};

export default connect(
    MapStateToProps,
)(LoggedIn);


