import React, {useState} from 'react';
import {tc} from 'helpers';
import Comment from 'components/comment';
import Icon from 'components/icon';
import Tooltip from 'components/tooltip';

/**
 * Render an activity row for Activities component.
 *
 * @param props.action - string/element
 * @param props.comment - string
 * @param props.date - string
 * @param props.icon - element
 * @param props.id - string
 * @param props.isEditable - bool
 * @param props.standAlone  bool (optional)
 * @param props.user - object
 */
export default (props) => {
    const [showEditComment, setShowEditComment] = useState(false);
    const [showRemoveComment, setShowRemoveComment] = useState(false);

    if (props.standAlone === true) {
        // Return a stand alone component, no labels or editing possibilities.
        return (
            <div className='activityItemWrapper'>
                <div className='activityItemWrapper__activityItem'>
                    <div className='activityItemWrapper__activityItem__left'>
                        {props.icon}
                    </div>
                    <div className='activityItemWrapper__activityItem__right'>
                        <div className='activityItemWrapper__activityItem__right__top'>
                            <div className='activityItemWrapper__activityItem__right__top__user'>{props.user} - </div>
                            <div className='activityItemWrapper__activityItem__right__top__date'>{props.date}</div>
                        </div>
                        <div className='activityItemWrapper__activityItem__right__bottom'>
                            {(props.action.props && props.action.props.children !== tc.comment) ?
                                <div className='activityItemWrapper__activityItem__right__bottom__action'>{props.action}</div>
                                : null
                            }
                            <div className='activityItemWrapper__activityItem__right__bottom__comment'>{props.comment}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        // Or return as sub component of Activities component.
        return (
            <div className='activitiesWrapper__activities__content__itemWrapper'>
                <div className='activitiesWrapper__activities__content__itemWrapper__item'>
                    <div className='activitiesWrapper__activities__content__itemWrapper__item__icon'><span className='iconHolder'>{props.icon}</span></div>
                    <div className='activitiesWrapper__activities__content__itemWrapper__item__date'><span className='label'>{tc.time}:</span>{props.date}</div>
                    <div className='activitiesWrapper__activities__content__itemWrapper__item__action'><span className='label'>{tc.action}:</span>{props.action}</div>
                    <div className='activitiesWrapper__activities__content__itemWrapper__item__comment'><span className='label'>{tc.comment}:</span>{props.comment}</div>
                    <div className='activitiesWrapper__activities__content__itemWrapper__item__user'><span className='label'>{tc.user}:</span>{props.user}</div>
                    <div className='activitiesWrapper__activities__content__itemWrapper__item__edit'>
                        {props.isEditable && <Tooltip horizontalDirection='left' tooltipContent={tc.edit}><Icon val='edit' onClick={() => {setShowEditComment(true)}}/></Tooltip> }
                        {props.isEditable && <Tooltip horizontalDirection='left' tooltipContent={tc.remove}><Icon val='remove' onClick={() => {setShowRemoveComment(true)}}/></Tooltip>}
                    </div>
                </div>
                {showEditComment && <Comment close={()=> {setShowEditComment(false)}} id={props.id} type='edit'/>}
                {showRemoveComment && <Comment close={()=> {setShowRemoveComment(false)}} id={props.id} type='remove'/>}
            </div>
        );
    }
};
