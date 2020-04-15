import React from 'react';
import EventsCalendar from 'components/logged_in/content/shared/events_calendar';
import News from './news';

export default () => {
    return (
        <div className='homeWrapper'>
            <News />
            <EventsCalendar />
        </div>
    );
}
