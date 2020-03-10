import React, {useState} from 'react';
import {connect} from "react-redux";
import Settings from './settings';

const User = (state) => {
    const [showSettings, setShowSettings] = useState(false);

    return (
        <div>
            <div className='user'>
                <div className='user__icon'>
                    <i className='fas fa-user user' />
                </div>
                <div className='user__name'>
                    <div className='user__name__name'>{state.user.data.name}</div>
                    <div className='user__name__dealer'>{state.user.data.dealerName}</div>
                </div>
                <div className='user__settingsButton'>
                    <i className='fas fa-cog settings' onClick={() => setShowSettings(!showSettings)} />
                </div>
            </div>
            {showSettings && <div className='settingsBoxWrapper'><Settings/></div>}
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
)(User);
