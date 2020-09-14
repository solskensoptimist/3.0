import React from 'react';
import {dealHelper, tc} from 'helpers';
import {NavLink} from 'react-router-dom';
import Id from 'valid-objectid';
import companyHelper from 'shared_helpers/company_helper';

export const activityHelper = {
    getActionElement: (target, type, activity, user) => {
        // This cluster of an if statement is just to make the action look nice -
        // where appropriate add a link to prospect/deal.

        let action;
        let isEditable = false;

        // When target is the same as the activity target, we don't need to add a link to target.
        if (type === 'target' && ((activity.deal_id && target === activity.deal_id)
            || (activity.target && target === activity.target))) {
            if (activity.action && activity.action === 'move') {
                action = <div>{activityHelper.getReadableActivity(activity.action)} {tc.theDeal.toLowerCase()} {tc.from.toLowerCase()} <strong>{dealHelper.getReadablePhase(activity.phase)}</strong> {tc.to.toLowerCase()} <strong>{dealHelper.getReadablePhase(activity.target)}</strong></div>;
            } else if (activity.action) {
                action = <div>{activityHelper.getReadableActivity(activity.action)}</div>;
            } else if (!activity.action && activity.id && activity.comment && activity.comment !== '') {
                isEditable = (user.info.id === activity.user_id); // Can be edited, but only when created by the user.
                action = <div>{activityHelper.getReadableActivity('comment')}</div>;
            }
        } else {
            if (activity.action && activity.action === 'move' && activity.phase && activity.target) {
                // For move action we add phases.
                action = <div>{activityHelper.getReadableActivity(activity.action)} {tc.theDeal.toLowerCase()} {tc.from.toLowerCase()} <strong>{dealHelper.getReadablePhase(activity.phase)}</strong> {tc.to.toLowerCase()} <strong>{dealHelper.getReadablePhase(activity.target)}</strong></div>
            } else if (activity.action && activity.deal && activity.deal.name) {
                // For these we add a link to deal.
                action = <div>{activityHelper.getReadableActivity(activity.action)} {activityHelper.getPreposition(activity.action).toLowerCase()} <NavLink exact to={'/affar/' + activity.deal._id} key='affar'>{activity.deal.name}</NavLink></div>
            } else if (!activity.action && activity.comment && activity.comment !== '') {
                // No action, this is a comment.
                isEditable = (user.info.id === activity.user_id); // Can be edited, but only when created by the user.
                if (activity.deal && activity.deal.name) {
                    // Add deal link to deal.
                    action = <div>{activityHelper.getReadableActivity('comment')} {tc.onDeal.toLowerCase()} <NavLink exact to={'/affar/' + activity.deal._id} key='affar'>{activity.deal.name}</NavLink></div>;
                } else if (!activity.deal && activity.target && !Id.isValid(activity.target)) {
                    // No deal, add prospect link.
                    if (companyHelper.isValidOrgNr(activity.target)) {
                        action = <div>{activityHelper.getReadableActivity('comment')} {tc.on.toLowerCase()} <NavLink exact to={'/foretag/' + activity.target} key='foretag'>{tc.oneProspect.toLowerCase()}</NavLink></div>;
                    } else {
                        action = <div>{activityHelper.getReadableActivity('comment')} {tc.on.toLowerCase()} <NavLink exact to={'/person/' + activity.target} key='person'>{tc.oneProspect.toLowerCase()}</NavLink></div>;
                    }
                } else if (!activity.deal && activity.target && Id.isValid(activity.target)) {
                    // Target is deal, but we don't have deal name.
                    action = <div>{activityHelper.getReadableActivity('comment')} {tc.on.toLowerCase()} <NavLink exact to={'/affar/' + activity.target} key='affar'>{tc.deal.toLowerCase()}</NavLink></div>;
                } else {
                    // Catch comments without deal link or prospect link.
                    action = <div>{activityHelper.getReadableActivity('comment')}</div>;
                }
            } else if (activity.action) {
                // Action without deal name.
                if (activity.action === 'owner' && activity.deal_id) {
                    action = <div>{activityHelper.getReadableActivity(activity.action)} {tc.on.toLowerCase()} <NavLink exact to={'/affar/' + activity.deal_id} key='deal'>{tc.deal.toLowerCase()}</NavLink></div>;
                } else {
                    action = <div>{activityHelper.getReadableActivity(activity.action)}</div>;
                }
            }
        }

        return {action: action, isEditable: isEditable}
    },
    getReadableActivity: (activity) => {
        switch (activity) {
            case 'analysis':
                return tc.analysis;
            case 'call':
                return tc.call;
            case 'comment':
                return tc.comment;
            case 'lost':
                return tc.lost;
            case 'mail':
                return tc.mail;
            case 'meeting':
                return tc.meeting;
            case 'move':
                return tc.moved;
            case 'offer':
                return tc.offert;
            case 'other':
                return tc.other;
            case 'owner':
                return tc.changedOwner;
            case 'testride':
                return tc.testride;
            case 'valuation':
                return tc.valuation;
            case 'visit':
                return tc.visit;
            case 'won':
                return tc.won;

            // Deprecated?
            case 'did_call':
                return tc.didCall;
            case 'did_email':
                return tc.didEmail;
            case 'did_lose_price':
                return tc.didLosePrice;
            case 'did_lose_unknown':
                return tc.didLoseUnknown;
            case 'did_lose_window':
                return tc.didLoseWindow;
            case 'did_lose_product':
                return tc.didLoseProduct;
            case 'did_meeting':
                return tc.didMeeting;
            case 'did_post':
                return tc.didPost;
            case 'will_call':
                return tc.willCall;
            case 'will_mail':
                return tc.willEmail;
            case 'will_email':
                return tc.willEmail;
            case 'will_meeting':
                return tc.willMeeting;
            case 'will_post':
                return tc.willPost;

            default:
                return activity;
        }
    },
    getPreposition: (activity) => {
        switch (activity) {
            case 'call':
                return tc.to;
            case 'did_call':
                return tc.to;
            case 'will_call':
                return tc.to;
            case 'mail':
                return tc.to;
            case 'did_mail':
                return tc.to;
            case 'will_mail':
                return tc.to;
            case 'email':
                return tc.to;
            case 'will_email':
                return tc.to;
            case 'did_post':
                return tc.to;
            case 'will_post':
                return tc.to;
            case 'ofofer':
                return tc.to;
            case 'meeting':
                return tc.with;
            case 'testrider':
                return tc.with;
            case 'analysis':
                return tc.for;
            case 'valuation':
                return tc.for;
            case 'visit':
                return tc.at;
            default:
                return tc.regarding;
        }
    },
};
