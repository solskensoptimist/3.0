import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {tc} from 'helpers';
// import {addTargetToContacts, getContacts, removeContact, removeTargetFromContact, saveNewContact} from 'store/contacts/tasks';
import {getContacts} from 'store/contacts/tasks';
import Icon from 'components/shared/icon';
import Loading from 'components/shared/loading';
import Search from 'components/logged_in/search';
import Tooltip from 'components/shared/tooltip';
import WidgetHeader from 'components/shared/widget_header';

const Contacts = (state) => {
    const amountIncrease = 6;
    const [dataLength, setDataLength] = useState(null); // Used to know when we have rendered all rows.
    const [contactRows, setContactRows] = useState(null); // Holds JSX content.
    const [showAddContacts, setShowAddContacts] = useState(true);
    const [showAmount, setShowAmount] = useState(amountIncrease);
    const [minimize, setMinimize] = useState(false);

    const _addTargetToContacts = async () => {
        // const ids = state.search.selectedContacts.map((num) => num.id.toString());
        console.log('_addTargetToContacts');
        // return await addTargetToContacts({ids: ids, target: state.props.target});
    };
    //
    // const _removeContact = async (id) => {
    //     return await removeContact({id: id});
    // };
    //
    // const _removeTargetFromContact = async (payload) => {
    //     return await removeTargetFromContact({id: payload.id, target: payload.target});
    // };
    //
    // const _saveNewContact = async (payload) => {
    //     return await saveNewContact(payload);
    // };

    const _stateCheck = () => {
        return !!(state && state.contacts && state.contacts && state.contacts.contacts);
    };

    useEffect(() => {
        getContacts({target: state.props.target});
    }, [state.props.target]);

    useEffect(() => {
        const _renderContacts = () => {
            // Hämta data i state.contacts.contacts..?
            const data = [
                {
                    name: 'Kontaktnamn Kontakt'
                },
                {
                    name: 'Kontaktnamn Kontakt'
                },
                {
                    name: 'Kontaktnamn Kontakt'
                },
                {
                    name: 'Kontaktnamn Kontakt'
                }
            ];

            // if no data, minimize widget.
            if (data.length === 0) {
                setContactRows(<p className='marginTop'>{tc.noContacts}</p>);
                return setMinimize(true);
            }

            // Set data length before slice.
            setDataLength(data.length);

            // Show more rows every time user click load icon.
            // const data = state.contacts.contacts.slice(0, showAmount);

            setContactRows(data.map((num, i) => {
                return (
                    <React.Fragment key={i}>
                        {_renderContactItem(num)}
                    </React.Fragment>
                );
            }));
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
                    </div>
                </div>
            );
        };

        _renderContacts();
    }, [showAmount, state.contacts.contacts]);

    return ( _stateCheck() ?
        <div className='contactsWrapper'>
            <div className='contactsWrapper__contacts'>
                <div className='contactsWrapper__contacts__header'>
                    <WidgetHeader
                        iconVal='contact'
                        dashboard={
                            minimize ?
                                <>
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.maximize}><Icon val='maximize' onClick={() => {setMinimize(false)}}/></Tooltip>
                                </> :
                                <>
                                    <Tooltip horizontalDirection='left' tooltipContent={showAddContacts ? tc.hideConnectContacts : tc.connectContacts}><Icon active={showAddContacts} val='link' onClick={() => {setShowAddContacts(!showAddContacts)}}/></Tooltip>
                                    {(showAmount > amountIncrease) && <Tooltip horizontalDirection='left' tooltipContent={tc.regret}><Icon val='regret' onClick={() => {setShowAmount(amountIncrease)}}/></Tooltip>}
                                    {(showAmount < dataLength) && <Tooltip horizontalDirection='left' tooltipContent={tc.load}><Icon val='load' onClick={() => {setShowAmount(showAmount + amountIncrease)}}/></Tooltip>}
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.minimize}><Icon val='minimize' onClick={() => {setMinimize(true)}}/></Tooltip>
                                </>
                        }
                        headline={tc.contacts}
                        headlineSub={tc.handleContacts}
                    />
                </div>
                {!minimize &&
                <div className='contactsWrapper__contacts__content'>
                    {showAddContacts &&
                    <div className='contactsWrapper__contacts__content__search'>
                        <Search type='contacts' save={_addTargetToContacts}/>
                    </div>
                    }
                    <div className='contactsWrapper__contacts__content__contacts'>
                        {contactRows}
                        <p>Man ska kunna redigera varje fält i kontakten.</p>
                        <p>Och det ska finnas en lista med varje affär/prospekt där kontakten ingår, man ska kunna ta bort dessa.</p>
                        <p>En lista för varje affär som kontakten ingår i, med krysstecken, som är kopplad till removeTargetFromContact</p>
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

