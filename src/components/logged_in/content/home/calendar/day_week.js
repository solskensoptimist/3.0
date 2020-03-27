import React, {useEffect, useRef} from 'react';
import activityHelper from 'shared_helpers/activity_helper';
import {NavLink} from 'react-router-dom';

/**
 * Render one day, called from calendar when in week mode.
 *
 * props.date - {date, weekday, week}
 * props.events - array - [{ _id, action, dealId, name, (...) }, {(...)}]
 * props.hasPassed - bool
 * props.isToday - bool
 */
export default (props) => {
    const elementRef = useRef(null);

    const events = (props.events && props.events.length) ? props.events.map((num) => {
        const icon = activityHelper.getIconsByActivity(num.action);
        const event = activityHelper.getReadableActivity(num.action);

        let fillerText = 'med';
        if (icon === 'fa-phone' || icon === 'fa-envelope' || icon === 'fa-pencil') {
            fillerText = 'till';
        }
        if (icon === 'fa-users') {
            fillerText = 'hos';
        }

        return (
            <div key={num._id} className='day__content__events__event'>
                <NavLink to={'/affar/' + num.dealId} key='affar'>
                    <div className='day__content__events__event__icon'>
                        <i className={'fa ' + icon} />
                    </div>
                    <div key={num._id} className='day__content__events__event__info'>
                        <p><span className='highlight'>{event}</span> {fillerText} {num.name}</p>
                        <i className='fas fa-chevron-right' />
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
