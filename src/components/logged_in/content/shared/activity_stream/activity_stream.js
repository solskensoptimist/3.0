import React from 'react';
import {connect} from 'react-redux';
import Loading from 'components/shared/loading';

const ActivityStream = (state) => {

    const _renderActivity = () => {
        // Oavsett om det är filter eller target bör vi rendera likadant..?
    };

    const _stateCheck = () => {
        if (state.props.type === 'filter') {
            return !!state && state.activity && state.activity.activityByFilter; // Utveckla...
        } else if (state.props.type === 'target') {
            return !!state && state.activity && state.activity.activityByTarget && state.activity.activityByTarget.data;
        }
    };

    return ( _stateCheck() ?
        <div className='activityStreamWrapper'>
            <div className='activityStreamWrapper_activityStream'>
                {_renderActivity()}
            </div>
        </div> :
        <Loading />
    );
};

const MapStateToProps = (state, props) => {
    return {
        activity: state.activity,
        props: props,
    };
};

export default connect(
    MapStateToProps,
)(ActivityStream);

