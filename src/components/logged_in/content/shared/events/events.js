import React from 'react';
import EventsCalendar from './events_calendar';

export default (props) => {
    switch (props.type) {
        case 'calendar':
            return <EventsCalendar/>;
        default:
            return <EventsCalendar/> // Byt till events.
    }
}
