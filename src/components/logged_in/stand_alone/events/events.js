import React, {useState} from 'react';
import EventsCalendar from './events_calendar';
import EventsFlow from './events_flow';

/**
 * Render events, I.E. all planned activities and activities that have date that is overdue but is not completed.
 * Can switch between calendar view and flow view.
 */
export default (props) => {
    const [view, setView] = useState(props.view);

    if (view === 'calendar') {
        return <EventsCalendar setView={setView}/>
    } else {
        return <EventsFlow setView={setView}/>
    }
}
