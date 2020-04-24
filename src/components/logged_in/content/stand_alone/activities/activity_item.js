import React from 'react';
import {tc} from 'helpers';
import Icon from 'components/shared/icon';

export default (props) => {
    // Only edit comment activities (at least for now).
    const _editCommentOnActivity = () => {
        console.log('Edit comment on id', props.id);
    };

    // Only remove comment activities (at least for now).
    const _removeCommentActivity = () => {
        console.log('Remove id', props.id);
    };

    return (
        <div className='activitiesWrapper__activities__content__itemWrapper'>
            <div className='activitiesWrapper__activities__content__itemWrapper__item'>
                <div className='activitiesWrapper__activities__content__itemWrapper__item__icon'><span className='iconHolder'>{props.icon}</span></div>
                <div className='activitiesWrapper__activities__content__itemWrapper__item__date'><span className='label'>{tc.time}:</span>{props.date}</div>
                <div className='activitiesWrapper__activities__content__itemWrapper__item__action'><span className='label'>{tc.action}:</span>{props.action}</div>
                <div className='activitiesWrapper__activities__content__itemWrapper__item__comment'><span className='label'>{tc.comment}:</span>{props.comment}</div>
                <div className='activitiesWrapper__activities__content__itemWrapper__item__user'><span className='label'>{tc.user}:</span>{props.user}</div>
                <div className='activitiesWrapper__activities__content__itemWrapper__item__edit'>
                    {props.isEditable && <Icon val='edit' onClick={_editCommentOnActivity}/>}
                    {props.isRemovable && <Icon val='remove' onClick={_removeCommentActivity}/>}
                </div>
            </div>
        </div>
    );
};
