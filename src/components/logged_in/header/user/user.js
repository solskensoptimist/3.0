import React from 'react';
import {connect} from "react-redux";
import {setShowSettings} from 'store/settings/tasks';
import Settings from './settings/settings';
import Icon from 'components/shared/icon';

const User = (state) => {
    const _openShowSettings = () => {
        setShowSettings({showSettings: true})
    };

    return (
        <div className='userWrapper'>
            <div className='userWrapper__user'>
                <div className='userWrapper__user__name'>
                    <div className='userWrapper__user__name__name'>{state.user.info.name}</div>
                    <div className='userWrapper__user__name__delimiter'>|</div>
                    <div className='userWrapper__user__name__dealer'>{state.user.info.dealerName}</div>
                </div>
                <div className='userWrapper__user__icon'>
                    <Icon val='settings' onClick={_openShowSettings}/>
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
