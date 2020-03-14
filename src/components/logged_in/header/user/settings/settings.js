import React, {useEffect, useState, useRef} from 'react';
import {connect} from 'react-redux';
import {getSettings, savePassword, saveSettings, setShowsettings} from 'store/settings/tasks';
import {userLogout} from 'store/user/tasks';
import Loading from 'components/common/loading';
import ToggleOffIcon from '@material-ui/icons/ToggleOff';
import ToggleOnIcon from '@material-ui/icons/ToggleOn';
import tc from 'text_content';

const Settings = (state) =>  {
    useEffect(() => {
        getSettings();
    }, []);

    const [passwordHint, setPasswordHint] = useState('');
    const [showPasswordHint, setShowPasswordHint] = useState(false);
    const passwordRef1 = useRef(null);
    const passwordRef2 = useRef(null);

    const _handleClick = (e) => {
        e.stopPropagation(); // Prevent settings to close when clicking inside.
    };

    /**
     * Save password.
     */
    const _savePassword = async () => {
        setShowPasswordHint(true);

        if (passwordRef1.current.value === '' || passwordRef2.current.value === '') {
            // Check if is empty.
            return setPasswordHint(tc.settingsPasswordHintEmpty);
        } else if (passwordRef1.current.value !== passwordRef2.current.value) {
            // Check if match.
            return setPasswordHint(tc.settingsPasswordHintNotMatching);
        }

        // Save.
        const payload = {password: passwordRef1.current.value};
        passwordRef1.current.value = '';
        passwordRef2.current.value = '';
        await savePassword(payload);
        return setPasswordHint(tc.settingsPasswordHintSaved);
    };

    /**
     * Settings retrieved?
     */
    const _stateCheck = () => {
        return !!state && state.settings && state.settings.email !== null;
    };

    /**
     * Toggle email notifications setting.
     */
    const _toggleEmail = () => {
        let payload = state.settings;
        payload.email = !state.settings.email;
        saveSettings(payload);
    }

    return _stateCheck() ? (
        <div className='settings' onClick={_handleClick}>
            <div className='settings__header'>
                <div className='settings__header__title'><h3>{tc.settings}</h3></div>
            </div>
            <div className='settings__content'>
                <div className='settings__content__item'>
                    <div className='settings__content__item__small'>
                        <div className='settings__content__item__small__label'>
                            <h5>{tc.emailNotifications}</h5>
                        </div>
                        <div className='settings__content__item__small__content'>
                            <div onClick={_toggleEmail}>
                                {state.settings.email ? <ToggleOnIcon /> : <ToggleOffIcon />}
                            </div>
                        </div>
                    </div>
                    <div className='settings__content__item__small'>
                        <div className='settings__content__item__small__label'>
                            <h5>{tc.emailNotifications}</h5>
                        </div>
                        <div className='settings__content__item__small__content'>
                            <div onClick={_toggleEmail}>
                                {state.settings.email ? <ToggleOnIcon /> : <ToggleOffIcon />}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='settings__content__item'>
                    <div className='settings__content__item__full'>
                        <div className='settings__content__item__full__label'>
                            <h5>{tc.createNewPassword}</h5>
                        </div>
                        <div className='settings__content__item__full__content'>
                            <input type='password' placeholder='Skriv nytt lösenord' ref={passwordRef1} />
                            <input type='password' placeholder='Återupprepa lösenord' ref={passwordRef2} />
                            {showPasswordHint && <div className='settings__content__item__hint'>{passwordHint}</div>}
                            <div className='settings__content__item__button' onClick={_savePassword}>{tc.savePassword}</div>
                        </div>
                    </div>
                </div>
                <div className='settings__content__item'>
                    <div className='settings__content__item__full'>
                        <div className='settings__content__item__full__content'>
                            <div className='settings__content__item__button logout' onClick={userLogout}>{tc.logout}</div>
                        </div>
                    </div>
                </div>
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
