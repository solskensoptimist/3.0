import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {getSettings, saveSettings} from 'store/settings/tasks';
import Loading from 'components/loading';
import ToggleOffIcon from '@material-ui/icons/ToggleOff';
import ToggleOnIcon from '@material-ui/icons/ToggleOn';
import {clearState, userLogout} from 'store/user/tasks';

const Settings = (state) =>  {
    useEffect(() => {
        getSettings();
    }, []);

    /**
     * Toggle email notifications setting.
     */
    const _toggleEmail = () => {
        let payload = state.settings;
        payload.email = !state.settings.email;
        saveSettings(payload);
    };

    /**
     * Relevant checks.
     */
    const _stateCheck = () => {
        return !!state && state.settings && state.settings.email !== null;
    };

    const _userLogout = async () => {
        await userLogout();
    };

    return _stateCheck() ? (
        <div>
            <div>Få epost-notifikationer:</div>
            <div onClick={_toggleEmail}>
                {state.settings.email ? <ToggleOnIcon /> : <ToggleOffIcon />}
            </div>
            <div onClick={_userLogout}>Logga ut</div>
            <div onClick={clearState}>Clear state test</div>
        </div>
    ) : (
        <Loading />
    );
};

const MapStateToProps = (state) => {
    return {
        settings: state.settings,
    };
};

export default connect(
    MapStateToProps,
)(Settings);
