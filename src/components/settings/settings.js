import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {getSettings, newSettings} from 'store/settings/tasks';
import Loading from 'components/loading';
import ToggleOffIcon from '@material-ui/icons/ToggleOff';
import ToggleOnIcon from '@material-ui/icons/ToggleOn';

const Settings = (state) =>  {
    useEffect(() => {
        getSettings();
    }, []);

    /**
     * Toggle email notifications setting.
     */
    const toggleEmail = () => {
        const payload = {
            ...state.settings.settings,
            email: !state.settings.settings.email,
            def: state.settings.data.def,
        };
        newSettings(payload);
    };

    return state.settings && state.settings.settings ? (
        <div>
            <div className='left' onClick={toggleEmail}>Epost:</div>
            <div className='right' onClick={toggleEmail}>
                {state.settings.settings.email ? <ToggleOnIcon /> : <ToggleOffIcon />}
            </div>
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
