import React, {useEffect, useState, useRef} from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {getSettings, savePassword, saveSettings, setShowSettings} from 'store/settings/tasks';
import {userLogout} from 'store/user/tasks';
import Loading from 'components/shared/loading';
import {tc} from 'helpers';
import Icon from 'components/shared/icon';

const Settings = (state) =>  {
    const [passwordHint, setPasswordHint] = useState('');
    const [showPasswordHint, setShowPasswordHint] = useState(false);
    const passwordRef1 = useRef(null);
    const passwordRef2 = useRef(null);
    const settingsBoxRef = useRef(null);

    /**
     * Close settings.
     */
    const _closeShowSettings = () => {
        setShowSettings({showSettings: false});
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
    };

    useEffect(() => {
        getSettings();

        /**
         * When clicking outside settings, close it.
         */
        const _unmountSearch = (e) => {
            if (settingsBoxRef && settingsBoxRef.current) {
                const node = ReactDOM.findDOMNode(settingsBoxRef.current);
                if (node && !node.contains(e.target)) {
                    _closeShowSettings();
                }
            }
        };

        window.addEventListener('mousedown', _unmountSearch);
        return () => window.removeEventListener('mousedown', _unmountSearch);
    }, []);

    return _stateCheck() ? (
        <div className='settingsWrapper'>
            <div className='settingsWrapper__settings' ref={settingsBoxRef}>
                <div className='settingsWrapper__settings__header'>
                    <div className='settingsWrapper__settings__header__title'><h2>{tc.settings}</h2></div>
                </div>
                <div className='settingsWrapper__settings__content'>
                    <div className='settingsWrapper__settings__content__item'>
                        <div className='settingsWrapper__settings__content__item__small'>
                            <div className='settingsWrapper__settings__content__item__small__label'>
                                <h5>{tc.emailNotifications}</h5>
                            </div>
                            <div className='settingsWrapper__settings__content__item__small__content'>
                                {state.settings.email ? <Icon val='toggleOn' onClick={_toggleEmail}/> : <Icon val='toggleOff' onClick={_toggleEmail}/>}
                            </div>
                        </div>
                        <div className='settingsWrapper__settings__content__item__small'>
                            <div className='settingsWrapper__settings__content__item__small__label'>
                                <h5>{tc.emailNotifications}</h5>
                            </div>
                            <div className='settingsWrapper__settings__content__item__small__content'>
                                {state.settings.email ? <Icon val='toggleOn' onClick={_toggleEmail} /> : <Icon val='toggleOff' onClick={_toggleEmail}/>}
                            </div>
                        </div>
                    </div>
                    <div className='settingsWrapper__settings__content__item'>
                        <div className='settingsWrapper__settings__content__item__full'>
                            <div className='settingsWrapper__settings__content__item__full__label'>
                                <h5>{tc.createNewPassword}</h5>
                            </div>
                            <div className='settingsWrapper__settings__content__item__full__content'>
                                <input type='password' placeholder='Skriv nytt lösenord' ref={passwordRef1} />
                                <input type='password' placeholder='Återupprepa lösenord' ref={passwordRef2} />
                                {showPasswordHint && <div className='settingsWrapper__settings__content__item__hint'>{passwordHint}</div>}
                                <div className='settingsWrapper__settings__content__item__button' onClick={_savePassword}>{tc.savePassword}</div>
                            </div>
                        </div>
                    </div>
                    <div className='settingsWrapper__settings__content__item'>
                        <div className='settingsWrapper__settings__content__item__full'>
                            <div className='settingsWrapper__settings__content__item__full__content'>
                                <div className='settingsWrapper__settings__content__item__button' onClick={userLogout}>
                                    {tc.logout}
                                </div>
                            </div>
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
