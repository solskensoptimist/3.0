import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import Loading from 'components/shared/loading';
import ActivityItem from './activity_item';
import {tc} from 'helpers';
import Icon from 'components/shared/icon';
import ContentHeader from 'components/shared/content_header';
import {getActivityByTarget, getActivityByFilter} from 'store/activity/tasks';

/**
 * Render activities, I.E. all historic events.
 * Optional to include comments and 'moved' actions.
 */
const Activities = (state) => {
    const [includeComments, setIncludeComments] = useState(state.props.includeComments);
    const [includeMoved, setIncludeMoved] = useState(state.props.includeMoved);
    const [showAmount, setShowAmount] = useState(5);
    const [minimize, setMinimize] = useState(false);

    const _renderActivity = () => {
        let data = (state.props.type === 'filter') ? state.activity.activityByFilter : state.activity.activityByTarget;

        if (!includeMoved) {
            // Remove move activites.
            data = data.filter((num) => ((num.action && num.action !== 'move') || !num.action));
        }

        if (!includeComments) {
            // Remove comment activites (comment activities have no 'action' property).
            data = data.filter((num) => (num.action));
        }

        // Show 5 more rows every time user click load icon.
        data = data.slice(0, showAmount);

        data = data.map((num, i) => {
            return <ActivityItem activity={num} type={state.props.type}/>;
        });

        return (data.length) ? data : <p>{tc.noActivity}</p>;
    };

    const _stateCheck = () => {
        if (state.props.type === 'filter') {
            return !!state && state.activity && state.activity.activityByFilter;
        } else if (state.props.type === 'target') {
            return !!state && state.activity && state.activity.activityByTarget;
        }
    };

    useEffect(() => {
        if (state.props.type === 'target' && state.props.id) {
            getActivityByTarget({id: state.props.id, type: 'deal'});
        } else {
            getActivityByFilter();
        }
    }, [state.props]);

    return ( _stateCheck() ?
        <div className='activitiesWrapper'>
            <div className='activitiesWrapper__activities'>
                <div className='activitiesWrapper__activities__header'>
                    <ContentHeader
                        iconVal='activities'
                        dashboard={
                            <>
                                <Icon hover={true} val='toggleComments' onClick={() => {setIncludeComments(!includeComments)}}/>
                                <Icon hover={true} val='toggleMoved' onClick={() => {setIncludeMoved(!includeMoved)}}/>
                                <Icon hover={true} val='load' onClick={() => {setShowAmount(showAmount + 5)}}/>
                                <Icon hover={true} val='regret' onClick={() => {setShowAmount(5)}}/>
                                {minimize ? <Icon hover={true} val='maximize' onClick={() => {setMinimize(false)}}/> : <Icon hover={true} val='minimize' onClick={() => {setMinimize(true)}}/>}
                            </>
                        }
                        headline={tc.activities}
                        headlineSub={tc.activitiesAllIncludingComments}
                        />
                </div>
                <div className={minimize ? 'hide' : 'activitiesWrapper__activities__content'}>
                    <p>Om state.props.type === 'filter' ska inget göras.</p>
                    <p>Men om state.props.type === 'target' ska vi visa ett kommentarsfält. OBS vi ska ha target i store så att vi kan kolla detta när vi lägger till newCommentForTarget.</p>
                    {_renderActivity()}
                </div>
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
)(Activities);

