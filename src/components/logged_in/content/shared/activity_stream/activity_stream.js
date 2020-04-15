import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {getActivity} from 'store/activity/tasks';
import Loading from 'components/shared/loading';

const ActivityStream = (state) => {

    const _renderActivity = () => {

    };

    const _stateCheck = () => {
        return !!state && state.activity;
    };

    useEffect(() => {
        getActivity({});
    });

    return ( _stateCheck ?
        <div className='activitystreamWrapper'>
            <div className='activitystreamWrapper_activitystream'>
                {_renderActivity()}
            </div>
        </div> :
        <Loading />
    );
};

const MapStateToProps = (state, props) => {
    return {
        activity: activity
    };
};

export default connect(
    MapStateToProps,
)(ActivityStream);

