import React, {useEffect} from 'react';
import {connect} from 'react-redux';
// import {getActivityFiltered} from 'store/activity/tasks';
import Loading from 'components/shared/loading';

const ActivityStream = (state) => {

    const _renderActivity = () => {

    };

    const _stateCheck = () => {
        // return !!state && state.activity; // Utveckla...
        return false;
    };

    useEffect(() => {
        // getActivityFiltered({}); // Beroende på type ska vi hämta aktivitet baserat på filter eller targetId...
    });

    return ( _stateCheck() ?
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

