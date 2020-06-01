import React from 'react';
import {useParams} from 'react-router-dom';
import {connect} from 'react-redux';
import Loading from 'components/loading';

const List = (state) => {
    const {id} = useParams();

    const _stateCheck = () => {
        return true;
    };

    // Hämta list-data, via någon listInspect-funktion...

    return ( _stateCheck() ?
            <div className='listsWrapper'>
                <div className='listsWrapper__lists'>
                    <div className='listsWrapper__lists__header'>

                    </div>
                    <div className='listsWrapper__lists__content'>
                        List id: {id}
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
)(List);
