import React, {useEffect, useState} from 'react';
import {getLists} from 'store/lists/tasks';
import {connect} from 'react-redux';
import {tableHelper, tc} from 'helpers';
import {Table} from 'components/table';
import Loading from 'components/loading';
import Menu from 'components/menu';

const Lists = (state) => {
    const [lists, setLists] = useState([]);

    const _minKnapp = () => {
        console.log('Min knapp klickades');
    };

    const _mittDropdownItem = () => {
        console.log('Mitt dropdownitem klickades');
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
                        {label: 'Min knapp', onClick:_minKnapp, type: 'button'},
                        {label: 'Min dropdown', type: 'dropdown', items: [
                                {label: 'Dropdownitem 1', onClick: _mittDropdownItem},
                                {label: 'Dropdownitem 2', onClick: _mittDropdownItem},
                                {label: 'Dropdownitem 3', onClick: _mittDropdownItem},
                            ]}
                    ]}
                    />
                </div>
                <div className='listsWrapper__lists__content'>
                    <div className='listsWrapper__lists__content__item'>
                        <Table
                            columns={tableHelper.getListsColumns()}
                            onSelect={(arr) => {setLists(arr)}}
                            rows={tableHelper.getListsRows((state.lists.lists && state.lists.lists.length) ? state.lists.lists : [])}
                        />
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
