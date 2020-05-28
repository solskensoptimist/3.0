import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {tc} from 'helpers';
import {addEntityToContacts, getContacts, removeContact, removeEntityFromContact, saveNewContact, updateContact} from 'store/contacts/tasks';
import ContactItem from './contact_item';
import ContactEditItem from './contact_edit_item';
import Icon from 'components/shared/icon';
import Loading from 'components/shared/loading';
import Search from 'components/logged_in/search';
import Tooltip from 'components/shared/tooltip';
import WidgetHeader from 'components/shared/widget_header';

const Contacts = (state) => {
    const amountIncrease = 6;
    const [dataLength, setDataLength] = useState(null); // Used to know when we have rendered all rows.
    const [contactRows, setContactRows] = useState(null); // Holds JSX content.
    const [editContact, setEditContact] = useState(null); // Id for contact being edited.
    const [showAddContacts, setShowAddContacts] = useState(true);
    const [showAmount, setShowAmount] = useState(amountIncrease);
    const [createContact, setCreateContact] = useState(false);
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

    /**
     * Completely remove a contact.
     */
    const _removeContact = async (id) => {
        return await removeContact({id: id});
    };

    /**
     * Remove an entity from a contact.
     */
    const _removeEntityFromContact = async (payload) => {
        return await removeEntityFromContact({id: payload.id, entityId: payload.entityId});
    };

    /**
     * Save changes for contact that is being edited.
     */
    const _updateContact = async (contact) => {
        setCreateContact(false);
        setEditContact(null);
        return await updateContact({id: contact._id, data: contact});
    };

    /**
     * Start create a new contact.
     */
    const _startCreateContact = () => {
        setCreateContact(true);
    };

    useEffect(() => {
        getContacts({entityId: state.props.entityId});
    }, [state.props.entityId]);

    useEffect(() => {
        /**
         * Save new contact from form.
         */
        const _saveNewContact = async (contact) => {
            console.log('_saveNewContact', contact);
            setCreateContact(false);
            setEditContact(null);
            // payload.type = state.props.type;
            // return await saveNewContact({});
        };

        /**
         * Set contact rows to render.
         */
        const _renderContacts = () => {
            const data = state.contacts.contacts;

            // If no data, minimize widget.
            if (!data || (data && data.length === 0)) {
                setContactRows(<p className='marginTop'>{tc.noContacts}</p>);
                return setMinimize(true);
            } else {
                setMinimize(false);
            }

            // Set data length before slice.
            setDataLength(data.length);

            // Show more rows every time user click load icon.
            // const data = state.contacts.contacts.slice(0, showAmount);

            const rows = data.map((num, i) => {
                if (editContact=== num._id) {
                    return (
                        <React.Fragment key={i}>
                            <ContactEditItem cancelEdit={() => {setEditContact(null)}} contact={num} removeContact={_removeContact} removeEntityFromContact={_removeEntityFromContact} saveChanges={_updateContact}/>
                        </React.Fragment>
                    );
                } else {
                    return (
                        <React.Fragment key={i}>
                            <ContactItem contact={num} editContact={() => {setEditContact(num._id)}}/>
                        </React.Fragment>
                    );
                }
            });

            if (createContact) {
                rows.push(
                    <React.Fragment key={data.length + 1}>
                        {_renderCreateContactItem()}
                    </React.Fragment>
                );
            }

            setContactRows(rows);
        };

        /**
         * Render a form to create a new contact.
         */
        const _renderCreateContactItem = () => {
            return (
                <div className='contactsWrapper__contacts__content__contacts__item'>
                    <Tooltip horizontalDirection='left' tooltipContent={tc.cancel}><Icon val='clear' onClick={() => {setCreateContact(false)}}/></Tooltip>
                    <Tooltip horizontalDirection='left' tooltipContent={tc.saveContact}><Icon val='save' onClick={async () => {return await _saveNewContact()}}/></Tooltip>
                </div>
            );
        };

        _renderContacts();
    }, [createContact, editContact, showAmount, state.contacts.contacts]);

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
                                    {!createContact && <Tooltip horizontalDirection='left' tooltipContent={tc.createNewContact}><Icon val='add' onClick={() => {_startCreateContact()}}/></Tooltip>}
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

