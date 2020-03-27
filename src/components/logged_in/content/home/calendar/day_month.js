import React, {useEffect, useRef, useState} from 'react';
import ReactDOM from "react-dom";
import activityHelper from 'shared_helpers/activity_helper';
import {NavLink} from 'react-router-dom';
import tc from 'text_content';

/**
 * Render one day, called from calendar when in month mode.
 *
 * props.date - {date, weekday, week}
 * props.events - array - [{ _id, action, dealId, name, (...) }, {(...)}]
 * props.hasPassed - bool
 * props.isToday - bool
 */
export default (props) => {
    const [showEvents, setShowEvents] = useState(false);
    const eventsRef = useRef(null);
    const classnameWrapper = (props.events && props.events.length) ? 'dayWrapper hasEvent' : 'dayWrapper';
    const classnameDay = (props.hasPassed) ? 'day passed' : 'day';

    const _closeEvents = () => {
        setShowEvents(false);
    };

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
            <div key={num._id} className='dayWrapper__eventsWrapper__events__event'>
                <NavLink to={'/affar/' + num.dealId} key='affar'>
                    <div className='dayWrapper__eventsWrapper__events__event__icon'>
                        <i className={'fa ' + icon} />
                    </div>
                    <div key={num._id} className='dayWrapper__eventsWrapper__events__event__info'>
                        <p><span className='highlight'>{event}</span> {fillerText} {num.name}</p>
                        <i className='fas fa-chevron-right' />
                    </div>
                </NavLink>
            </div>)
            ;
    }) : null;

    const _openEvents = () => {
        if (props && props.events && props.events.length) {
            setShowEvents(true);
        }
    };

    useEffect(() => {
        /**
         * When clicking outside events box, close it.
         */
        const _unmountEvents = (e) => {
            if (eventsRef && eventsRef.current) {
                const node = ReactDOM.findDOMNode(eventsRef.current);
                if (node && !node.contains(e.target)) {
                    _closeEvents();
                }
            }
        };

        window.addEventListener('mousedown', _unmountEvents);
        return () => window.removeEventListener('mousedown', _unmountEvents);
    }, []);

    return (
        <div className={classnameWrapper} onClick={_openEvents}>
            {showEvents &&
                <div className='dayWrapper__eventsWrapper' ref={eventsRef}>
                    <div className='dayWrapper__eventsWrapper__events'>
                        <h4>{(props.events && props.events.length && props.events.length > 1) ? tc.activities : tc.activity}</h4>
                        {events}
                    </div>
                </div>
            }
            <div className={classnameDay}>
                <div className='day__date'>
                    {props.date.date}
                </div>
            </div>
        </div>
    );
}
