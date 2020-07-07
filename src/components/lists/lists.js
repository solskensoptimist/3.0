import React, {useEffect, useRef, useState} from 'react';
import {archiveLists, createListSubscription, getLists, getListsSubscriptions, mergeLists, removeLists, removeListsSubscriptions, shareLists, splitList, undoArchive} from 'store/lists/tasks';
import {showFlashMessage} from 'store/flash_messages/tasks';
import {connect} from 'react-redux';
import {tableHelper, tc} from 'helpers';
import {Table} from 'components/table';
import Icon from 'components/icon';
import InfoBox from 'components/info_box';
import Loading from 'components/loading';
import Menu from 'components/menu';
import Popup from 'components/popup';
import ShareLists from './share_lists';
import SplitList from './split_list';
import WidgetHeader from 'components/widget_header';
import WidgetFooter from 'components/widget_footer';

const Lists = (state) => {
    const [listName, setListName] = useState('');
    const [activeContent, setActiveContent] = useState('listsRegular');
    const [activePopup, setActivePopup] = useState('');
    const [selectedLists, setSelectedLists] = useState([]);
    const [selectedSubscriptions, setSelectedSubscriptions] = useState([]);
    const [subscribeFlag, setSubscribeFlag] = useState(0);
    const mergeListsNameInputRef = useRef(null);

    const _archiveLists = async () => {
        await archiveLists({listIds: selectedLists.map((num) => num._id)});
        return setSelectedLists([]);
    };

    const _createListSubscription = async () => {
        setActivePopup('');
        await createListSubscription({
            listIds: selectedLists.map((num) => num._id),
            subscribeFlag: subscribeFlag
        });
        setSubscribeFlag(0);
        return setSelectedLists([]);
    };

    const _excelOutput = () => {
        console.log('Ladda ner excel');
    };

    const _mergeLists = async () => {
        if (listName.length) {
            setActivePopup('');
            await mergeLists({listIds: selectedLists.map((num) => num._id), name: listName});
            setSelectedLists([]);
            return setListName('');
        } else {
            return showFlashMessage(tc.nameCannotBeEmpty);
        }
    };

    const _recreateCriterias = (payload) => {
        if (payload.list) {
            console.log('Recreate criteria for list: ' + selectedLists[0].name);
        } else if (payload.subscription) {
            console.log('Recreate criteria for subscription: ' + selectedSubscriptions[0].prefix_name);
        }
    };

    const _removeLists = async () => {
        setActivePopup('');
        await removeLists({
            archived: (activeContent === 'listsArchived'),
            listIds: selectedLists.map((num) => num._id),
        });
        return setSelectedLists([]);
    };

    const _removeListsSubscriptions = async () => {
        setActivePopup('');
        await removeListsSubscriptions({ids: selectedSubscriptions.map((num) => num._id)});
        return setSelectedSubscriptions([]);
    };

    const _shareLists = async (userIds) => {
        setActivePopup('');
        await shareLists({
            listIds: selectedLists.map((num) => num._id),
            userIds: userIds,
        });
        return setSelectedLists([]);
    };

    const _splitList = async (splits) => {
        setActivePopup('');
        await splitList({
            listId: selectedLists[0]._id,
            splits: splits,
        });
        return setSelectedLists([]);
    };

    const _stateCheck = () => {
        return !!(state && state.lists && state.lists.lists !== null && state.lists.listsArchived !== null && state.lists.listsSubscriptions !== null);
    };

    const _toggleSubscribeFlagValue = (val) => {
        let flag = subscribeFlag;
        flag ^= val;

        // Check if 4 (phone) is set without 2 (name & address)
        if (flag & 4 && ~flag & 2) {
            flag ^= 4; // Turn 4 off.
        }

        setSubscribeFlag(flag);
    };

    const _undoArchive = async () => {
        setActivePopup('');
        await undoArchive({
            listIds: selectedLists.map((num) => num._id),
        });
        return setSelectedLists([]);
    };

    useEffect(() => {
        getLists({});
        getLists({archived: true});
        getListsSubscriptions();
    }, []);

    useEffect(() => {
        if (activePopup === 'mergeLists') {
            mergeListsNameInputRef && mergeListsNameInputRef.current && mergeListsNameInputRef.current.focus();
        }
    }, [activePopup]);

    return ( _stateCheck() ?
        <div className='listsWrapper'>
            <div className='listsWrapper__lists'>
                <div className='listsWrapper__lists__header'>
                    <Menu items={[
                            {
                                id: 1,
                                active: true,
                                label: tc.lists,
                                onClick: async () => {
                                    setSelectedLists([]);
                                    setActiveContent('listsRegular');
                                    await getLists({});
                                },
                                type: 'nav',
                                children: [
                                    {disabled: !(selectedLists.length), label: (selectedLists.length > 1) ? tc.archiveLists : tc.archiveList, onClick: _archiveLists, type: 'button'},
                                    {disabled: !(selectedLists.length), label: (selectedLists.length > 1) ? tc.shareLists : tc.shareList, onClick: () => {setActivePopup('shareLists')}, type: 'button'},
                                    {disabled: !(selectedLists.length && selectedLists.length === 1), label: tc.splitList, onClick: () => {setActivePopup('splitList')}, type: 'button'},
                                    {disabled: !(selectedLists.length), label: tc.excelOutput, onClick: _excelOutput, type: 'button'},
                                    {disabled: !(selectedLists.length), label: (selectedLists.length > 1) ? tc.removeLists : tc.removeList, onClick: () => {setActivePopup('removeLists')}, type: 'button'},
                                    {disabled: !(selectedLists.length && selectedLists.length > 1), label: tc.mergeLists, onClick: () => {setActivePopup('mergeLists')}, type: 'button'},
                                    {disabled: !(selectedLists.length && selectedLists.length === 1 && selectedLists[0].meta && selectedLists[0].meta.criterias && Object.keys(selectedLists[0].meta.criterias).length), label: tc.recreateCriterias, onClick: () => {_recreateCriterias({list: true})}, type: 'button'},
                                    {disabled: !(selectedLists.length && selectedLists.filter((list) => !(list.meta && ((list.meta.criterias && Object.keys(list.meta.criterias).length) || (list.meta.buttonFields && list.meta.buttonFields.length)))).length === 0), label: (selectedLists.length > 1) ? tc.createSubscriptions : tc.createSubscription, onClick: () => {setActivePopup('createListSubscription')}, type: 'button'},
                                ],
                            },
                            {
                                id: 2,
                                label: tc.archivedLists,
                                onClick: async () => {
                                    setSelectedLists([]);
                                    setActiveContent('listsArchived');
                                    await getLists({archived: true});
                                },
                                type: 'nav',
                                children: [
                                    {disabled: !(selectedLists.length), label: tc.undoArchive, onClick: _undoArchive, type: 'button'},
                                    {disabled: !(selectedLists.length), label: (selectedLists.length > 1) ? tc.removeLists : tc.removeList, onClick: () => {setActivePopup('removeLists')}, type: 'button'},
                                ],
                            },
                            {
                                id: 3,
                                label: tc.listsSubscriptions,
                                onClick: async () => {
                                    setSelectedLists([]);
                                    setActiveContent('listsSubscriptions');
                                    await getListsSubscriptions();
                                },
                                type: 'nav',
                                children: [
                                    {disabled: !(selectedSubscriptions.length), label: (selectedSubscriptions.length > 1) ? tc.removeSubscriptions : tc.removeSubscription, onClick: () => {setActivePopup('removeListsSubscriptions')}, type: 'button'},
                                    {disabled: !(selectedSubscriptions.length && selectedSubscriptions.length === 1), label: tc.recreateCriterias, onClick: () => {_recreateCriterias({subscription: true})}, type: 'button'},
                                ],
                            }
                        ]}
                    />
                </div>
                <div className='listsWrapper__lists__content'>
                    {(activeContent === 'listsRegular') ?
                        <div className='listsWrapper__lists__content__item'>
                            <div className='listsWrapper__lists__content__item__header'>
                                <WidgetHeader
                                    iconVal='lists'
                                    headline={tc.lists}
                                />
                            </div>
                            <div className='listsWrapper__lists__content__item__header__content'>
                                <Table
                                    columns={tableHelper.getListsColumns()}
                                    onSelect={(arr) => {setSelectedLists(state.lists.lists.filter((num) => arr.includes(num._id)))}}
                                    rows={tableHelper.getListsRows((state.lists.lists && state.lists.lists.length) ? state.lists.lists : [])}
                                    selected={selectedLists.map((num) => num._id)}
                                />
                            </div>
                        </div> : null
                    }
                    {(activeContent === 'listsArchived') ?
                        <div className='listsWrapper__lists__content__item'>
                            <div className='listsWrapper__lists__content__item__header'>
                                <WidgetHeader
                                    iconVal='lists'
                                    headline={tc.archivedLists}
                                />
                            </div>
                            <div className='listsWrapper__lists__content__item__header__content'>
                                <Table
                                    columns={tableHelper.getListsColumns()}
                                    onSelect={(arr) => {setSelectedLists(state.lists.listsArchived.filter((num) => arr.includes(num._id)))}}
                                    rows={tableHelper.getListsRows((state.lists.listsArchived && state.lists.listsArchived.length) ? state.lists.listsArchived : [])}
                                    selected={selectedLists.map((num) => num._id)}
                                />
                            </div>
                        </div> : null
                    }
                    {(activeContent === 'listsSubscriptions') ?
                        (state.lists.listsSubscriptions.length) ?
                        <div className='listsWrapper__lists__content__item'>
                            <div className='listsWrapper__lists__content__item__header'>
                                <WidgetHeader
                                    iconVal='subscription'
                                    headline={tc.listsSubscriptions}
                                />
                            </div>
                            <div className='listsWrapper__lists__content__item__header__content'>
                                <Table
                                    columns={tableHelper.getListsSubscriptionsColumns()}
                                    onSelect={(arr) => {setSelectedSubscriptions(state.lists.listsSubscriptions.filter((num) => arr.includes(num._id)))}}
                                    rows={tableHelper.getListsSubscriptionsRows((state.lists.listsSubscriptions && state.lists.listsSubscriptions.length) ? state.lists.listsSubscriptions : [])}
                                    selected={selectedSubscriptions.map((num) => num._id)}
                                />
                            </div>
                        </div> :
                        <InfoBox>
                            <h4>{tc.noListsSubscriptions}</h4>
                            <p>{tc.noListsSubscriptionsWhy1}</p>
                            <p>{tc.noListsSubscriptionsWhy2}</p>
                        </InfoBox>
                        : null
                    }
                    {(activePopup === 'createListSubscription') ?
                        <Popup close={() => {setActivePopup('')}} size='medium'>
                            <div className='listsPopupWrapper'>
                                <div className='listsPopupWrapper__listsPopup'>
                                    <div className='listsPopupWrapper__listsPopup__header'>
                                        <WidgetHeader
                                            iconVal='subscription'
                                            headline={(selectedLists.length > 1) ? tc.createSubscriptions : tc.createSubscription}
                                        />
                                    </div>
                                    <div className='listsPopupWrapper__listsPopup__content'>
                                        <div className='listsPopupWrapper__listsPopup__content__subscription'>
                                            <div className='listsPopupWrapper__listsPopup__content__subscription__info'>
                                                <p>{tc.listsSubscriptionsInfo1}</p>
                                                <p>{tc.listsSubscriptionsInfo2}</p>
                                            </div>
                                            <div className='listsPopupWrapper__listsPopup__content__subscription__options'>
                                                <div className={(subscribeFlag & 1) ?
                                                    'listsPopupWrapper__listsPopup__content__subscription__options__optionActive' :
                                                    'listsPopupWrapper__listsPopup__content__subscription__options__option'}
                                                     onClick={() => {_toggleSubscribeFlagValue(1)}}
                                                >
                                                        <Icon val='excludeProspects'/>
                                                        <h5>{tc.excludeProspects}</h5>
                                                        <p>{tc.excludeProspectsSubscriptionInfo}</p>
                                                </div>
                                                <div className={(subscribeFlag & 2) ?
                                                    'listsPopupWrapper__listsPopup__content__subscription__options__optionActive' :
                                                    'listsPopupWrapper__listsPopup__content__subscription__options__option'}
                                                     onClick={() => {_toggleSubscribeFlagValue(2)}}
                                                >
                                                    <Icon val='person'/>
                                                    <h5>{tc.nameAndAddress}</h5>
                                                    <p>{tc.nameAndAddressSubscriptionInfo}</p>
                                                </div>
                                                <div className={(subscribeFlag & 4) ?
                                                    'listsPopupWrapper__listsPopup__content__subscription__options__optionActive' :
                                                        (subscribeFlag & 2) ?
                                                            'listsPopupWrapper__listsPopup__content__subscription__options__option' :
                                                            'listsPopupWrapper__listsPopup__content__subscription__options__optionDisabled'}
                                                     onClick={() => {_toggleSubscribeFlagValue(4)}}
                                                >
                                                    <Icon val='phone'/>
                                                    <h5>{tc.phoneNumbers}</h5>
                                                    <p>{tc.phoneNumbersSubscriptionInfo}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='listsPopupWrapper__listsPopup__footer'>
                                        <WidgetFooter save={_createListSubscription} saveText={tc.create}/>
                                    </div>
                                </div>
                            </div>
                        </Popup> : null
                    }
                    {(activePopup === 'mergeLists') ?
                        <Popup close={() => {setActivePopup('')}} size='small'>
                            <div className='listsPopupWrapper'>
                                <div className='listsPopupWrapper__listsPopup'>
                                    <div className='listsPopupWrapper__listsPopup__header'>
                                        <WidgetHeader
                                            iconVal='merge'
                                            headline={tc.mergeLists}
                                        />
                                    </div>
                                    <div className='listsPopupWrapper__listsPopup__content'>
                                        <p className='noWrap'>{tc.nameNewList}:</p><input onChange={(e) => {setListName(e.target.value)}} ref={mergeListsNameInputRef}/>
                                    </div>
                                    <div className='listsPopupWrapper__listsPopup__footer'>
                                        <WidgetFooter save={_mergeLists}/>
                                    </div>
                                </div>
                            </div>
                        </Popup> : null
                    }
                    {(activePopup === 'removeLists') ?
                        <Popup close={() => {setActivePopup('')}} size='small'>
                            <div className='listsPopupWrapper'>
                                <div className='listsPopupWrapper__listsPopup'>
                                    <div className='listsPopupWrapper__listsPopup__header'>
                                        <WidgetHeader
                                            iconVal='list'
                                            headline={(selectedLists.length > 1) ? tc.removeLists : tc.removeList}
                                        />
                                    </div>
                                    <div className='listsPopupWrapper__listsPopup__content'>
                                        <p>{tc.removeEnsure}</p>
                                    </div>
                                    <div className='listsPopupWrapper__listsPopup__footer'>
                                        <WidgetFooter remove={_removeLists}/>
                                    </div>
                                </div>
                            </div>
                        </Popup> : null
                    }
                    {(activePopup === 'removeListsSubscriptions') ?
                        <Popup close={() => {setActivePopup('')}} size='small'>
                            <div className='listsPopupWrapper'>
                                <div className='listsPopupWrapper__listsPopup'>
                                    <div className='listsPopupWrapper__listsPopup__header'>
                                        <WidgetHeader
                                            iconVal='subscription'
                                            headline={(selectedSubscriptions.length > 1) ? tc.removeSubscriptions : tc.removeSubscription}
                                        />
                                    </div>
                                    <div className='listsPopupWrapper__listsPopup__content'>
                                        <p>{tc.removeEnsure}</p>
                                    </div>
                                    <div className='listsPopupWrapper__listsPopup__footer'>
                                        <WidgetFooter remove={_removeListsSubscriptions}/>
                                    </div>
                                </div>
                            </div>
                        </Popup> : null
                    }
                    {(activePopup === 'shareLists') ?
                        <Popup close={() => {setActivePopup('')}} size='medium'>
                            <ShareLists lists={selectedLists} save={_shareLists}/>
                        </Popup> : null
                    }
                    {(activePopup === 'splitList') ?
                        <Popup close={() => {setActivePopup('')}} size='medium'>
                            <SplitList list={selectedLists[0]} save={_splitList}/>
                        </Popup> : null
                    }
                </div>
            </div>
        </div> :
        <Loading />
    );
};

const MapStateToProps = (state) => {
    return {
        lists: state.lists,
    };
};

export default connect(
    MapStateToProps,
)(Lists);
