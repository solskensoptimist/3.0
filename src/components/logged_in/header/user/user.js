import React, {useState} from 'react';
// import PersonIcon from '@material-ui/icons/Person';
import {connect} from "react-redux";
import SettingsIcon from '@material-ui/icons/Settings';
import Settings from './settings';

const User = (state) => {
    const [showSettings, setShowSettings] = useState(false);

    return (
        <div className='user'>
            <div className='user__icon'>
                <i className='fas fa-user' />
                {/*<PersonIcon />*/}
            </div>
            <div className='user__name'>
                <div className='user__name__name'>{state.user.data.name}</div>
                <div className='user__name__dealer'>{state.user.data.dealerName}</div>
            </div>
            <div className='user__settingsButton'>
                <SettingsIcon onClick={() => setShowSettings(!showSettings)} />
            </div>
            {showSettings && <div className='user__settings'><Settings/></div>}
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
