import React, {useState} from 'react';
import {tc} from 'helpers';
import Comment from 'components/comment';
import Icon from 'components/icon';
import Tooltip from 'components/tooltip';

/**
 * Render an activity row for Activities component.
 *
 * @param props.action
 * @param props.comment
 * @param props.date
 * @param props.icon
 * @param props.id
 * @param props.isEditable
 * @param props.isRemovable
 * @param props.user
 */
export default (props) => {
    const [showEditComment, setShowEditComment] = useState(false);
    const [showRemoveComment, setShowRemoveComment] = useState(false);

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
                    {props.isRemovable && <Tooltip horizontalDirection='left' tooltipContent={tc.remove}><Icon val='remove' onClick={() => {setShowRemoveComment(true)}}/></Tooltip>}
                </div>
            </div>
            {showEditComment && <Comment close={()=> {setShowEditComment(false)}} id={props.id} type='edit'/>}
            {showRemoveComment && <Comment close={()=> {setShowRemoveComment(false)}} id={props.id} type='remove'/>}
        </div>
    );
};
