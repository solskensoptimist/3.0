import React, {useEffect, useRef, useState} from 'react';
import {connect} from 'react-redux';
import {tc} from 'helpers';
import {NavLink} from 'react-router-dom';
import {addEditRemoveCompanyEmailPhone} from 'store/company/tasks';
import {showFlashMessage} from 'store/flash_messages/tasks';
import Icon from 'components/icon';
import Loading from 'components/loading';
import Tooltip from 'components/tooltip';
import WidgetHeader from 'components/widget_header';

/**
 * Company information component.
 */
const CompanyInfo = (state) => {
    const [emails, setEmails] = useState([]);
    const [minimize, setMinimize] = useState(false);
    const [currentEmailEdit, setCurrentEmailEdit] = useState(null);
    const [currentPhoneEdit, setCurrentPhoneEdit] = useState(null);
    const [phoneNumbers, setPhoneNumbers] = useState([]);
    const companyInfoEmailsInputRefs = useRef([]);
    const companyInfoPhoneInputRefs = useRef([]);

    // Set value from input ref to emails array.
    const _onEmailInputChange = (id, index) => {
        setEmails(emails.map((num) => {
            if (num.id === id) {
                num.value = companyInfoEmailsInputRefs.current[index].value;
            }
            return num;
        }));
    };

    // Set value from input ref to phoneNumbers array.
    const _onPhoneInputChange = (id, index) => {
        setPhoneNumbers(phoneNumbers.map((num) => {
            if (num.id === id) {
                num.value = companyInfoPhoneInputRefs.current[index].value;
            }
            return num;
        }));
    };

    // Add phone or email.
    const _addValue = async (obj, type) => {
        if (!obj.value || (obj.value && obj.value === '')) {
            return showFlashMessage(tc.valueCannotBeEmpty);
        }

        setCurrentEmailEdit(null);
        setCurrentPhoneEdit(null);
        return await addEditRemoveCompanyEmailPhone({
            action: 'add',
            prospectId: state.company.company.user_id,
            type: type,
            value: obj.value,
        });
    };

    // Remove phone or email.
    const _removeValue = async (obj, type) => {
        setCurrentEmailEdit(null);
        setCurrentPhoneEdit(null);
        return await addEditRemoveCompanyEmailPhone({
            action: 'delete',
            id: obj.id,
            prospectId: state.company.company.user_id,
            type: type,
            value: '',
        });
    };

    // Render emails rows.
    const _renderEmails = () => {
        return (emails && emails.length) ? emails.map((num, i) => {
            if (!num.new && !num.id && num.hasOwnProperty('value')) {
                // Render existing values, non editable.
                return (
                    <div className='companyInfoWrapper__companyInfo__content__item__field' key={i}>
                        <p>{num.value}</p>
                    </div>
                );
            } else if (num.new && !num.id && num.hasOwnProperty('value')) {
                // Render added values, not yet saved.
                return (
                    <div className='companyInfoWrapper__companyInfo__content__item__editField' key={i}>
                        <input onChange={() => {_onEmailInputChange(num.id, i)}} placeholder={tc.addEmail} ref={(el) => (companyInfoEmailsInputRefs.current[i] = el)} type='text' value={num.value}/>
                        <Tooltip horizontalDirection='left' tooltipContent={tc.cancel}><Icon val='clear' onClick={() => {setEmails(phoneNumbers.filter((x, index) => i !== index))}}/></Tooltip>
                        <Tooltip horizontalDirection='left' tooltipContent={tc.save}><Icon val='save' onClick={() => {_addValue(num, 'email')}}/></Tooltip>
                    </div>
                );
            } else if (num.id && num.hasOwnProperty('value') && num.id !== currentEmailEdit) {
                // Render existing values, editable.
                return (
                    <div className='companyInfoWrapper__companyInfo__content__item__field' key={i}>
                        <p>{num.value}</p>
                        <Tooltip horizontalDirection='left' tooltipContent={tc.edit}><Icon val='edit' onClick={() => {setCurrentEmailEdit(num.id)}}/></Tooltip>
                    </div>
                );
            } else if (num.id && num.hasOwnProperty('value') && num.id === currentEmailEdit) {
                // Render a value that is currently being edited.
                return (
                    <div className='companyInfoWrapper__companyInfo__content__item__editField' key={i}>
                        <input onChange={() => {_onEmailInputChange(num.id, i)}} placeholder={tc.addEmail} ref={(el) => (companyInfoEmailsInputRefs.current[i] = el)} type='text' value={num.value}/>
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
                    <div className='companyInfoWrapper__companyInfo__content__item__field' key={i}>
                        <p>{num.value}</p>
                    </div>
                );
            } else if (num.new && !num.id && num.hasOwnProperty('value')) {
                // Render added values, not yet saved.
                return (
                    <div className='companyInfoWrapper__companyInfo__content__item__editField' key={i}>
                        <input onChange={() => {_onPhoneInputChange(num.id, i)}} placeholder={tc.addPhone} ref={(el) => (companyInfoPhoneInputRefs.current[i] = el)} type='text' value={num.value}/>
                        <Tooltip horizontalDirection='left' tooltipContent={tc.cancel}><Icon val='clear' onClick={() => {setPhoneNumbers(phoneNumbers.filter((x, index) => i !== index))}}/></Tooltip>
                        <Tooltip horizontalDirection='left' tooltipContent={tc.save}><Icon val='save' onClick={() => {_addValue(num, 'phone')}}/></Tooltip>
                    </div>
                );
            } else if (num.id && num.hasOwnProperty('value') && num.id !== currentPhoneEdit) {
                // Render existing values, editable.
                return (
                    <div className='companyInfoWrapper__companyInfo__content__item__field' key={i}>
                        <p>{num.value}</p>
                        <Tooltip horizontalDirection='left' tooltipContent={tc.edit}><Icon val='edit' onClick={() => {setCurrentPhoneEdit(num.id)}}/></Tooltip>
                    </div>
                );
            } else if (num.id && num.hasOwnProperty('value') && num.id === currentPhoneEdit) {
                // Render a value that is currently being edited.
                return (
                    <div className='companyInfoWrapper__companyInfo__content__item__editField' key={i}>
                        <input onChange={() => {_onPhoneInputChange(num.id, i)}} placeholder={tc.addPhone} ref={(el) => (companyInfoPhoneInputRefs.current[i] = el)} type='text' value={num.value}/>
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

    // Before render, wait for these.
    const _stateCheck = () => {
        return (emails && phoneNumbers && state && state.company && state.company.company && Object.keys(state.company.company).length);
    };

    // Update email or phone.
    const _updateValue = async (obj, type) => {
        if (!obj.value || (obj.value && obj.value === '')) {
            return showFlashMessage(tc.valueCannotBeEmpty);
        }

        setCurrentEmailEdit(null);
        setCurrentPhoneEdit(null);
        return await addEditRemoveCompanyEmailPhone({
            action: 'edit',
            id: obj.id,
            prospectId: state.company.company.user_id,
            type: type,
            value: obj.value,
        });
    };

    useEffect(() => {
        if (state.company && state.company.company) {
            // Deep clone.
            setEmails(JSON.parse(JSON.stringify(state.company.company.emails)));
            setPhoneNumbers(JSON.parse(JSON.stringify(state.company.company.phoneNumbers)));
        }
    }, [state.company]);

    return ( _stateCheck() ?
        <div className='companyInfoWrapper'>
            <div className='companyInfoWrapper__companyInfo'>
                <div className='companyInfoWrapper__companyInfo__header'>
                    <WidgetHeader
                        iconVal='company'
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
                        headlineSub={tc.companyInfo}
                    />
                </div>
                {!minimize &&
                <div className='companyInfoWrapper__companyInfo__content'>
                    <div className='companyInfoWrapper__companyInfo__content__item'>
                        <p className='companyInfoWrapper__companyInfo__content__item__companyInfoLabel'>{tc.companyName}</p>
                        <p>{(state.company.company.name) ? state.company.company.name : tc.dataMissing}</p>
                    </div>
                    <div className='companyInfoWrapper__companyInfo__content__item'>
                        <p className='companyInfoWrapper__companyInfo__content__item__companyInfoLabel'>{tc.orgNr}</p>
                        <p>{(state.company.company.user_id) ? state.company.company.user_id : tc.dataMissing}</p>
                    </div>
                    <div className='companyInfoWrapper__companyInfo__content__item'>
                        <p className='companyInfoWrapper__companyInfo__content__item__companyInfoLabel'>{tc.branch}</p>
                        <p>{(state.company.company.finance && state.company.company.finance.abv_hgrupp) ? state.company.company.finance.abv_hgrupp : tc.dataMissing}</p>
                            <p>{(state.company.company.finance && state.company.company.finance.abv_ugrupp) ? state.company.company.finance.abv_ugrupp : null}</p>
                    </div>
                    <div className='companyInfoWrapper__companyInfo__content__item'>
                        <p className='companyInfoWrapper__companyInfo__content__item__companyInfoLabel'>{tc.koncernCompany}</p>
                        <p>{(state.company.koncern && state.company.koncern.mother) ?
                            <>{tc.partOfKoncern} {tc.with.toLowerCase()} {state.company.koncern.count.toString()} {tc.companies.toLowerCase()} {tc.and.toLowerCase()} {state.company.koncern.cars.toString()} {tc.cars.toLowerCase()}: <NavLink exact to={'/koncern/' + state.company.koncern.mother.id} key='hem'>{state.company.koncern.mother.name}</NavLink></>
                            : tc.dataMissing}
                        </p>
                    </div>
                    <div className='companyInfoWrapper__companyInfo__content__item'>
                        <p className='companyInfoWrapper__companyInfo__content__item__companyInfoLabel'>{tc.visitingAddress}</p>
                        <p>{(state.company.company.addresses && state.company.company.addresses.ba_gatuadress) ? state.company.company.addresses.ba_gatuadress : tc.dataMissing}</p>
                        <p>{(state.company.company.addresses && state.company.company.addresses.ba_postnr && state.company.company.addresses.ba_postort) ? '' + state.company.company.addresses.ba_postnr + ' ' + state.company.company.addresses.ba_postort : tc.dataMissing}</p>
                    </div>
                    <div className='companyInfoWrapper__companyInfo__content__item'>
                        <p className='companyInfoWrapper__companyInfo__content__item__companyInfoLabel'>{tc.postAddress}</p>
                        <p>{(state.company.company.addresses && state.company.company.addresses.ua_gatuadress) ? state.company.company.addresses.ua_gatuadress : tc.dataMissing}</p>
                        <p>{(state.company.company.addresses && state.company.company.addresses.ua_postnr && state.company.company.addresses.ua_postort) ? '' + state.company.company.addresses.ua_postnr + ' ' + state.company.company.addresses.ua_postort : tc.dataMissing}</p>
                    </div>
                    <div className='companyInfoWrapper__companyInfo__content__item'>
                        <p className='companyInfoWrapper__companyInfo__content__item__companyInfoLabel'>{tc.phoneNumbers}</p>
                        {_renderPhoneNumbers()}
                        <div className='companyInfoWrapper__companyInfo__content__item__addField'>
                            <Tooltip horizontalDirection='left' tooltipContent={tc.addPhone}>
                                <Icon val='add' onClick={() => {
                                    setPhoneNumbers((Array.isArray(phoneNumbers)) ? phoneNumbers.concat([{new: true, value: ''}]) : [{new: true, value: ''}])
                                }}/>
                            </Tooltip>
                        </div>
                    </div>
                    <div className='companyInfoWrapper__companyInfo__content__item'>
                        <p className='companyInfoWrapper__companyInfo__content__item__companyInfoLabel'>{tc.email}</p>
                        {_renderEmails()}
                        <div className='companyInfoWrapper__companyInfo__content__item__addField'>
                            <Tooltip horizontalDirection='left' tooltipContent={tc.addEmail}>
                                <Icon val='add' onClick={() => {
                                    setEmails((Array.isArray(emails)) ? emails.concat([{new: true, value: ''}]) : [{new: true, value: ''}])
                                }}/>
                            </Tooltip>
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
        company: state.company,
    };
};

export default connect(
    MapStateToProps,
)(CompanyInfo);
