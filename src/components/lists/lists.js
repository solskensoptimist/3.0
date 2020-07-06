import React, {useEffect, useRef, useState} from 'react';
import {archiveLists, getLists, getListsSubscriptions, mergeLists, removeLists, removeListsSubscriptions, shareLists, splitList, undoArchive} from 'store/lists/tasks';
import {showFlashMessage} from 'store/flash_messages/tasks';
import {connect} from 'react-redux';
import {tableHelper, tc} from 'helpers';
import {Table} from 'components/table';
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
    const mergeListsNameInputRef = useRef(null);

    const _archiveLists = async () => {
        await archiveLists({listIds: selectedLists.map((num) => num._id)});
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
        return !!(state && state.lists && state.lists.lists !== null);
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
                    {(activeContent === 'listsRegular') &&
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
                        </div>
                    }
                    {(activeContent === 'listsArchived') &&
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
                        </div>
                    }
                    {(activeContent === 'listsSubscriptions') &&
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
                    </div>
                    }
                    {(activePopup === 'mergeLists') &&
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
                                        <p>{tc.nameNewList}:</p><input onChange={(e) => {setListName(e.target.value)}} ref={mergeListsNameInputRef}/>
                                    </div>
                                    <div className='listsPopupWrapper__listsPopup__footer'>
                                        <WidgetFooter save={_mergeLists}/>
                                    </div>
                                </div>
                            </div>
                        </Popup>
                    }
                    {(activePopup === 'removeLists') &&
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
                        </Popup>
                    }
                    {(activePopup === 'removeListsSubscriptions') &&
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
                        </Popup>
                    }
                    {(activePopup === 'shareLists') &&
                        <Popup close={() => {setActivePopup('')}} size='medium'>
                            <ShareLists lists={selectedLists} save={_shareLists}/>
                        </Popup>
                    }
                    {(activePopup === 'splitList') &&
                        <Popup close={() => {setActivePopup('')}} size='medium'>
                            <SplitList list={selectedLists[0]} save={_splitList}/>
                        </Popup>
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
