import React, {useState} from 'react';
import EventsCalendar from './events_calendar';
import EventsFlow from './events_flow';

/**
 * Render events.
 * Can display all events (I.E. planned activities and activities that have an overdue date but is not completed).
 * Can also filter events on deal id or prospect id.
 * Can switch between calendar view and flow view.
 *
 * @param props.dealId - string - when displaying events for specific deal
 * @param props.prospectI -  string - when displaying events for specific prospect
 * @param props.small (optional) -  bool- set to true when we want to display <EventsFlow> in a smaller embedded form
 * @param props.view (optional) - string- 'calendar' or 'flow', defaults to <EventsFlow>.
 */
export default (props) => {
    const [view, setView] = useState(props.view);
    const dealId = (props && props.dealId) ? props.dealId : null;
    const prospectId = (props && props.prospectId) ? props.prospectId : null;

    switch (view) {
        case 'calendar':
            return <EventsCalendar dealId={dealId} prospectId={prospectId} setView={setView}/>;
        case 'flow':
            return <EventsFlow dealId={dealId} prospectId={prospectId} setView={setView} small={props.small}/>;
        default:
            return <EventsFlow dealId={dealId} prospectId={prospectId} setView={setView} small={props.small}/>;
    }
}
