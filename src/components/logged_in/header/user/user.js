import React from 'react';
import {connect} from "react-redux";
import {setShowSettings} from 'store/settings/tasks';
import Settings from './settings/settings';

const User = (state) => {
    const _closeShowSettings = () => {
        setShowSettings({showSettings: false});
    };

    const _openShowsettings = () => {
        setShowSettings({showSettings: !state.settings.showSettings})
    };

    return (
        <div className='userWrapper'>
            <div className='userWrapper__user'>
                <div className='userWrapper__user__icon'>
                    <i className='fas fa-user user' />
                </div>
                <div className='userWrapper__user__name'>
                    <div className='userWrapper__user__name__name'>{state.user.data.name}</div>
                    <div className='userWrapper__user__name__delimiter'>|</div>
                    <div className='userWrapper__user__name__dealer'>{state.user.data.dealerName}</div>
                </div>
                <div className='userWrapper__user__settingsButton'>
                    <i className='fas fa-cog settings' onClick={_openShowsettings} />
                    {state.settings.showSettings && <div className='clickHandlerDark' onClick={_closeShowSettings}><Settings /></div>}
                </div>
            </div>
        </div>

    );
};

const MapStateToProps = (state) => {
    return {
        settings: state.settings,
        user: state.user,
    };
};

export default connect(
    MapStateToProps,
)(User);
