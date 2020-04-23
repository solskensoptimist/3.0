import React from 'react';
import {activityHelper, dealHelper, tc} from 'helpers';
import moment from 'moment';
import Icon from 'components/shared/icon';
import {NavLink} from 'react-router-dom';
import companyHelper from 'shared_helpers/company_helper';

export default (props) => {
    const activity = props.activity;

    const _editActivity = () => {
        // Ska bara kunna redigera kommentar.... uppdatera antingen comment eller deal_action.
        // Comment har id deal_action har _id. Men kolla också på activity.comment activity.action mm.

    };

    const _removeActivity = () => {
        // Ta reda på om det är comment eller deal_action.
        // Comment har id deal_action har _id. Men kolla också på activity.comment activity.action mm.
    };

    // Action.
    let action;
    if (props.type === 'filter') {
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
        } else if (!activity.action && activity.comment && activity.comment !== '') {
            // No action, this is a comment.
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
        } else if (!activity.action && activity.comment && activity.comment !== '') {
            action = <div>{activityHelper.getReadableActivity('comment')}</div>;
        }
    }

    // Comment
    let comment = (activity.comment && activity.comment !== '') ? activity.comment : null;

    // Date
    const date = (activity.date_created) ? moment(activity.date_created).format('LL HH:mm') : null;

    // Icon
    let icon;
    if (activity.action) {
        icon = <Icon val={activity.action}/>;
    } else if (!activity.action && activity.comment) {
        icon = <Icon val='comment'/>;
    }

    // User
    const user = (activity.user && activity.user !== '') ? activity.user : tc.unknown;

    return (
        <div className='activitiesWrapper__activities__content__itemWrapper'>
            <div className='activitiesWrapper__activities__content__itemWrapper__item'>
                <div className='activitiesWrapper__activities__content__itemWrapper__item__icon'><span className='iconHolder'>{icon}</span></div>
                <div className='activitiesWrapper__activities__content__itemWrapper__item__date'><span className='label'>{tc.time}:</span>{date}</div>
                <div className='activitiesWrapper__activities__content__itemWrapper__item__action'><span className='label'>{tc.action}:</span>{action}</div>
                <div className='activitiesWrapper__activities__content__itemWrapper__item__comment'><span className='label'>{tc.comment}:</span>{comment}</div>
                <div className='activitiesWrapper__activities__content__itemWrapper__item__user'><span className='label'>{tc.user}:</span>{user}</div>
                <div className='activitiesWrapper__activities__content__itemWrapper__item__edit'>
                    <Icon hover={true} val='edit' onClick={_editActivity}/>
                    <Icon hover={true} val='remove' onClick={_removeActivity}/>
                </div>
            </div>
        </div>
    );
};
