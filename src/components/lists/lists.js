import React, {useEffect, useRef, useState} from 'react';
import {archiveLists, getLists, mergeLists, removeLists} from 'store/lists/tasks';
import {showFlashMessage} from 'store/flash_messages/tasks';
import {connect} from 'react-redux';
import {tableHelper, tc} from 'helpers';
import history from '../../router_history';
import {Table} from 'components/table';
import Loading from 'components/loading';
import Menu from 'components/menu';
import Popup from 'components/popup';
import WidgetFooter from 'components/widget_footer';
import WidgetHeader from 'components/widget_header';

const Lists = (state) => {
    const [listName, setListName] = useState('');
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
                        {disabled: !(selectedLists.length), label: (selectedLists.length > 1) ? tc.archiveLists : tc.archiveList, onClick: _archiveSelected, type: 'button'},
                        {icon: 'navigate', label: tc.archivedLists, onClick: () => {history.push('listor/arkiverade')}, type: 'button'},
                        {disabled: !(selectedLists.length), label: (selectedLists.length > 1) ? tc.shareLists : tc.shareList, onClick: _shareSelected, type: 'button'},
                        {disabled: !(selectedLists.length && selectedLists.length === 1), label: tc.splitList, onClick: _splitSelected, type: 'button'},
                        {disabled: !(selectedLists.length), label: tc.excelOutput, onClick: _excelOutput, type: 'button'},
                        {icon: 'navigate', label: tc.listSubscriptions, onClick: () => {history.push('listor/prenumerationer')}, type: 'button'},
                        {disabled: !(selectedLists.length), label: (selectedLists.length > 1) ? tc.removeLists : tc.removeList, onClick: () => {setShowRemoveLists(true)}, type: 'button'},
                        {disabled: !(selectedLists.length && selectedLists.length > 1), label: tc.mergeLists, onClick: () => {setShowMergeLists(true)}, type: 'button'},
                        {disabled: !(selectedLists.length && selectedLists.length === 1 && selectedLists[0].meta && selectedLists[0].meta.criterias && Object.keys(selectedLists[0].meta.criterias).length), label: tc.recreateCriterias, onClick: _recreateCriterias, type: 'button'},
                    ]}
                    />
                </div>
                <div className='listsWrapper__lists__content'>
                    <div className='listsWrapper__lists__content__item'>
                        <Table
                            columns={tableHelper.getListsColumns()}
                            onSelect={(arr) => {setSelectedLists(state.lists.lists.filter((num) => arr.includes(num._id)))}}
                            rows={tableHelper.getListsRows((state.lists.lists && state.lists.lists.length) ? state.lists.lists : [])}
                            selected={selectedLists.map((num) => num._id)}
                        />
                    </div>
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
