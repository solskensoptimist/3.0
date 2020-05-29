import React, {useRef, useState} from 'react';
import {tc} from 'helpers';
import Icon from 'components/shared/icon';
import Tooltip from 'components/shared/tooltip';

/**
 * Render a form to create contact.
 *
 * @param props.cancelCreate
 * @param props.saveContact
 */
export default (props) => {
    const [contactObj, setContactObj] = useState({email: [''], tele: ['']});
    const contactCreateCommentInputRef = useRef(null);
    const contactCreateEmailInputRefs = useRef([]);
    const contactCreateNameInputRef = useRef(null);
    const contactCreatePhoneInputRefs = useRef([]);

    const _onInputChange = () => {
        setContactObj({
            ...contactObj,
            comment: contactCreateCommentInputRef.current.value,
            email: contactCreateEmailInputRefs.current.map((num) => num.value),
            name: contactCreateNameInputRef.current.value,
            tele: contactCreatePhoneInputRefs.current.map((num) => num.value),
        });
    };

    const _saveContact = () => {
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

        props.saveContact(contact);
    };

    return (
        <div className='contactsWrapper__contacts__content__contacts__item'>
            <div className='contactsWrapper__contacts__content__contacts__item__header'>
                <div className='contactsWrapper__contacts__content__contacts__item__header__name'>
                    <input onChange={_onInputChange} placeholder={tc.addName} ref={contactCreateNameInputRef} type='text' value={(contactObj.name) ? contactObj.name : ''}/>
                </div>
            </div>
            <div className='contactsWrapper__contacts__content__contacts__item__content'>
                <div className='contactsWrapper__contacts__content__contacts__item__content__row'>
                    <div className='contactsWrapper__contacts__content__contacts__item__content__row__right'>
                        {(contactObj.tele && contactObj.tele.length) ? contactObj.tele.map((num, i) => {
                            return (<input key={i} onChange={_onInputChange} placeholder={tc.addPhone} ref={(el) => (contactCreatePhoneInputRefs.current[i] = el)} type='text' value={num}/>);
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
                            return (<input key={i} onChange={_onInputChange} placeholder={tc.addEmail} ref={(el) => (contactCreateEmailInputRefs.current[i] = el)} type='text' value={num}/>);
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
                        <input onChange={_onInputChange} placeholder={tc.addDescription} ref={contactCreateCommentInputRef} type='text' value={(contactObj.comment) ? contactObj.comment : ''}/>
                    </div>
                </div>
                <div className='contactsWrapper__contacts__content__contacts__item__content__row'>
                    <div className='contactsWrapper__contacts__content__contacts__item__content__row__buttons'>
                        <Tooltip horizontalDirection='left' tooltipContent={tc.cancel}>
                            <Icon val='clear' onClick={() => {props.cancelCreate()}}/>
                        </Tooltip>
                        <Tooltip horizontalDirection='left' tooltipContent={tc.saveContact}>
                            <Icon val='save' onClick={_saveContact}/>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </div>
    );
}
