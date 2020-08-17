import React from 'react';

/**
 * Render empty day for EventsCalendar component.
 *
 * props.text - string - This component can hold a text string, used to show weekday names.
 */
export default (props) => {
    return (
        <div className='dayWrapper empty'>
            <div className='day'>
                <div className='day__date'>{props.text}</div>
            </div>
        </div>
    );
}
