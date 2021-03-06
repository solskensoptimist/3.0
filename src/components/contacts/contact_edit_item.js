import React, {useEffect, useRef, useState} from 'react';
import {tc} from 'helpers';
import carHelper from 'shared_helpers/car_helper';
import companyHelper from 'shared_helpers/company_helper';
import Icon from 'components/icon';
import Tooltip from 'components/tooltip';

/**
 * Render a footer_contact item in edit mode.
 *
 * @param props.cancelEdit
 * @param props.footer_contact
 * @param props.removeContact
 * @param props.removeEntityFromContact
 * @param props.saveChanges
 */
export default (props) => {
    const [contactObj, setContactObj] = useState({});
    const contactCommentInputRef = useRef(null);
    const contactEmailInputRefs = useRef([]);
    const contactNameInputRef = useRef(null);
    const contactPhoneInputRefs = useRef([]);

    const _onInputChange = () => {
        setContactObj({
            ...contactObj,
            comment: contactCommentInputRef.current.value,
            email: contactEmailInputRefs.current.map((num) => num.value),
            name: contactNameInputRef.current.value,
            tele: contactPhoneInputRefs.current.map((num) => num.value),
        });
    };

    const _saveChanges = () => {
        let contact = contactObj;

        if (!Array.isArray(contact.email)) {
            contact.email = [];
        }
        if (!Array.isArray(contact.tele)) {
            contact.tele = [];
        }

        // Filter out empty values.
        contact.email = contact.email.filter((num) => (num && num.length));
        contact.tele = contact.tele.filter((num) => (num && num.length));

        props.saveChanges(contact);
    };

    useEffect(() => {
        let contact = props.contact;

        // To add empty input fields.
        if (!contact.email.length) {
            contact.email = [''];
        }

        if (!contact.tele.length) {
            contact.tele = [''];
        }

        setContactObj(props.contact);
    }, [props.contact]);

    return (
        <div className='contactsWrapper__contacts__content__contacts__item'>
            <div className='contactsWrapper__contacts__content__contacts__item__header'>
                <div className='contactsWrapper__contacts__content__contacts__item__header__name'>
                    <input onChange={_onInputChange} placeholder={tc.addName} ref={contactNameInputRef} type='text' value={(contactObj.name) ? contactObj.name : ''}/>
                </div>
            </div>
            <div className='contactsWrapper__contacts__content__contacts__item__content'>
                <div className='contactsWrapper__contacts__content__contacts__item__content__row'>
                    <div className='contactsWrapper__contacts__content__contacts__item__content__row__right'>
                        {(contactObj.tele && contactObj.tele.length) ? contactObj.tele.map((num, i) => {
                            return (<input key={i} onChange={_onInputChange} placeholder={tc.addPhone} ref={(el) => (contactPhoneInputRefs.current[i] = el)} type='text' value={num}/>);
                        }) : null}
                        <div className='contactsWrapper__contacts__content__contacts__item__content__row__right__addField' onClick={() => {
                            setContactObj({
                                ...contactObj,
                                tele: (Array.isArray(contactObj.tele)) ? contactObj.tele.concat(['']) : [''],
                            })
                        }}>
                            <Icon val='add'/>
                        </div>
                    </div>
                </div>
                <div className='contactsWrapper__contacts__content__contacts__item__content__row'>
                    <div className='contactsWrapper__contacts__content__contacts__item__content__row__right'>
                        {(contactObj.email && contactObj.email.length) ? contactObj.email.map((num, i) => {
                            return (<input key={i} onChange={_onInputChange} placeholder={tc.addEmail} ref={(el) => (contactEmailInputRefs.current[i] = el)} type='text' value={num}/>);
                        }) : null}
                        <div className='contactsWrapper__contacts__content__contacts__item__content__row__right__addField' onClick={() => {
                            setContactObj({
                                ...contactObj,
                                email: (Array.isArray(contactObj.email)) ? contactObj.email.concat(['']) : [''],
                            })
                        }}>
                            <Icon val='add'/>
                        </div>
                    </div>
                </div>
                <div className='contactsWrapper__contacts__content__contacts__item__content__row'>
                    <div className='contactsWrapper__contacts__content__contacts__item__content__row__right'>
                        <input onChange={_onInputChange} placeholder={tc.addDescription} ref={contactCommentInputRef} type='text' value={(contactObj.comment) ? contactObj.comment : ''}/>
                    </div>
                </div>
                <div className='contactsWrapper__contacts__content__contacts__item__content__row'>
                    <div className='contactsWrapper__contacts__content__contacts__item__content__row__right__entities'>
                        {(contactObj.savedTo && contactObj.savedTo.length) ? contactObj.savedTo.map((num, i) => {
                            let connection;
                            if (carHelper.isValidRegNumber(num.entityId)) {
                                connection = (num.entityName) ? num.entityName : num.entityId;
                            } else if (companyHelper.isValidOrgNr(num.entityId)) {
                                connection = (num.entityName) ? num.entityName : tc.company;
                            } else {
                                connection = tc.deal;
                            }
                            return (
                                <div className='contactsWrapper__contacts__content__contacts__item__content__row__right__entities__entity' key={i}>
                                    {connection}
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.removeEntityFromContact}>
                                        <Icon val='remove' onClick={() => {props.removeEntityFromContact({id: props.contact._id, entityId: num.entityId})}}/>
                                    </Tooltip>
                                    {(i === contactObj.savedTo.length - 1) ? '': ', '}
                                </div>
                            );
                        }) : null}
                    </div>
                </div>
                <div className='contactsWrapper__contacts__content__contacts__item__content__row'>
                    <div className='contactsWrapper__contacts__content__contacts__item__content__row__buttons'>
                        <Tooltip horizontalDirection='left' tooltipContent={tc.cancel}>
                            <Icon val='clear' onClick={() => {props.cancelEdit()}}/>
                        </Tooltip>
                        <Tooltip horizontalDirection='left' tooltipContent={tc.saveChanges}>
                            <Icon val='save' onClick={_saveChanges}/>
                        </Tooltip>
                        <Tooltip horizontalDirection='left' tooltipContent={tc.removeContact}>
                            <Icon val='remove' onClick={() => {props.removeContact(props.contact._id)}}/>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </div>
    );
}
