import React, {useState} from 'react';
import {tc} from 'helpers';
import Comment from 'components/logged_in/comment';
import Icon from 'components/shared/icon';
import Popup from 'components/shared/popup';
import Tooltip from 'components/shared/tooltip';

/**
 * Render an activity row for Activities component.
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
            {showEditComment && <Popup close={()=> {setShowEditComment(false)}} size='small'><Comment close={()=> {setShowEditComment(false)}} id={props.id} type='edit'/></Popup>}
            {showRemoveComment && <Popup close={()=> {setShowRemoveComment(false)}} size='small'><Comment close={()=> {setShowEditComment(false)}} id={props.id} type='remove'/></Popup>}
        </div>
    );
};
