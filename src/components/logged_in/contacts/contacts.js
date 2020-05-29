import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {tc} from 'helpers';
import carHelper from 'shared_helpers/car_helper';
import companyHelper from 'shared_helpers/company_helper';
import {addEntityToContacts, getContacts, removeContact, removeEntityFromContact, saveNewContact, updateContact} from 'store/contacts/tasks';
import ContactItem from './contact_item';
import ContactCreateItem from './contact_create_item';
import ContactEditItem from './contact_edit_item';
import Icon from 'components/shared/icon';
import Loading from 'components/shared/loading';
import Search from 'components/logged_in/search';
import Tooltip from 'components/shared/tooltip';
import WidgetHeader from 'components/shared/widget_header';

/**
 * Render contacts for an entityId (can be deal id, car reg number or company org number).
 *
 * Example, using this component on /foretag/id: <Contacts entityId='5566448899' entityName='Company name' entityType='company'/>
 * Example, using this component on /car/regNum: <Contacts companyId='5566889944' entityId='abc123' entityType='car'/>
 * Example, using this component on /deal/id: <Contacts entityId='5ea98dae085c6bbfa842e860' entityType='deal'/>
 *
 * @param state.props.companyId - string - When props.entityType === 'car' this should be provided, this is the user id for the car.
 * @param state.props.entityId - string - Always provided.
 * @param state.props.entityName - string - Wen props.entityType === 'company' this should be provided as company name. When props.entityType === 'car', this should be provided as 'brand  model (regnum)'.
 * @param state.props.entityType - string - Always provided. 'car'/ 'company' / 'deal'
 */
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

        return await addEntityToContacts({contacts: state.search.selectedContacts, entityId: state.props.entityId, entityType: state.props.entityType});
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

    useEffect(() => {
        getContacts({entityId: state.props.entityId});
    }, [state.props.entityId]);

    useEffect(() => {
        /**
         * Set contact rows to render.
         */
        const _renderContacts = () => {
            let data = state.contacts.contacts;

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
            data = state.contacts.contacts.slice(0, showAmount);

            let rows = [];

            if (createContact) {
                rows.push(
                    <React.Fragment key={data.length + 1}>
                        <ContactCreateItem cancelCreate={() => {setCreateContact(false)}} saveContact={_saveNewContact}/>
                    </React.Fragment>
                );
            }

            rows = rows.concat(data.map((num, i) => {
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
            }));

            setContactRows(rows);
        };

        /**
         * Save new contact from form.
         */
        const _saveNewContact = async (contact) => {
            setCreateContact(false);
            setEditContact(null);

            // Add current entity to the new contact.
            if (carHelper.isValidRegNumber(state.props.entityId)) {
                contact.savedTo = [{
                    companyId: state.props.companyId,
                    entityId: state.props.entityId,
                    entityName: (state.props.entityName) ? state.props.entityName : state.props.entityId,
                    entityType: state.props.entityType,
                }];
            } else if (companyHelper.isValidOrgNr(state.props.entityId)) {
                contact.savedTo = [{
                    companyId: state.props.entityId,
                    entityId: state.props.entityId,
                    entityName: state.props.entityName,
                    entityType: state.props.entityType,
                }];
            } else {
                contact.savedTo = [{
                    entityId: state.props.entityId,
                    entityType: state.props.entityType,
                }];
            }

            return await saveNewContact(contact);
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
                                    {!createContact && <Tooltip horizontalDirection='left' tooltipContent={tc.createNewContact}><Icon val='add' onClick={() => {setCreateContact(true)}}/></Tooltip>}
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

