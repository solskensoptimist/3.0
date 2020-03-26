import React from 'react';
import {connect} from "react-redux";
import {setShowSettings} from 'store/settings/tasks';
import Settings from './settings/settings';

const User = (state) => {
    const _openShowSettings = () => {
        setShowSettings({showSettings: true})
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
                    <i className='fas fa-cog settings' onClick={_openShowSettings} />
                    {state.settings.showSettings && <Settings />}
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
