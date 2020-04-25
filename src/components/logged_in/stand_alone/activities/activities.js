import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {activityHelper, dealHelper, tc} from 'helpers';
import companyHelper from 'shared_helpers/company_helper';
import moment from 'moment';
import {getActivityByTarget, getActivityByFilter} from 'store/activity/tasks';
import {NavLink} from 'react-router-dom';
import ActivityItem from './activity_item';
import Icon from 'components/shared/icon';
import Loading from 'components/shared/loading';
import Tooltip from 'components/shared/tooltip';
import WidgetHeader from 'components/shared/widget_header';

/**
 * Render activities, I.E. all historic events.
 * Optional to include comments and 'moved' actions.
 */
const Activities = (state) => {
    const amountIncrease = 5;
    const [includeComments, setIncludeComments] = useState(state.props.includeComments);
    const [includeMoved, setIncludeMoved] = useState(state.props.includeMoved);
    const [showAmount, setShowAmount] = useState(amountIncrease);
    const [minimize, setMinimize] = useState(false);

    const _renderActivities = () => {
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

        if (data.length) {
            return data.map((num, i) => {
                return _renderActivityItem(num);
            });
        } else {
            return <p>{tc.noActivity}</p>;
        }
    };

    const _renderActivityItem = (activity) => {
        let isEditable = false;
        let isRemovable = false;

        // Action.
        let action;
        if (state.props.type === 'filter') {
            // When we show activity based on filter, we show a detailed action.
            if (activity.action && activity.action === 'move') {
                // For move action we add phases.
                action = <div>{activityHelper.getReadableActivity(activity.action)} {tc.theDeal.toLowerCase()} {tc.from.toLowerCase()} <strong>{dealHelper.getReadablePhase(activity.phase)}</strong> {tc.to.toLowerCase()} <strong>{dealHelper.getReadablePhase(activity.target)}</strong></div>
            } else if (activity.action && activity.deal && activity.deal.name && (activity.action === 'meeting' || activity.action === 'testride')) {
                // For these we add 'with'.
                action = <div>{activityHelper.getReadableActivity(activity.action)} {tc.with.toLowerCase()} <NavLink exact to={'/affar/' + activity.deal._id} key='affar'>{activity.deal.name}</NavLink></div>
            } else if (activity.action && activity.deal && activity.deal.name && (activity.action === 'call' ||
                activity.action === 'did_call' || activity.action === 'will_call' || activity.action === 'mail' ||
                activity.action === 'did_mail' || activity.action === 'will_mail' || activity.action === 'will_email' ||
                activity.action === 'did_post' || activity.action === 'will_post' || activity.action === 'offer' )) {
                // For these we add 'to'.
                action = <div>{activityHelper.getReadableActivity(activity.action)} {tc.to.toLowerCase()} <NavLink exact to={'/affar/' + activity.deal._id} key='affar'>{activity.deal.name}</NavLink></div>
            } else if (activity.action && activity.deal && activity.deal.name && (activity.action === 'analysis' || activity.action === 'valuation')) {
                // For these we add 'for'.
                action = <div>{activityHelper.getReadableActivity(activity.action)} {tc.for.toLowerCase()} <NavLink exact to={'/affar/' + activity.deal._id} key='affar'>{activity.deal.name}</NavLink></div>
            } else if (activity.action && activity.deal && activity.deal.name && (activity.action === 'visit')) {
                // For these we add 'at'.
                action = <div>{activityHelper.getReadableActivity(activity.action)} {tc.at.toLowerCase()} <NavLink exact to={'/affar/' + activity.deal._id} key='affar'>{activity.deal.name}</NavLink></div>
            } else if (activity.action && activity.deal && activity.deal.name) {
                // All other actions that has a deal name, add generic text.
                action = <div>{activityHelper.getReadableActivity(activity.action)} {tc.regarding.toLowerCase()} <NavLink exact to={'/affar/' + activity.deal._id} key='affar'>{activity.deal.name}</NavLink></div>
            } else if (!activity.action && activity.id && activity.comment && activity.comment !== '') {
                // No action, this is a comment.
                isEditable = true;
                isRemovable = true;
                if (activity.deal && activity.deal.name) {
                    // Add deal link to comment.
                    action = <div>{activityHelper.getReadableActivity('comment')} {tc.onDeal.toLowerCase()} <NavLink exact to={'/affar/' + activity.deal._id} key='affar'>{activity.deal.name}</NavLink></div>;
                } else if (!activity.deal && activity.target) {
                    // No deal, add prospect link.
                    if (companyHelper.isValidOrgNr(activity.target)) {
                        action = <div>{activityHelper.getReadableActivity('comment')} {tc.on.toLowerCase()} <NavLink exact to={'/foretag/' + activity.target} key='foretag'>{tc.oneProspect}</NavLink></div>;
                    } else {
                        action = <div>{activityHelper.getReadableActivity('comment')} {tc.on.toLowerCase()} <NavLink exact to={'/person/' + activity.target} key='person'>{tc.oneProspect}</NavLink></div>;
                    }
                } else {
                    // Catch comments without deal link or prospect link (should not exist).
                    action = <div>{activityHelper.getReadableActivity('comment')}</div>;
                }
            } else if (activity.action) {
                // Action without deal name.
                action = <div>{activityHelper.getReadableActivity(activity.action)}</div>;
            }
        } else {
            // For activity based on a target all the actions and comments is saved on that same target, so we leave details out.
            if (activity.action && activity.action === 'move') {
                action = <div>{activityHelper.getReadableActivity(activity.action)} {tc.theDeal.toLowerCase()} {tc.from.toLowerCase()} <strong>{dealHelper.getReadablePhase(activity.phase)}</strong> {tc.to.toLowerCase()} <strong>{dealHelper.getReadablePhase(activity.target)}</strong></div>;
            } else if (activity.action) {
                action = <div>{activityHelper.getReadableActivity(activity.action)}</div>;
            } else if (!activity.action && activity.id && activity.comment && activity.comment !== '') {
                isEditable = true;
                isRemovable = true;
                action = <div>{activityHelper.getReadableActivity('comment')}</div>;
            }
        }

        // Comment
        const comment = (activity.comment) ? activity.comment : null;

        // Date
        const date = (activity.date_created) ? moment(activity.date_created).format('LL HH:mm') : null;

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

        return <ActivityItem action={action} comment={comment} date={date} id={id} icon={icon} isEditable={isEditable} isRemovable={isRemovable} user={user}/>;
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
                    <WidgetHeader
                        iconVal='activities'
                        dashboard={
                            <>
                                <Tooltip horizontalDirection='left' tooltipContent={tc.toggleComments}><Icon active={includeComments} val='toggleComments' onClick={() => {setIncludeComments(!includeComments)}}/></Tooltip>
                                <Tooltip horizontalDirection='left' tooltipContent={tc.toggleMoved}><Icon active={includeMoved} val='toggleMoved' onClick={() => {setIncludeMoved(!includeMoved)}}/></Tooltip>
                                <Tooltip horizontalDirection='left' tooltipContent={tc.load}><Icon val='load' onClick={() => {setShowAmount(showAmount + amountIncrease)}}/></Tooltip>
                                {(showAmount > amountIncrease) && <Tooltip horizontalDirection='left' tooltipContent={tc.regret}><Icon val='regret' onClick={() => {setShowAmount(amountIncrease)}}/></Tooltip>}
                                {minimize ? <Tooltip horizontalDirection='left' tooltipContent={tc.maximize}><Icon val='maximize' onClick={() => {setMinimize(false)}}/></Tooltip> : <Tooltip tooltipContent={tc.minimize}><Icon val='minimize' onClick={() => {setMinimize(true)}}/></Tooltip>}
                            </>
                        }
                        headline={tc.activities}
                        headlineSub={tc.activitiesAllIncludingComments}
                        />
                </div>
                <div className={minimize ? 'hide' : 'activitiesWrapper__activities__content'}>
                    {_renderActivities()}
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

