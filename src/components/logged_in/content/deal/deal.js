import React, {useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {connect} from 'react-redux';
import {getDeal} from 'store/deal/tasks';
import Loading from 'components/common/loading';

/**
 * Render a deal view.
 */
const Deal = (state) => {
    const {id} = useParams();

    useEffect(() => {
        getDeal({id: id});
    }, [id]);

    const _stateCheck = () => {
        return (state && state.deal && state.deal.deal && Object.keys(state.deal.deal).length);
    };

    return ( _stateCheck() ?
        <div className='dealWrapper'>
            <div className='deal'>
                Deal komponent
                <p>Id: {id}</p>
            </div>
        </div> :
        <Loading />
    );
};

const MapStateToProps = (state) => {
    return {
        deal: state.deal,
    };
};

export default connect(
    MapStateToProps,
)(Deal);
