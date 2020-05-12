import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {tc} from 'helpers';
import {addTargetToContacts, getContacts, removeContact, removeTargetFromContact, saveNewContact} from 'store/contacts/tasks';
import Icon from 'components/shared/icon';
import Loading from 'components/shared/loading';
import Search from 'components/logged_in/search';
import Tooltip from 'components/shared/tooltip';
import WidgetHeader from 'components/shared/widget_header';

const Contacts = (state) => {
    const amountIncrease = 6;
    const [showAddContacts, setShowAddContacts] = useState(true);
    const [showAmount, setShowAmount] = useState(amountIncrease);
    const [minimize, setMinimize] = useState(false);

    const _addTargetToContacts = async () => {
        const ids = state.search.selectedContacts.map((num) => num.id.toString());
        return await addTargetToContacts({ids: ids, target: state.props.target});
    };

    const _removeContact = async (id) => {
        return await removeContact({id: id});
    };

    const _removeTargetFromContact = async (payload) => {
        return await removeTargetFromContact({id: payload.id, target: payload.target});
    };

    const _saveNewContact = async (payload) => {
        return await saveNewContact(payload);
    };

    const _renderContacts = () => {
        // Show more rows every time user click load icon.
        const data = state.contacts.contacts.slice(0, showAmount);

        if (data.length) {
            return data.map((num, i) => {
                return (
                    <React.Fragment key={i}>
                        {_renderContactItem(num)}
                    </React.Fragment>
                );
            });
        } else {
            return <p className='marginTop'>{tc.noContacts}</p>;
        }
    };

    const _renderContactItem = (contact) => {
        return (
            <div className='contactsWrapper__contacts__content__contacts__item'>
                <div className='contactsWrapper__contacts__content__pcontacts__item__icon'>
                    <Icon val='contact'/>
                </div>
                {/*<div className='contactsWrapper__contacts__content__contacts__item__icon__visible'><Tooltip horizontalDirection='left' tooltipContent={tc.removeContact}><Icon val='remove' onClick={async () => {return await _removeContact(contact._id)}}/></Tooltip></div>*/}
                    <div className='contactsWrapper__contacts__content__contacts__item__infoHolder'>
                        <div className='contactsWrapper__contacts__content__contacts__item__infoHolder__info'>
                            <div className='contactsWrapper__contacts__content__contacts__item__infoHolder__info__name'>{contact.name}</div>
                            <div className='contactsWrapper__contacts__content__contacts_item__infoHolder__info__name'>{contact.name}</div>
                        </div>
                        <p>En lista för varje affär som kontakten ingår i, med krysstecken, som är kopplad till removeTargetFromContact</p>
                    </div>
            </div>
        );
    };

    const _stateCheck = () => {
        return !!(state && state.contacts && state.contacts && state.contacts.contacts);
    };

    useEffect(async () => {
        await getContacts({target: state.props.target});
    }, [state.props.target]);

    return ( _stateCheck() ?
        <div className='contactsWrapper'>
            <div className='contactsWrapper__contacts'>
                <div className='contactsWrapper__contacts__header'>
                    <WidgetHeader
                        iconVal='contact'
                        dashboard={
                            <>
                                {showAddContacts ?
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.hideConnectContacts}><Icon val='linkOff' onClick={() => {setShowAddContacts(false)}}/></Tooltip> :
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.connectContacts}><Icon val='link' onClick={() => {setShowAddContacts(true)}}/></Tooltip>
                                }
                                <Tooltip horizontalDirection='left' tooltipContent={tc.load}><Icon val='load' onClick={() => {setShowAmount(showAmount + amountIncrease)}}/></Tooltip>
                                {(showAmount > amountIncrease) && <Tooltip horizontalDirection='left' tooltipContent={tc.regret}><Icon val='regret' onClick={() => {setShowAmount(amountIncrease)}}/></Tooltip>}
                                {minimize ?
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.maximize}><Icon val='maximize' onClick={() => {setMinimize(false)}}/></Tooltip> :
                                    <Tooltip tooltipContent={tc.minimize}><Icon val='minimize' onClick={() => {setMinimize(true)}}/></Tooltip>
                                }
                            </>
                        }
                        headline={tc.contacts}
                        headlineSub={tc.handleContacts}
                    />
                </div>
                {!minimize &&
                <div className='contactsWrapper__contacts__content'>
                    {showAddContacts &&
                    <div className='contactsWrapper__contacts__search'>
                        <Search type='contacts' save={_addTargetToContacts}/>
                    </div>
                    }
                    <div className='contactsWrapper__contacts__content__contacts'>
                        {_renderContacts()}
                        <p>Man ska kunna redigera varje fält i kontakten.</p>
                        <p>Och det ska finnas en lista med varje affär/prospekt där kontakten ingår, man ska kunna ta bort dessa.</p>
                    </div>
                </div>
                }
            </div>
        </div> :
        <Loading/>
    );
};

const MapStateToProps = (state, props) => {
    return {
        contacts: state.contacts,
        props: props,
        search: state.search,
    };
};

export default connect(
    MapStateToProps,
)(Contacts);

