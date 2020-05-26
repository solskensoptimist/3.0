import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {tc} from 'helpers';
import carHelper from 'shared_helpers/car_helper';
import companyHelper from 'shared_helpers/company_helper';
import {NavLink} from 'react-router-dom';
import {addEntityToContacts, getContacts, removeContact, removeEntityFromContact, saveNewContact} from 'store/contacts/tasks';
import Icon from 'components/shared/icon';
import Loading from 'components/shared/loading';
import Search from 'components/logged_in/search';
import Tooltip from 'components/shared/tooltip';
import WidgetHeader from 'components/shared/widget_header';

const Contacts = (state) => {
    const amountIncrease = 6;
    const [dataLength, setDataLength] = useState(null); // Used to know when we have rendered all rows.
    const [contactRows, setContactRows] = useState(null); // Holds JSX content.
    const [editRow, setEditRow] = useState(null); // Id for row being edited.
    const [showAddContacts, setShowAddContacts] = useState(true);
    const [showAmount, setShowAmount] = useState(amountIncrease);
    const [showCreateContact, setShowCreateContact] = useState(false);
    const [minimize, setMinimize] = useState(false);

    /**
     * Add current entity to contacts selected in search box.
     */
    const _addEntityToContacts = async () => {
        if (!state.search.selectedContacts || !state.search.selectedContacts.length) {
            return;
        }

        return await addEntityToContacts({contacts: state.search.selectedContacts, entityId: state.props.entityId, type: state.props.type});
    };

    const _stateCheck = () => {
        return !!(state && state.contacts && state.contacts && state.contacts.contacts);
    };

    useEffect(() => {
        getContacts({entityId: state.props.entityId});
    }, [state.props.entityId]);

    useEffect(() => {
        /**
         * Cancel create new contact, empty all fields.
         */
        const _cancelCreateContact = () => {
            // Töm inputfält...
            setShowCreateContact(false)
        };

        /**
         * Completely remove a contact.
         */
        const _removeContact = async (id) => {
            return await removeContact({id: id});
        };

        /**
         * Remove current entity from a contact.
         */
        const _removeEntityFromContact = async (payload) => {
            return await removeEntityFromContact({id: payload.id, entityId: payload.entityId});
        };

        /**
         * Save changes for contact that is being edited.
         */
        const _saveEditContact = async () => {
            console.log('Save edit contact');
            // payload.type = state.props.type;
            // Hämta data från state typ.. input fields...
            // return await saveNewContact({});
            // Töm alla editfält i state...
        };

        /**
         * Save new contact from form.
         */
        const _saveNewContact = async () => {
            console.log('Save new contact');
            // payload.type = state.props.type;
            // Hämta data från state typ.. input fields...
            // return await saveNewContact({});
            _cancelCreateContact();
        };

        /**
         * Set contact rows to render.
         */
        const _renderContacts = () => {
            const data = state.contacts.contacts;

            // if no data, minimize widget.
            if (!data || (data && data.length === 0)) {
                setContactRows(<p className='marginTop'>{tc.noContacts}</p>);
                return setMinimize(true);
            }

            // Set data length before slice.
            setDataLength(data.length);

            // Show more rows every time user click load icon.
            // const data = state.contacts.contacts.slice(0, showAmount);

            const rows = data.map((num, i) => {
                if (editRow=== num._id) {
                    return (
                        <React.Fragment key={i}>
                            {_renderEditContactItem(num)}
                        </React.Fragment>
                    );
                } else {
                    return (
                        <React.Fragment key={i}>
                            {_renderContactItem(num)}
                        </React.Fragment>
                    );
                }
            });

            if (showCreateContact) {
                rows.push(
                    <React.Fragment key={data.length + 1}>
                        {_renderCreateContactItem()}
                    </React.Fragment>
                );
            }

            setContactRows(rows);
        };

        /**
         * Render a contact item.
         */
        const _renderContactItem = (contact) => {
            return (
                <div className='contactsWrapper__contacts__content__contacts__item'>
                    <div className='contactsWrapper__contacts__content__contacts__item__header'>
                        <div className='contactsWrapper__contacts__content__contacts__item__header__left'>
                            {contact.name}
                        </div>
                        <div className='contactsWrapper__contacts__content__contacts__item__header__right'>
                            {(!editRow) && <Tooltip horizontalDirection='left' tooltipContent={tc.editContact}><Icon val='edit' onClick={() => {if (!editRow) {setEditRow(contact._id)}}}/></Tooltip>}
                        </div>
                    </div>
                    <div className='contactsWrapper__contacts__content__contacts__item__content'>
                        <div className='contactsWrapper__contacts__content__contacts__item__content__item'>
                            <div className='contactsWrapper__contacts__content__contacts__item__content__item__left'>
                                <Icon val='description'/>
                            </div>
                            <div className='contactsWrapper__contacts__content__contacts__item__content__item__right'>
                                {contact.comment}
                            </div>
                        </div>
                        <div className='contactsWrapper__contacts__content__contacts__item__content__item'>
                            <div className='contactsWrapper__contacts__content__contacts__item__content__item__left'>
                                <Icon val='call'/>
                            </div>
                            <div className='contactsWrapper__contacts__content__contacts__item__content__item__right'>
                                {contact.tele.map((num, i) => <p key={i}>{num}</p>)}
                            </div>
                        </div>
                        <div className='contactsWrapper__contacts__content__contacts__item__content__item'>
                            <div className='contactsWrapper__contacts__content__contacts__item__content__item__left'>
                                <Icon val='mail'/>
                            </div>
                            <div className='contactsWrapper__contacts__content__contacts__item__content__item__right'>
                                {contact.email.map((num, i) => <p key={i}>{num}</p>)}
                            </div>
                        </div>
                    </div>
                </div>
            );
        };

        /**
         * Render a contact item to edit.
         */
        const _renderEditContactItem = (contact) => {
            return (
                <div className='contactsWrapper__contacts__content__contacts__item'>
                    <div className='contactsWrapper__contacts__content__contacts__item__header'>
                        header
                    </div>
                    <div className='contactsWrapper__contacts__content__contacts__item__content'>
                        Editera kontakt här
                        <Tooltip horizontalDirection='left' tooltipContent={tc.cancel}><Icon val='clear' onClick={() => {setEditRow(null)}}/></Tooltip>
                        <Tooltip horizontalDirection='left' tooltipContent={tc.removeContact}><Icon val='remove' onClick={async () => {return await _removeContact(contact._id)}}/></Tooltip>
                        <Tooltip horizontalDirection='left' tooltipContent={tc.saveContact}><Icon val='save' onClick={async () => {return await _saveEditContact()}}/></Tooltip>
                        <div className='contactsWrapper__contacts__content__contacts__item__content__entities'>
                            <div className='contactsWrapper__contacts__content__contacts__item__content__entities__header'>
                                <h5>{tc.contactConnections}:</h5>
                            </div>
                            <div className='contactsWrapper__contacts__content__contacts__item__content__entities__content'>
                                {(contact.savedTo && contact.savedTo.length) && contact.savedTo.map((num, i) => {
                                    let link;
                                    if (carHelper.isValidRegNumber(num.entityId)) {
                                         link = <NavLink exact to={'/bil/' + num.entityId} key={i}>{num.entityName}</NavLink>;
                                    } else if (companyHelper.isValidOrgNr(num.entityId)) {
                                        link = <NavLink exact to={'/foretag/' + num.entityId} key={i}>{num.entityName}</NavLink>;
                                    } else {
                                        link = <NavLink exact to={'/deal/' + num.entityId} key={i}>{tc.deal}</NavLink>;
                                    }
                                    return (
                                        <div className='contactsWrapper__contacts__content__contacts__item__content__entities__content__entity' key={i}>
                                            {link}
                                            <Tooltip horizontalDirection='left' tooltipContent={tc.removeEntityFromContact}><Icon val='clear' onClick={async () => {return await _removeEntityFromContact({id: contact._id, entityId: num.entityId})}}/></Tooltip>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            );
        };

        /**
         * Render a form to create a new contact.
         */
        const _renderCreateContactItem = () => {
            return (
                <div className='contactsWrapper__contacts__content__contacts__item'>
                    <Tooltip horizontalDirection='left' tooltipContent={tc.cancel}><Icon val='clear' onClick={() => {_cancelCreateContact()}}/></Tooltip>
                    <Tooltip horizontalDirection='left' tooltipContent={tc.saveContact}><Icon val='save' onClick={async () => {return await _saveNewContact()}}/></Tooltip>
                </div>
            );
        };

        _renderContacts();
    }, [showCreateContact, editRow, showAmount, state.contacts.contacts]);

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
                                    {!showCreateContact && <Tooltip horizontalDirection='left' tooltipContent={tc.createNewContact}><Icon val='add' onClick={() => {setShowCreateContact(true)}}/></Tooltip>}
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
                        <Search type='contacts' save={_addEntityToContacts}/>
                    </div>
                    }
                    <div className='contactsWrapper__contacts__content__contacts'>
                        {contactRows}
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

