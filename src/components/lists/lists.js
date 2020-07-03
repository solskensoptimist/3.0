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
    const [showChooseName, setShowChooseName] = useState(false);
    const newListNameInputRef = useRef(null);

    const _archiveSelected = async () => {
        return await archiveLists({listIds: selectedLists.map((num) => num._id)});
    };
    const _excelOutput = () => {
        console.log('Ladda ner excel');
    };

    const _mergeLists = async () => {
        if (listName.length) {
            setShowChooseName(false);
            await mergeLists({listIds: selectedLists.map((num) => num._id), name: listName});
            return setListName('');
        } else {
            return showFlashMessage(tc.nameCannotBeEmpty);
        }
    };

    const _recreateCriterias = () => {
        console.log('Återskapa kriterier');
    };

    const _removeLists = async () => {
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
        if (showChooseName) {
            newListNameInputRef && newListNameInputRef.current && newListNameInputRef.current.focus();
        }
    }, [showChooseName]);

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
                        {disabled: !(selectedLists.length), label: (selectedLists.length > 1) ? tc.removeLists : tc.removeList, onClick: _removeLists, type: 'button'},
                        {disabled: !(selectedLists.length && selectedLists.length > 1), label: tc.mergeLists, onClick: () => {setShowChooseName(true)}, type: 'button'},
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
                        />
                    </div>
                    {showChooseName &&
                        <Popup close={() => {setShowChooseName(false)}} size='small'>
                            <div className='listsChooseNameWrapper'>
                                <div className='listsChooseNameWrapper__listsChooseName'>
                                    <div className='listsChooseNameWrapper__listsChooseName__header'>
                                        <WidgetHeader
                                            iconVal='merge'
                                            headline={tc.mergeLists}
                                        />
                                    </div>
                                    <div className='listsChooseNameWrapper__listsChooseName__content'>
                                        <p>{tc.nameNewList}:</p><input onChange={(e) => {setListName(e.target.value)}} ref={newListNameInputRef}/>
                                    </div>
                                    <div className='listsChooseNameWrapper__listsChooseName__footer'>
                                        <WidgetFooter save={_mergeLists}/>
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
