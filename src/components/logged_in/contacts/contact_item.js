import React from 'react';
import {tc} from 'helpers';
import carHelper from 'shared_helpers/car_helper';
import companyHelper from 'shared_helpers/company_helper';
import {NavLink} from 'react-router-dom';
import Icon from 'components/shared/icon';
import Tooltip from 'components/shared/tooltip';

/**
 * Render a contact item.
 * @param props.contact
 * @param props.editContact
 */
export default (props) => {
    return(
        <div className='contactsWrapper__contacts__content__contacts__item'>
            <div className='contactsWrapper__contacts__content__contacts__item__header'>
                <div className='contactsWrapper__contacts__content__contacts__item__header__left'>
                    <Icon val='contact'/>
                </div>
                <div className='contactsWrapper__contacts__content__contacts__item__header__right'>
                    <div className='contactsWrapper__contacts__content__contacts__item__header__right__name'>
                        {props.contact.name}
                    </div>
                    <div className='contactsWrapper__contacts__content__contacts__item__header__right__icon'>
                        <Tooltip horizontalDirection='left' tooltipContent={tc.editContact}><Icon val='edit' onClick={() => {props.editContact(props.contact._id)}}/></Tooltip>
                    </div>
                </div>
            </div>
            <div className='contactsWrapper__contacts__content__contacts__item__content'>
                <div className='contactsWrapper__contacts__content__contacts__item__content__row'>
                    <div className='contactsWrapper__contacts__content__contacts__item__content__row__left'>
                        {tc.phone}:
                    </div>
                    <div className='contactsWrapper__contacts__content__contacts__item__content__row__right'>
                        {(props.contact.tele && props.contact.tele.length) ? props.contact.tele.map((num, i) => <p key={i}>{num}</p>) : <p className='italic'>{tc.dataMissing}</p>}
                    </div>
                </div>
                <div className='contactsWrapper__contacts__content__contacts__item__content__row'>
                    <div className='contactsWrapper__contacts__content__contacts__item__content__row__left'>
                        {tc.mail}:
                    </div>
                    <div className='contactsWrapper__contacts__content__contacts__item__content__row__right'>
                        {(props.contact.email && props.contact.email.length) ? props.contact.email.map((num, i) => <p key={i}>{num}</p>) : <p className='italic'>{tc.dataMissing}</p>}
                    </div>
                </div>
                <div className='contactsWrapper__contacts__content__contacts__item__content__row'>
                    <div className='contactsWrapper__contacts__content__contacts__item__content__row__left'>
                        {tc.comment}:
                    </div>
                    <div className='contactsWrapper__contacts__content__contacts__item__content__row__right'>
                        {(props.contact.comment) ? <p>{props.contact.comment}</p> : <p className='italic'>{tc.dataMissing}</p>}
                    </div>
                </div>
                <div className='contactsWrapper__contacts__content__contacts__item__content__row'>
                    <div className='contactsWrapper__contacts__content__contacts__item__content__row__left'>
                        {tc.connectedTo}:
                    </div>
                    <div className='contactsWrapper__contacts__content__contacts__item__content__row__right__entities'>
                        {(props.contact.savedTo && props.contact.savedTo.length) && props.contact.savedTo.map((num, i) => {
                            let link;
                            if (carHelper.isValidRegNumber(num.entityId)) {
                                link = <NavLink exact to={'/bil/' + num.entityId} key={i}>{(num.entityName) ? num.entityName : num.entityId}</NavLink>;
                            } else if (companyHelper.isValidOrgNr(num.entityId)) {
                                link = <NavLink exact to={'/foretag/' + num.entityId} key={i}>{(num.entityName) ? num.entityName : tc.company}</NavLink>;
                            } else {
                                link = <NavLink exact to={'/affar/' + num.entityId} key={i}>{tc.deal}</NavLink>;
                            }
                            return (
                                <div className='contactsWrapper__contacts__content__contacts__item__content__row__right__entities__entity' key={i}>
                                    {link}{(i === props.contact.savedTo.length - 1) ? '' : ', '}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
