import React, {useEffect, useState, useRef} from 'react';
import {connect} from 'react-redux';
import {getSettings, saveLanguage, savePassword, saveSettings} from 'store/settings/tasks';
import {userLogout} from 'store/user/tasks';
import {tc} from 'helpers';
import Icon from 'components/icon';
import Loading from 'components/loading';
import Popup from 'components/popup';
import Tooltip from 'components/tooltip';
import WidgetHeader from 'components/widget_header';

/**
 * Handle user settings.
 * Renders as popup, closes via props func.
 */
const Settings = (state) =>  {
    const [passwordHint, setPasswordHint] = useState('');
    const [showPasswordHint, setShowPasswordHint] = useState(false);
    const [lang, setLang] = useState(null);
    const passwordRef1 = useRef(null);
    const passwordRef2 = useRef(null);

    useEffect(() => {
        getSettings();
    }, []);

    useEffect(() => {
        if (state.user.info) {
            setLang(state.user.info.lang);
        }
    }, [state.user]);

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
        return !!(state.settings && state.settings.email !== null && lang);
    };

    /**
     * Toggle email notifications setting.
     */
    const _toggleEmail = async () => {
        return await saveSettings({email: !state.settings.email});
    };

    return _stateCheck() ? (
        <Popup close={state.props.close} size='medium'>
            <div className='settingsWrapper'>
                <div className='settingsWrapper__settings'>
                    <div className='settingsWrapper__settings__header'>
                        <WidgetHeader
                            iconVal='settings'
                            headline={tc.settings}
                        />
                    </div>
                    <div className='settingsWrapper__settings__content'>
                        <div className='settingsWrapper__settings__content__item'>
                            <div className='settingsWrapper__settings__content__item__small'>
                                <div className='settingsWrapper__settings__content__item__small__label'>
                                    <h5>{tc.emailNotifications}:</h5>
                                </div>
                                <div className='settingsWrapper__settings__content__item__small__content'>
                                    <Tooltip tooltipContent={`${tc.emailNotifications} ${tc.is.toLowerCase()} ${state.settings.email ? tc.activated.toLowerCase() : tc.disabled.toLowerCase()}`}>
                                    {state.settings.email ? <Icon val='toggleOn' onClick={_toggleEmail}/> : <Icon active={true} val='toggleOff' onClick={_toggleEmail}/>}
                                    </Tooltip>
                                </div>
                            </div>
                            <div className='settingsWrapper__settings__content__item__small'>
                                <div className='settingsWrapper__settings__content__item__small__label'>
                                    <h5>{tc.language}:</h5>
                                </div>
                                <div className='settingsWrapper__settings__content__item__small__content'>
                                    <Tooltip tooltipContent={`${tc.chosenLanguage} ${tc.is.toLowerCase()} ${tc[lang].toLowerCase()}`}>
                                        <div className='settingsWrapper__settings__content__item__small__content__flagHolder'>
                                            <img src={__dirname + 'images/sweden.png'} alt={tc.chooseSwedishLanguage}/>
                                            {(lang === 'swe') ? <Icon active={true} val='check'/> : <Icon onClick={() => {saveLanguage({lang: 'swe'})}} val='checkbox'/>}
                                        </div>
                                        <div className='settingsWrapper__settings__content__item__small__content__flagHolder'>
                                            <img src={__dirname + 'images/united_kingdom.png'} alt={tc.chooseEnglishLanguage}/>
                                            {(lang === 'en') ? <Icon active={true} val='check'/> : <Icon onClick={() => {saveLanguage({lang: 'en'})}} val='checkbox'/>}
                                        </div>
                                    </Tooltip>
                                </div>
                            </div>
                        </div>
                        <div className='settingsWrapper__settings__content__item'>
                            <div className='settingsWrapper__settings__content__item__full'>
                                <div className='settingsWrapper__settings__content__item__full__label'>
                                    <h5>{tc.chooseNewPassword}:</h5>
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
        </Popup>
    ) : (
        <Loading />
    );
};

const MapStateToProps = (state, props) => {
    return {
        props: props,
        settings: state.settings,
        user: state.user,
    };
};

export default connect(
    MapStateToProps,
)(Settings);
