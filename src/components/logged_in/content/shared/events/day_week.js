import React, {useEffect, useRef} from 'react';
import {NavLink} from 'react-router-dom';
import Icon from 'components/shared/icon';
import {activityHelper} from 'helpers';

/**
 * Render one day, called from events when in week mode.
 *
 * props.date - {date, weekday, week}
 * props.events - array - [{ _id, action, dealId, name, (...) }, {(...)}]
 * props.hasPassed - bool
 * props.isToday - bool
 */
export default (props) => {
    const elementRef = useRef(null);

    const events = (props.events && props.events.length) ? props.events.map((num) => {
        const icon = <Icon val={num.action} />;
        const event = activityHelper.getReadableActivity(num.action);

        let fillerText = 'med';
        if (num.action === 'call' || num.action === 'did_call' || num.action === 'will_call'||
            num.action === 'mail' || num.action === 'email' || num.action === 'did_mail' || num.action === 'did_email' || num.action === 'will_email' || num.action === 'will_mail' ||
            num.action === 'did_post' || num.action === 'will_post') {
            fillerText = 'till';
        }
        if (num.action === 'visit') {
            fillerText = 'hos';
        }

        return (
            <div key={num._id} className='day__content__events__event'>
                <NavLink to={'/affar/' + num.dealId} key='affar'>
                    <div className='day__content__events__event__icon'>
                        {icon}
                    </div>
                    <div key={num._id} className='day__content__events__event__info'>
                        <p><span className='highlight'>{event}</span> {fillerText} {num.name}</p>
                        <Icon val='navigateNext'/>
                    </div>
                </NavLink>
            </div>)
        ;
    }) : null;

    const classnameWrapper = (props.events && props.events.length) ? 'dayWrapper hasEvent' : 'dayWrapper';
    const classnameDay = (props.hasPassed) ? 'day passed' : 'day';

    useEffect(() => {
        // Scroll to current day.
        if (elementRef && elementRef.current && props.isToday) {
            elementRef.current.scrollIntoView();
            window.scrollTo(0, 0);
        }
    }, [elementRef, props.isToday]);

    return (
        <div className={classnameWrapper} ref={elementRef}>
            <div className={classnameDay}>
                <div className='day__date'>
                    {props.date.date}
                </div>
                <div className='day__content'>
                    <div className='day__content__dateInformation'>
                        <p className='day__content__dateInformation__weekday'>{props.date.weekday}</p>
                        <p className='day__content__dateInformation__week'>Vecka {props.date.week}</p>
                    </div>
                    <div className='day__content__events'>
                        {events}
                    </div>
                </div>
            </div>
        </div>
    );
}
