import React, {useEffect, useRef, useState} from 'react';
import {connect} from 'react-redux';
import {showFlashMessage} from 'store/flash_messages/tasks';
import {prospectHelper, tc} from 'helpers';
import {toggleConsent} from 'store/person/tasks';
import Icon from 'components/icon';
import Loading from 'components/loading';
import Tooltip from 'components/tooltip';
import WidgetHeader from 'components/widget_header';

/**
 * Person information component.
 */
const Person = (state) => {
    const [emails, setEmails] = useState([]);
    const [minimize, setMinimize] = useState(false);
    const [currentEmailEdit, setCurrentEmailEdit] = useState(null);
    const [currentPhoneEdit, setCurrentPhoneEdit] = useState(null);
    const [name, setName] = useState(null);
    const [phoneNumbers, setPhoneNumbers] = useState([]);
    const personInfoEmailsInputRefs = useRef([]);
    const personInfoNameInputRef = useRef(null);
    const personInfoPhoneInputRefs = useRef([]);

    // Add phone or email.
    const _addValue = async (obj, type) => {
        if (!obj.value || (obj.value && obj.value === '')) {
            return showFlashMessage(tc.valueCannotBeEmpty);
        }

        setCurrentEmailEdit(null);
        setCurrentPhoneEdit(null);
        console.log('ADD: Bygg funktion för att addEditRemovePersonEmailPhone', type, obj.value);
        // return await addEditRemoveCompanyEmailPhone({
        //     action: 'add',
        //     prospectId: state.company.company.user_id,
        //     type: type,
        //     value: obj.value,
        // });
    };

    // Set value from input ref to name.
    const _onNameInputChange = () => {
        if (personInfoNameInputRef && personInfoNameInputRef.current) {
            setName(personInfoNameInputRef.current.value);
        }
    };

    // Set value from input ref to phoneNumbers array.
    const _onPhoneInputChange = (id, index) => {
        setPhoneNumbers(phoneNumbers.map((num) => {
            if (num.id === id) {
                num.value = personInfoPhoneInputRefs.current[index].value;
            }
            return num;
        }));
    };

    // Set value from input ref to emails array.
    const _onEmailInputChange = (id, index) => {
        setEmails(emails.map((num) => {
            if (num.id === id) {
                num.value = personInfoEmailsInputRefs.current[index].value;
            }
            return num;
        }));
    };

    // Remove phone or email.
    const _removeValue = async (obj, type) => {
        setCurrentEmailEdit(null);
        setCurrentPhoneEdit(null);
        console.log('REMOVE: Bygg funktion för att addEditRemovePersonEmailPhone', type, obj.id);
        // Om det gäller name ska vi inte behöva obj.id...

        // return await addEditRemoveCompanyEmailPhone({
        //     action: 'delete',
        //     id: obj.id,
        //     prospectId: state.company.company.user_id,
        //     type: type,
        //     value: '',
        // });
    };

    // Render emails rows.
    const _renderEmails = () => {
        return (emails && emails.length) ? emails.map((num, i) => {
            if (!num.new && !num.id && num.hasOwnProperty('value')) {
                // Render existing values, non editable.
                return (
                    <div className='personInfoWrapper__personInfo__content__item__field' key={i}>
                        <p>{num.value}</p>
                    </div>
                );
            } else if (num.new && !num.id && num.hasOwnProperty('value')) {
                // Render added values, not yet saved.
                return (
                    <div className='personInfoWrapper__personInfo__content__item__editField' key={i}>
                        <input onChange={() => {_onEmailInputChange(num.id, i)}} placeholder={tc.addEmail} ref={(el) => (personInfoEmailsInputRefs.current[i] = el)} type='text' value={num.value}/>
                        <Tooltip horizontalDirection='left' tooltipContent={tc.cancel}><Icon val='clear' onClick={() => {setEmails(phoneNumbers.filter((x, index) => i !== index))}}/></Tooltip>
                        <Tooltip horizontalDirection='left' tooltipContent={tc.save}><Icon val='save' onClick={() => {_addValue(num, 'email')}}/></Tooltip>
                    </div>
                );
            } else if (num.id && num.hasOwnProperty('value') && num.id !== currentEmailEdit) {
                // Render existing values, editable.
                return (
                    <div className='personInfoWrapper__personInfo__content__item__field' key={i}>
                        <p>{num.value}</p>
                        <Tooltip horizontalDirection='left' tooltipContent={tc.edit}><Icon val='edit' onClick={() => {setCurrentEmailEdit(num.id)}}/></Tooltip>
                    </div>
                );
            } else if (num.id && num.hasOwnProperty('value') && num.id === currentEmailEdit) {
                // Render a value that is currently being edited.
                return (
                    <div className='personInfoWrapper__personInfo__content__item__editField' key={i}>
                        <input onChange={() => {_onEmailInputChange(num.id, i)}} placeholder={tc.addEmail} ref={(el) => (personInfoEmailsInputRefs.current[i] = el)} type='text' value={num.value}/>
                        <Tooltip horizontalDirection='left' tooltipContent={tc.cancel}><Icon val='clear' onClick={() => {setCurrentEmailEdit(null)}}/></Tooltip>
                        <Tooltip horizontalDirection='left' tooltipContent={tc.save}><Icon val='save' onClick={() => {_updateValue(num, 'email')}}/></Tooltip>
                        <Tooltip horizontalDirection='left' tooltipContent={tc.remove}><Icon val='remove' onClick={() => {_removeValue(num, 'email')}}/></Tooltip>
                    </div>
                );
            } else {
                return null;
            }
        }) : null
    };

    // Render phone number rows.
    const _renderPhoneNumbers = () => {
        return (phoneNumbers && phoneNumbers.length) ? phoneNumbers.map((num, i) => {
            if (!num.new && !num.id && num.hasOwnProperty('value')) {
                // Render existing values, non editable.
                return (
                    <div className='personInfoWrapper__personInfo__content__item__field' key={i}>
                        <p>{num.value}</p>
                    </div>
                );
            } else if (num.new && !num.id && num.hasOwnProperty('value')) {
                // Render added values, not yet saved.
                return (
                    <div className='personInfoWrapper__personInfo__content__item__editField' key={i}>
                        <input onChange={() => {_onPhoneInputChange(num.id, i)}} placeholder={tc.addPhone} ref={(el) => (personInfoPhoneInputRefs.current[i] = el)} type='text' value={num.value}/>
                        <Tooltip horizontalDirection='left' tooltipContent={tc.cancel}><Icon val='clear' onClick={() => {setPhoneNumbers(phoneNumbers.filter((x, index) => i !== index))}}/></Tooltip>
                        <Tooltip horizontalDirection='left' tooltipContent={tc.save}><Icon val='save' onClick={() => {_addValue(num, 'phone')}}/></Tooltip>
                    </div>
                );
            } else if (num.id && num.hasOwnProperty('value') && num.id !== currentPhoneEdit) {
                // Render existing values, editable.
                return (
                    <div className='personInfoWrapper__personInfo__content__item__field' key={i}>
                        <p>{num.value}</p>
                        <Tooltip horizontalDirection='left' tooltipContent={tc.edit}><Icon val='edit' onClick={() => {setCurrentPhoneEdit(num.id)}}/></Tooltip>
                    </div>
                );
            } else if (num.id && num.hasOwnProperty('value') && num.id === currentPhoneEdit) {
                // Render a value that is currently being edited.
                return (
                    <div className='personInfoWrapper__personInfo__content__item__editField' key={i}>
                        <input onChange={() => {_onPhoneInputChange(num.id, i)}} placeholder={tc.addPhone} ref={(el) => (personInfoPhoneInputRefs.current[i] = el)} type='text' value={num.value}/>
                        <Tooltip horizontalDirection='left' tooltipContent={tc.cancel}><Icon val='clear' onClick={() => {setCurrentPhoneEdit(null)}}/></Tooltip>
                        <Tooltip horizontalDirection='left' tooltipContent={tc.save}><Icon val='save' onClick={() => {_updateValue(num, 'phone')}}/></Tooltip>
                        <Tooltip horizontalDirection='left' tooltipContent={tc.remove}><Icon val='remove' onClick={() => {_removeValue(num, 'phone')}}/></Tooltip>
                    </div>
                );
            } else {
                return null;
            }
        }) : null
    };

    const _stateCheck = () => {
        return !!(state && state.person && state.person.person);
    };

    // Update email or phone.
    const _updateValue = async (obj, type) => {
        if (!obj.value || (obj.value && obj.value === '')) {
            return showFlashMessage(tc.valueCannotBeEmpty);
        }

        setCurrentEmailEdit(null);
        setCurrentPhoneEdit(null);
        console.log('UPDATE: Bygg funktion för att addEditRemovePersonEmailPhone', type, obj.id, obj.value);
        // return await addEditRemoveCompanyEmailPhone({
        //     action: 'edit',
        //     id: obj.id,
        //     prospectId: state.company.company.user_id,
        //     type: type,
        //     value: obj.value,
        // });
    };

    useEffect(() => {
        if (state.person && state.person.person) {
            // Deep clone.
            setEmails(JSON.parse(JSON.stringify(state.person.person.emails)));
            setPhoneNumbers(JSON.parse(JSON.stringify(state.person.person.phoneNumbers)));
        }
    }, [state.person]);

    return (_stateCheck() ?
            <div className='personInfoWrapper'>
                <div className='personInfoWrapper__personInfo'>
                    <div className='personInfoWrapper__personInfo__header'>
                        <WidgetHeader
                            iconVal='person'
                            dashboard={
                                minimize ?
                                    <>
                                        <Tooltip horizontalDirection='left' tooltipContent={tc.maximize}><Icon val='maximize' onClick={() => {setMinimize(false)}}/></Tooltip>
                                    </> :
                                    <>
                                        <Tooltip horizontalDirection='left' tooltipContent={tc.minimize}><Icon val='minimize' onClick={() => {setMinimize(true)}}/></Tooltip>
                                    </>
                            }
                            headline={tc.info}
                            headlineSub={tc.personInfo}
                        />
                    </div>
                    {!minimize &&
                    <div className='personInfoWrapper__personInfo__content'>
                        <div className='personInfoWrapper__personInfo__content__item'>
                            <p className='personInfoWrapper__personInfo__content__item__personInfoLabel'>{tc.name}</p>
                            <p>{(state.person.person.name) ? state.person.person.name : tc.dataMissing}</p>
                            {name !== null &&
                                <div className='personInfoWrapper__personInfo__content__item__editField'>
                                    <input onChange={() => {_onNameInputChange()}} placeholder={tc.addName} ref={personInfoNameInputRef} type='text' value={name}/>
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.cancel}><Icon val='clear' onClick={() => {setName(null)}}/></Tooltip>
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.save}><Icon val='save' onClick={() => {_updateValue({value: name}, 'name')}}/></Tooltip>
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.remove}><Icon val='remove' onClick={() => {_removeValue({}, 'name')}}/></Tooltip>
                                </div>
                            }
                            <div className='personInfoWrapper__personInfo__content__item__addField'>
                                <Tooltip horizontalDirection='right' tooltipContent={tc.addName}>
                                    <Icon val='add' onClick={() => {
                                        setName('');
                                    }}/>
                                </Tooltip>
                            </div>
                        </div>
                        <div className='personInfoWrapper__personInfo__content__item'>
                            <p className='personInfoWrapper__personInfo__content__item__personInfoLabel'>{tc.gender}</p>
                            <p>{(state.person.person.gender ? prospectHelper.getGenderString(state.person.person.gender) : tc.dataMissing)}</p>
                        </div>
                        <div className='personInfoWrapper__personInfo__content__item'>
                            <p className='personInfoWrapper__personInfo__content__item__personInfoLabel'>{tc.age}</p>
                            <p>{state.person.person.birthYear ? prospectHelper.getAgeString(state.person.person.birthYear) : tc.dataMissing}</p>
                        </div>
                        <div className='personInfoWrapper__personInfo__content__item'>
                            <p className='personInfoWrapper__personInfo__content__item__personInfoLabel'>{tc.address}</p>
                            <p>{(state.person.person.address ? state.person.person.address : null)}</p>
                            <p>{(state.person.person.zip ? state.person.person.zip : null)} {(state.person.person.zipMuncipality ? state.person.person.zipMuncipality : null)}</p>
                        </div>
                        <div className='personInfoWrapper__personInfo__content__item'>
                            <p className='personInfoWrapper__personInfo__content__item__personInfoLabel'>{tc.phoneNumbers}</p>
                            {_renderPhoneNumbers()}
                            <div className='personInfoWrapper__personInfo__content__item__addField'>
                                <Tooltip horizontalDirection='right' tooltipContent={tc.addPhone}>
                                    <Icon val='add' onClick={() => {
                                        setPhoneNumbers((Array.isArray(phoneNumbers)) ? phoneNumbers.concat([{new: true, value: ''}]) : [{new: true, value: ''}])
                                    }}/>
                                </Tooltip>
                            </div>
                        </div>
                        <div className='personInfoWrapper__personInfo__content__item'>
                            <p className='personInfoWrapper__personInfo__content__item__personInfoLabel'>{tc.email}</p>
                            {_renderEmails()}
                            <div className='personInfoWrapper__personInfo__content__item__addField'>
                                <Tooltip horizontalDirection='left' tooltipContent={tc.addEmail}>
                                    <Icon val='add' onClick={() => {
                                        setEmails((Array.isArray(emails)) ? emails.concat([{new: true, value: ''}]) : [{new: true, value: ''}])
                                    }}/>
                                </Tooltip>
                            </div>
                        </div>
                        <div className='personInfoWrapper__personInfo__content__item'>
                            <p className='personInfoWrapper__personInfo__content__item__personInfoLabel'>{tc.gdprConsent}</p>
                            <div className='personInfoWrapper__personInfo__content__item__consent'>
                                {state.person.person.consent ?
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.gdprConsentInfo}>
                                        <Icon onClick={() => {toggleConsent({id: state.person.person.user_id})}} val='check'/>
                                    </Tooltip> :
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.gdprConsentInfo}>
                                        <Icon onClick={() => {toggleConsent({id: state.person.person.user_id})}} val='checkbox'/>
                                    </Tooltip>
                                }
                            </div>
                        </div>
                    </div>
                    }
                </div>
            </div> :
            <Loading/>
    );
};

const MapStateToProps = (state) => {
    return {
        person: state.person,
    };
};

export default connect(
    MapStateToProps,
)(Person);
