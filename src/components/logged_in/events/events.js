import React, {useState} from 'react';
import EventsCalendar from './events_calendar';
import EventsFlow from './events_flow';

/**
 * Render events.
 * Can display all events (I.E. planned activities and activities that have an overdue date but is not completed).
 * Can also filter events on deal id or prospect id.
 * Can switch between calendar view and flow view.
 */
export default (props) => {
    const [view, setView] = useState(props.view);
    const dealId = (props && props.dealId) ? props.dealId : null;
    const prospectId = (props && props.prospectId) ? props.prospectId : null;

    if (view === 'calendar') {
        return <EventsCalendar dealId={dealId} prospectId={prospectId} setView={setView}/>
    } else {
        return <EventsFlow dealId={dealId} prospectId={prospectId} setView={setView}/>
    }
}
