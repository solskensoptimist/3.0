import React, {useState} from 'react';
import {tc} from 'helpers';
import moment from 'moment';
import EventsFlowItemComplete from './events_flow_item_complete';
import EventsFlowItemRemove from './events_flow_item_remove';
import Icon from 'components/shared/icon';
import Popup from 'components/shared/popup';
import Tooltip from 'components/shared/tooltip';

/**
 * Render an event row for EventsFlow component.
 */
export default (props) => {
    const [showCompleteEvent, setShowCompleteEvent] = useState(false);
    const [showRemoveEvent, setShowRemoveEvent] = useState(false);
    let additionalDateInfo;

    const _additionalClass = () => {
        const diff = moment(new Date(props.date)).diff(new Date(), 'hours');
        if (diff < (7 * 24) && diff > 24) {
            additionalDateInfo = <span className='additionalDate'><Icon val='info'/>{moment(new Date(props.date)).fromNow()}</span>;
            return 'withinAWeek';
        } else if (diff < 24 && diff >= 0) {
            additionalDateInfo = <span className='additionalDate'><Icon val='info'/>{moment(new Date(props.date)).fromNow()}</span>;
            return 'withinADay';
        } else if (diff < 0) {
            additionalDateInfo = <span className='additionalDate'><Icon val='info'/>{moment(new Date(props.date)).fromNow()}</span>;
            return 'passedDate';
        } else {
            return '';
        }
    };

    return (
        <div className={'eventsFlowWrapper__eventsFlow__content__itemWrapper ' + _additionalClass()}>
            <div className='eventsFlowWrapper__eventsFlow__content__itemWrapper__item'>
                <div className='eventsFlowWrapper__eventsFlow__content__itemWrapper__item__icon'><span className='iconHolder'>{props.icon}</span></div>
                <div className='eventsFlowWrapper__eventsFlow__content__itemWrapper__item__date'>
                    <span><span className='label'>{tc.time}:</span>{moment(props.date).format('LL HH:mm')}</span>
                    {additionalDateInfo}
                </div>
                <div className='eventsFlowWrapper__eventsFlow__content__itemWrapper__item__action'><span className='label'>{tc.action}:</span>{props.action}</div>
                <div className='eventsFlowWrapper__eventsFlow__content__itemWrapper__item__comment'><span className='label'>{tc.comment}:</span>{props.comment}</div>
                <div className='eventsFlowWrapper__eventsFlow__content__itemWrapper__item__user'><span className='label'>{tc.user}:</span>{props.user}</div>
                <div className='eventsFlowWrapper__eventsFlow__content__itemWrapper__item__edit'>
                    {<Tooltip horizontalDirection='left' tooltipContent={tc.complete}><Icon val='complete' onClick={() => {setShowCompleteEvent(true)}}/></Tooltip>}
                    {<Tooltip horizontalDirection='left' tooltipContent={tc.remove}><Icon val='remove' onClick={() => {setShowRemoveEvent(true)}}/></Tooltip>}
                </div>
            </div>
            {showCompleteEvent && <Popup close={() => {setShowCompleteEvent(false)}} size='small'><EventsFlowItemComplete close={() => {setShowCompleteEvent(false)}} eventId={props.eventId}/></Popup>}
            {showRemoveEvent && <Popup close={() => {setShowRemoveEvent(false)}} size='small'><EventsFlowItemRemove close={() => {setShowRemoveEvent(false)}} dealId={props.dealId} eventId={props.eventId}/></Popup>}
        </div>
    );
};
