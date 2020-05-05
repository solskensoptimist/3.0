import React, {useEffect} from 'react';
import {getLists} from 'store/lists/tasks';
import {connect} from 'react-redux';
import Loading from 'components/shared/loading';

const Lists = (state) => {
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

                </div>
                <div className='listsWrapper__lists__content'>
                    {state.lists.lists.map((list) => {
                            return <p>{list.name}</p>
                        })}
                </div>
            </div> :
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
