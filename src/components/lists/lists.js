import React, {useEffect, useRef, useState} from 'react';
import {archiveLists, getLists, mergeLists, removeLists} from 'store/lists/tasks';
import {showFlashMessage} from 'store/flash_messages/tasks';
import {connect} from 'react-redux';
import {tableHelper, tc} from 'helpers';
import {Table} from 'components/table';
import ListsSubscriptions from './lists_subscriptions';
import Loading from 'components/loading';
import Menu from 'components/menu';
import Popup from 'components/popup';
import WidgetHeader from 'components/widget_header';
import WidgetFooter from 'components/widget_footer';

const Lists = (state) => {
    const [listName, setListName] = useState('');
    const [activeContent, setActiveContent] = useState('listsRegular');
    const [selectedLists, setSelectedLists] = useState([]);
    const [showMergeLists, setShowMergeLists] = useState(false);
    const [showRemoveLists, setShowRemoveLists] = useState(false);
    const mergeListsNameInputRef = useRef(null);

    const _archiveSelected = async () => {
        setSelectedLists([]);
        return await archiveLists({listIds: selectedLists.map((num) => num._id)});
    };
    const _excelOutput = () => {
        console.log('Ladda ner excel');
    };

    const _mergeLists = async () => {
        if (listName.length) {
            setShowMergeLists(false);
            await mergeLists({listIds: selectedLists.map((num) => num._id), name: listName});
            setSelectedLists([]);
            return setListName('');
        } else {
            return showFlashMessage(tc.nameCannotBeEmpty);
        }
    };

    const _recreateCriterias = () => {
        console.log('Återskapa kriterier');
    };

    const _removeLists = async () => {
        setShowRemoveLists(false);
        setSelectedLists([]);
        return await removeLists({listIds: selectedLists.map((num) => num._id)});
    };

    const _shareSelected = () => {
        console.log('Dela listor');
    };

    const _splitSelected = () => {
        console.log('Klyv lista');
    };

    const _stateCheck = () => {
        return !!(state && state.lists && state.lists.lists !== null);
    };

    useEffect(() => {
        getLists({});
        getLists({archived: true});
    }, []);

    useEffect(() => {
        if (showMergeLists) {
            mergeListsNameInputRef && mergeListsNameInputRef.current && mergeListsNameInputRef.current.focus();
        }
    }, [showMergeLists]);

    return ( _stateCheck() ?
        <div className='listsWrapper'>
            <div className='listsWrapper__lists'>
                <div className='listsWrapper__lists__header'>
                    <Menu items={[
                            {
                                id: 1,
                                active: true,
                                label: tc.lists,
                                onClick: () => {
                                    setSelectedLists([]);
                                    setActiveContent('listsRegular');
                                },
                                type: 'nav',
                                children: [
                                    {disabled: !(selectedLists.length), label: (selectedLists.length > 1) ? tc.archiveLists : tc.archiveList, onClick: _archiveSelected, type: 'button'},
                                    {disabled: !(selectedLists.length), label: (selectedLists.length > 1) ? tc.shareLists : tc.shareList, onClick: _shareSelected, type: 'button'},
                                    {disabled: !(selectedLists.length && selectedLists.length === 1), label: tc.splitList, onClick: _splitSelected, type: 'button'},
                                    {disabled: !(selectedLists.length), label: tc.excelOutput, onClick: _excelOutput, type: 'button'},
                                    {disabled: !(selectedLists.length), label: (selectedLists.length > 1) ? tc.removeLists : tc.removeList, onClick: () => {setShowRemoveLists(true)}, type: 'button'},
                                    {disabled: !(selectedLists.length && selectedLists.length > 1), label: tc.mergeLists, onClick: () => {setShowMergeLists(true)}, type: 'button'},
                                    {disabled: !(selectedLists.length && selectedLists.length === 1 && selectedLists[0].meta && selectedLists[0].meta.criterias && Object.keys(selectedLists[0].meta.criterias).length), label: tc.recreateCriterias, onClick: _recreateCriterias, type: 'button'},
                                ],
                            },
                            {
                                id: 2,
                                label: tc.archivedLists,
                                onClick: () => {
                                    setSelectedLists([]);
                                    setActiveContent('listsArchived');
                                },
                                type: 'nav',
                                children: [
                                    {disabled: !(selectedLists.length), label: tc.undoArchive, onClick: () => {console.log('KLICK ÅNGRA ARKIVERING')}, type: 'button'},
                                    {disabled: !(selectedLists.length), label: tc.removeList, onClick: () => {console.log('KLICK TA BORT')}, type: 'button'},
                                ],
                            },
                            {
                                id: 3,
                                label: tc.listSubscriptions,
                                onClick: () => {
                                    setSelectedLists([]);
                                    setActiveContent('listsSubscriptions');
                                },
                                type: 'nav',
                            }
                        ]}
                    />
                </div>
                <div className='listsWrapper__lists__content'>
                    {activeContent === 'listsRegular' &&
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
                    {activeContent === 'listsArchived' &&
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
                    {activeContent === 'listsSubscriptions' &&
                        <div className='listsWrapper__lists__content__item'>
                            <div className='listsWrapper__lists__content__item__header__content'>
                                <ListsSubscriptions/>
                            </div>
                        </div>
                    }
                    {showMergeLists &&
                    <Popup close={() => {setShowMergeLists(false)}} size='small'>
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
                    {showRemoveLists &&
                    <Popup close={() => {setShowRemoveLists(false)}} size='small'>
                        <div className='listsPopupWrapper'>
                            <div className='listsPopupWrapper__listsPopup'>
                                <div className='listsPopupWrapper__listsPopup__header'>
                                    <WidgetHeader
                                        iconVal='merge'
                                        headline={tc.removeLists}
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
