import React from 'react';
import {tc} from 'helpers';
import carHelper from 'shared_helpers/car_helper';
import companyHelper from 'shared_helpers/company_helper';
import Icon from 'components/shared/icon';
import Tooltip from 'components/shared/tooltip';

/**
 * Render a contact item in edit mode.
 *
 * @param props.cancelEdit
 * @param props.contact
 * @param props.removeContact
 * @param props.removeEntityFromContact
 * @param props.saveChanges
 */
export default (props) => {
    const _onInputChange = () => {
        console.log('_onInputChange');
    };

    /*
    refs are basiclly objects, and they have a default key current. So, you can create an array of refs like this:

const myRefs= useRef([]);
Then you can populate this array of refs like this:

ref={el => (myRefs.current[i] = el)}
Here is the full version:

{
  [1, 2, 3].map((v, i) => {
    return (
      <button
        ref={(el) => (myRefs.current[i] = el)}
        id={i}
        onClick={submitClick}
      >{`Button${i}`}</button>
    );
  });
}
     */

    return (
        <div className='contactsWrapper__contacts__content__contacts__item'>
            <div className='contactsWrapper__contacts__content__contacts__item__header'>
                <div className='contactsWrapper__contacts__content__contacts__item__header__left'>
                    <Icon val='contact'/>
                </div>
                <div className='contactsWrapper__contacts__content__contacts__item__header__right'>
                    <div className='contactsWrapper__contacts__content__contacts__item__header__right__name'>
                        <input onChange={_onInputChange} type='text' value={(props.contact.name) ? props.contact.name : ''}/>
                    </div>
                </div>
            </div>
            <div className='contactsWrapper__contacts__content__contacts__item__content'>
                <div className='contactsWrapper__contacts__content__contacts__item__content__row'>
                    <div className='contactsWrapper__contacts__content__contacts__item__content__row__left'>
                        {tc.phone}:
                    </div>
                    <div className='contactsWrapper__contacts__content__contacts__item__content__row__right'>
                        phone. plustecken för att lägga till
                    </div>
                </div>
                <div className='contactsWrapper__contacts__content__contacts__item__content__row'>
                    <div className='contactsWrapper__contacts__content__contacts__item__content__row__left'>
                        {tc.mail}:
                    </div>
                    <div className='contactsWrapper__contacts__content__contacts__item__content__row__right'>
                        email. plustecken för att lägga till.
                    </div>
                </div>
                <div className='contactsWrapper__contacts__content__contacts__item__content__row'>
                    <div className='contactsWrapper__contacts__content__contacts__item__content__row__left'>
                        {tc.comment}:
                    </div>
                    <div className='contactsWrapper__contacts__content__contacts__item__content__row__right'>
                        kommentar
                    </div>
                </div>
                <div className='contactsWrapper__contacts__content__contacts__item__content__row'>
                    <div className='contactsWrapper__contacts__content__contacts__item__content__row__left'>
                        {tc.connectedTo}:
                    </div>
                    <div className='contactsWrapper__contacts__content__contacts__item__content__row__right__entities'>
                        {(props.contact.savedTo && props.contact.savedTo.length) && props.contact.savedTo.map((num, i) => {
                            let connection;
                            if (carHelper.isValidRegNumber(num.entityId) || companyHelper.isValidOrgNr(num.entityId)) {
                                connection = num.entityName;
                            } else {
                                connection = tc.deal;
                            }
                            return (
                                <div className='contactsWrapper__contacts__content__contacts__item__content__row__right__entities__entity' key={i}>
                                    {connection}
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.removeEntityFromContact}><Icon val='remove' onClick={() => {props.removeEntityFromContact({id: props.contact._id, entityId: num.entityId})}}/></Tooltip>
                                    {(i === props.contact.savedTo.length - 1) ? '': ', '}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className='contactsWrapper__contacts__content__contacts__item__content__row'>
                    <div className='contactsWrapper__contacts__content__contacts__item__content__row__buttons'>
                        <Tooltip horizontalDirection='left' tooltipContent={tc.removeContact}><Icon val='remove' onClick={() => {props.removeContact(props.contact._id)}}/></Tooltip>
                        <Tooltip horizontalDirection='left' tooltipContent={tc.saveChanges}><Icon val='save' onClick={() => {props.saveChanges('kontaktobjekjtet ska skickas här')}}/></Tooltip>
                        <Tooltip horizontalDirection='left' tooltipContent={tc.cancel}><Icon val='clear' onClick={() => {props.cancelEdit()}}/></Tooltip>
                    </div>
                </div>
            </div>
        </div>
    );
}
