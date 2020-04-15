import React, {useEffect} from 'react';
import {connect} from 'react-redux';
// import {getActivity} from 'store/activity/tasks';
import Loading from 'components/shared/loading';

const ActivityStream = (state) => {

    const _renderActivity = () => {

    };

    const _stateCheck = () => {
        // return !!state && state.activity; // Utveckla...
        return false;
    };

    useEffect(() => {
        // getActivity({}); // Hämta aktivitet baserat på filter eller targetId. Detta ska skickas in som props.
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
        activity: state.activity
    };
};

export default connect(
    MapStateToProps,
)(ActivityStream);

