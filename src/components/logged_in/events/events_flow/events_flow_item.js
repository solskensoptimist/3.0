import React from 'react';
import {tc} from 'helpers';
import moment from 'moment';
import Icon from 'components/shared/icon';
import Tooltip from 'components/shared/tooltip';

/**
 * Render an event row for EventsFlow component.
 */
export default (props) => {

    const _additionalClass = () => {
        const diff = moment(props.date).diff(new Date(), 'days');
        if (diff < 7 && diff > 1) {
            return 'yellow';
        } else if (diff < 1) {
            return 'green';
        } else if (diff < 0) {
            return 'red';
        }
    };

    const _completeEvent = () => {

    };

    const _editCommentOnEvent = () => {

    };

    const _removeEvent = () => {

    };

    return (
        <div className={'eventsFlowWrapper__eventsFlow__content__itemWrapper ' + _additionalClass()}>
            <div className='eventsFlowWrapper__eventsFlow__content__itemWrapper__item'>
                <div className='eventsFlowWrapper__eventsFlow__content__itemWrapper__item__icon'><span className='iconHolder'>{props.icon}</span></div>
                <div className='eventsFlowWrapper__eventsFlow__content__itemWrapper__item__date'><span className='label'>{tc.time}:</span>{props.date}</div>
                <div className='eventsFlowWrapper__eventsFlow__content__itemWrapper__item__action'><span className='label'>{tc.action}:</span>action</div>
                <div className='eventsFlowWrapper__eventsFlow__content__itemWrapper__item__comment'><span className='label'>{tc.comment}:</span>{props.comment}</div>
                <div className='eventsFlowWrapper__eventsFlow__content__itemWrapper__item__user'><span className='label'>{tc.user}:</span>{props.user}</div>
                <div className='eventsFlowWrapper__eventsFlow__content__itemWrapper__item__edit'>
                    {<Tooltip horizontalDirection='left' tooltipContent={tc.complete}><Icon val='complete' onClick={_completeEvent}/></Tooltip>}
                    {<Tooltip horizontalDirection='left' tooltipContent={tc.remove}><Icon val='remove' onClick={_removeEvent}/></Tooltip>}
                </div>
            </div>
        </div>
    );
};
