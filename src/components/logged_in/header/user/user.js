import React from 'react';
import {connect} from "react-redux";
import {setShowSettings} from 'store/settings/tasks';

const User = (state) => {
    const _toggleShowsettings = () => {
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
                    <i className='fas fa-cog settings' onClick={_toggleShowsettings} />
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
