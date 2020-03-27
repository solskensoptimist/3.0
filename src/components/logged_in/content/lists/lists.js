import React, {useEffect} from 'react';
import tc from 'text_content';
import {getLists} from 'store/lists/tasks';
import {connect} from 'react-redux';
import Loading from 'components/common/loading';

const Lists = (state) => {
    const _stateCheck = () => {
        return !!(state && state.lists && state.lists.lists !== null);
    };

    useEffect(() => {
        getLists({});
    }, []);

    return ( _stateCheck() ?
        <div className='listsWrapper'>
            {tc.lists}
            {
                state.lists.lists.map((list) => {
                    return <p>{list.name}</p>
                })
            }
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
