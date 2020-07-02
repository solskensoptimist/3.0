import React, {useEffect, useState} from 'react';
import {getLists} from 'store/lists/tasks';
import {connect} from 'react-redux';
import {tableHelper, tc} from 'helpers';
import history from '../../router_history';
import {Table} from 'components/table';
import Loading from 'components/loading';
import Menu from 'components/menu';
import WidgetHeader from 'components/widget_header';

const Lists = (state) => {
    const [selectedLists, setSelectedLists] = useState([]);

    const _archiveSelected = () => {
        console.log('Arkivera listor');
    };
    const _excelOutput = () => {
        console.log('Ladda ner excel');
    };

    const _mergeLists = () => {
        console.log('Slå ihop listor');
    };

    const _recreateCriterias = () => {
        console.log('Återskapa kriterier');
    };

    const _removeLists = () => {
        console.log('Ta bort listor');
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

    return ( _stateCheck() ?
        <div className='listsWrapper'>
            <div className='listsWrapper__lists'>
                <div className='listsWrapper__lists__header'>
                    <Menu items={[
                        {disabled: !(selectedLists.length), label: (selectedLists.length > 1) ? tc.archiveLists : tc.archiveList, onClick: _archiveSelected, type: 'button'},
                        {disabled: !(selectedLists.length), label: (selectedLists.length > 1) ? tc.shareLists : tc.shareList, onClick: _shareSelected, type: 'button'},
                        {disabled: !(selectedLists.length && selectedLists.length === 1), label: tc.splitList, onClick: _splitSelected, type: 'button'},
                        {disabled: !(selectedLists.length), label: tc.excelOutput, onClick: _excelOutput, type: 'button'},
                        {icon: 'navigate', label: tc.listSubscriptions, onClick: () => {history.push('listor/prenumerationer')}, type: 'button'},
                        {disabled: !(selectedLists.length), label: (selectedLists.length > 1) ? tc.removeLists : tc.removeList, onClick: _removeLists, type: 'button'},
                        {disabled: !(selectedLists.length && selectedLists.length > 1), label: tc.mergeLists, onClick: _mergeLists, type: 'button'},
                        {disabled: !(selectedLists.length && selectedLists.length === 1 && selectedLists[0].meta && selectedLists[0].meta.criterias && Object.keys(selectedLists[0].meta.criterias).length), label: tc.recreateCriterias, onClick: _recreateCriterias, type: 'button'},
                    ]}
                    />
                </div>
                <div className='listsWrapper__lists__content'>
                    <div className='listsWrapper__lists__content__item'>
                        <div className='listsWrapper__lists__content__item__header'>
                            <WidgetHeader
                                iconVal='lists'
                                headline={tc.lists}
                            />
                        </div>
                        <div className='listsWrapper__lists__content__item__content'>
                            <Table
                                columns={tableHelper.getListsColumns()}
                                onSelect={(arr) => {setSelectedLists(state.lists.lists.filter((num) => arr.includes(num._id)))}}
                                rows={tableHelper.getListsRows((state.lists.lists && state.lists.lists.length) ? state.lists.lists : [])}
                            />
                        </div>
                    </div>
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
