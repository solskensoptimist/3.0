import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {activityHelper, tc} from 'helpers';
import moment from 'moment';
import {getActivity} from 'store/activity/tasks';
import ActivityItem from './activity_item';
import Icon from 'components/icon';
import Info from 'components/info';
import Loading from 'components/loading';
import Tooltip from 'components/tooltip';
import WidgetHeader from 'components/widget_header';

/**
 * Render activities, I.E. all historic events.
 * Optional to include comments and 'moved' actions.
 * Can render activities based on a target (deal id or TS user id/orgnr), or based on current filter.
 *
 * @props.includeComments - bool - (optional)
 * @props.includeMoved - bool - (optional)
 * @props.target - string - Use when type === 'target': deal id / company org nr / TS user_id
 * @props.type - string - 'target' / 'filter'
 */
const Activities = (state) => {
    const amountIncrease = 5;
    const [activityRows, setActivityRows] = useState(null); // Holds JSX content.
    const [dataLength, setDataLength] = useState(null); // Used to know when we have rendered all rows.
    const [includeComments, setIncludeComments] = useState(state.props.includeComments);
    const [includeMoved, setIncludeMoved] = useState(state.props.includeMoved);
    const [showAmount, setShowAmount] = useState(amountIncrease);
    const [minimize, setMinimize] = useState(false);

    useEffect(() => {
        if (state.props.type === 'target' && state.props.target) {
            getActivity({target: state.props.target, type: 'target'});
        } else {
            getActivity({type: 'filter'});
        }
    }, [state.props.target, state.props.type]);

    useEffect(() => {
        /**
         * Set activity rows to state.
         */
        const _renderActivities = () => {
            let data = (state.props.type === 'filter') ? state.activity.activityByFilter : state.activity.activityByTarget;
            if (!data) {
                return null;
            }

            if (!includeMoved) {
                // Remove move activites.
                data = data.filter((num) => ((num.action && num.action !== 'move') || !num.action));
            }

            if (!includeComments) {
                // Remove comment activites (comment activities have no 'action' property).
                data = data.filter((num) => (num.action));
            }

            // If no data, minimize widget.
            if (!data || (data && data.length === 0)) {
                setActivityRows(
                    <Info>
                        <h4>{tc.noActivity}</h4>
                        <p>{tc.noActivityWhy}</p>
                    </Info>
                );
                return setMinimize(true);
            }

            // Set data length before slice.
            setDataLength(data.length);

            // Show more rows every time user click load icon.
            data = data.slice(0, showAmount);

            setActivityRows(data.map((num, i) => {
                return (
                    <React.Fragment key={i}>
                        {_renderActivityItem(num)}
                    </React.Fragment>
                );
            }));
        };

        /**
         * Return one activity row.
         */
        const _renderActivityItem = (activity) => {
            // Action
            const actionObj = activityHelper.getActionElement(state.props.target, state.props.type, activity, state.user);

            // Comment
            const comment = (activity.comment) ? activity.comment : null;

            // Date
            const date = (activity.date_created) ? moment(new Date(activity.date_created)).format('LL HH:mm') : null;

            // Id.
            let id;
            if (activity._id) {
                id = activity._id;
            } else if (activity.id) {
                id = activity.id;
            }

            // Icon
            let icon;
            if (activity.action) {
                icon = <Icon val={activity.action}/>;
            } else if (!activity.action && activity.comment) {
                icon = <Icon val='comment'/>;
            }

            // User
            const user = (activity.user && activity.user !== '') ? activity.user : tc.unknown;

            return <ActivityItem
                        action={actionObj.action}
                        comment={comment}
                        date={date}
                        id={id}
                        icon={icon}
                        standAlone={false}
                        isEditable={actionObj.isEditable}
                        user={user}
                    />;
        };

        _renderActivities();
    }, [includeComments, includeMoved, showAmount, state.activity.activityByFilter, state.activity.activityByTarget, state.props.target, state.props.type, state.user]);


    const _stateCheck = () => {
        if (state.props.type === 'filter') {
            return !!state && state.activity && state.activity.activityByFilter;
        } else if (state.props.type === 'target') {
            return !!state && state.activity && state.activity.activityByTarget;
        }
    };

    return ( _stateCheck() ?
        <div className='activitiesWrapper'>
            <div className='activitiesWrapper__activities'>
                <div className='activitiesWrapper__activities__header'>
                    <WidgetHeader
                        iconVal='activities'
                        dashboard={
                            minimize ?
                                <>
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.maximize}><Icon val='maximize' onClick={() => {setMinimize(false)}}/></Tooltip>
                                </> :
                                <>
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.toggleComments}><Icon active={includeComments} val='toggleComments' onClick={() => {setIncludeComments(!includeComments)}}/></Tooltip>
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.toggleMoved}><Icon active={includeMoved} val='toggleMoved' onClick={() => {setIncludeMoved(!includeMoved)}}/></Tooltip>
                                    {(showAmount > amountIncrease) && <Tooltip horizontalDirection='left' tooltipContent={tc.reset}><Icon val='reset' onClick={() => {setShowAmount(amountIncrease)}}/></Tooltip>}
                                    {(showAmount < dataLength) && <Tooltip horizontalDirection='left' tooltipContent={tc.load}><Icon val='load' onClick={() => {setShowAmount(showAmount + amountIncrease)}}/></Tooltip>}
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.minimize}><Icon val='minimize' onClick={() => {setMinimize(true)}}/></Tooltip>
                                </>
                        }
                        headline={tc.activity}
                        headlineSub={tc.allActivitiesAllIncludingComments}
                    />
                </div>
                {!minimize &&
                    <div className='activitiesWrapper__activities__content'>
                        {activityRows}
                    </div>
                }
            </div>
        </div> :
        <Loading />
    );
};

const MapStateToProps = (state, props) => {
    return {
        activity: state.activity,
        comment: state.comment,
        props: props,
        user: state.user
    };
};

export default connect(
    MapStateToProps,
)(Activities);

