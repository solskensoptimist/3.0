import React, {useState} from 'react';
import EventsCalendar from './events_calendar';
import EventsFlow from './events_flow';

/**
 * Render events.
 * Can display all events (I.E. planned activities and activities that have an overdue date but is not completed).
 * Can also filter events on a target, or by filter.
 * Can switch between calendar view and flow view.
 *
 * @param props.small (optional) -  bool- set to true when we want to display <EventsFlow> in a smaller embedded form.
 * @param props.target (optional) -  string - when displaying events for specific deal/prospect.
 * @param props.type - string - Determines if we get events based on target or filter.
 * @param props.view (optional) - string- 'calendar' or 'flow', defaults to <EventsFlow>.
 */
export default (props) => {
    const [view, setView] = useState(props.view);

    switch (view) {
        case 'calendar':
            return <EventsCalendar setView={setView} target={props.target} type={props.type}/>;
        case 'flow':
            return <EventsFlow setView={setView} small={props.small} target={props.target} type={props.type}/>;
        default:
            return <EventsFlow setView={setView} small={props.small} target={props.target} type={props.type}/>;
    }
}
