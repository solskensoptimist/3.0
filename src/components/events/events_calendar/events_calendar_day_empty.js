import React from 'react';

/**
 * Render empty day for EventsCalendar component.
 */
export default () => {
    return (
        <div className='dayWrapper empty'>
            <div className='day'>
                <div className='day__date'/>
            </div>
        </div>
    );
}
