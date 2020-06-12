import {store} from 'store';
import {request, requestWithBody} from 'helpers';
import {eventsActionTypes} from './actions';
import {getActivity} from 'store/activity/tasks'
import _ from 'underscore';
import moment from 'moment';

/**
 * Complete an event.
 * (I.E. create an activity/deal action and remove the event from deal object.)
 *
 * @param payload.eventId
 */
export const completeEvent = async (payload) => {
    try {
        if (!payload || (payload && !payload.eventId)) {
            return console.error('Missing params in completeEvent');
        }

        const event = store.getState().events.events.find((num) => {
            return num._id === payload.eventId;
        });

        if (!event || (event && !event.action) || (event && !event.dealId)) {
            return console.error('Could not find event in completeEvent');
        }

        const action = await request({
            data: {
                action: event.action,
                comment: (event.comment) ? event.comment : '',
                dealId: event.dealId,
            },
            method: 'post',
            url: '/deals/actions/',
        });

        if (action && action instanceof Error) {
            return console.error('Error in completeEvent');
        }

        return await removeEvent({dealId: event.dealId, eventId: payload.eventId});
    } catch(err) {
        return console.error('Error in completeEvent:', err);
    }
};

/**
 * Get events main func.
 *
 * @param payload.type - string - Can be 'all' | 'filter' | 'last' | 'target'.
 * @param payload.calendar (optional) - object - Used when going back/forward in calendar. Defaults to current month. Specify year and month, {year: 2020, month: 4}.
 * @param payload.target - string - Only required/working when type === 'target'. Can be prospect id or deal id.
 */
export const getEvents = async (payload) => {
    if (payload.type !== 'last') {
        // Save search.
        store.dispatch({type: eventsActionTypes.SET_LAST_SEARCH, payload: payload});
    }

    try {
        switch (payload.type) {
            case 'all':
                return await getEventsAll({calendar: payload.calendar || {}});
            case 'filter':
                return await getEventsByFilter({calendar: payload.calendar || {}});
            case 'last':
                const lastSearch = (store.getState().events.lastSearch) ? store.getState().events.lastSearch : null;
                if (lastSearch) {
                    return await getEvents(lastSearch);
                } else {
                    return console.error('No last search in getEvents');
                }
            case 'target':
                return await getEventsByTarget({calendar: payload.calendar || {}, target: payload.target});
            default:
                return await getEventsAll({calendar: payload.calendar || {}});
        }
    } catch (err) {
        console.error('Error in getEvents:\n' + err);
    }
};

/**
 * Get all events for logged in user.
 *
 * @param payload.calendar (optional) - object - When going back/forward in calendar.
 */
const getEventsAll = async (payload) => {
    try {
        const data = await request({
            data: {
                excludePhases: ['trash'],
                lists: null,
                users: null,
            },
            method: 'get',
            url: '/deals/events/',
        });

        // We now have all deals that have events.
        let deals = (data && data.length && !(data instanceof Error)) ? data : [];

        const result = mapEvents({
            calendar: payload.calendar,
            deals: deals,
        });

        return store.dispatch({type: eventsActionTypes.SET_EVENTS, payload: {
                events: result.events,
                eventsByMonth: result.eventsByMonth,
            }
        });
    } catch (err) {
        return console.error('Error in getEventsByTarget:\n' + err);
    }
};


/**
 * Get events by filter.
 *
 * @param payload.calendar (optional) - object - Used when going back/forward in calendar. Defaults to current month. Specify year and month, {year: 2020, month: 4}.
 */
const getEventsByFilter = async (payload) => {
    try {
        const filter = store.getState().filter;

        const data = await request({
            data: {
                excludePhases: ['trash'],
                lists: filter.lists,
                users: filter.users,
            },
            method: 'get',
            url: '/deals/events/',
        });

        // We now have all deals that have events.
        let deals = (data && data.length && !(data instanceof Error)) ? data : [];

        const result = mapEvents({
            calendar: payload.calendar,
            date: filter.date,
            deals: deals,
        });

        return store.dispatch({type: eventsActionTypes.SET_EVENTS, payload: {
                events: result.events,
                eventsByMonth: result.eventsByMonth,
            }
        });
    } catch (err) {
        return console.error('Error in getEventsByFilter:\n' + err);
    }
};

/**
 * Get events based on target id.
 *
 * @param payload.all (optional) - bool - When we dont want to filter on a
 * @param payload.calendar (optional) - object - Used when going back/forward in calendar. Defaults to current month. Specify year and month, {year: 2020, month: 4}.
 * @param payload.target - string - prospect id or deal id.
 */
const getEventsByTarget = async (payload) => {
    try {
        if (!payload || (payload && !payload.target)) {
            return console.error('Missing target in getEventsByTarget');
        }
        let dealId = '';
        let prospectId;

        if (payload.target.length > 14) {
            dealId = payload.target;
        } else {
            prospectId = payload.target;
        }

        const data = await request({
            data: {
                excludePhases: ['trash'],
                lists: null,
                users: null,
            },
            method: 'get',
            url: '/deals/events/' + dealId, // If target is deal id, we add this to url.
        });

        // We now have all deals that have events.
        let deals = (data && data.length && !(data instanceof Error)) ? data : [];

        // If target is prospect id, we filter results.
        if (prospectId) {
            deals = deals.filter((num) => {
                return (num && num.prospects && num.prospects.includes(prospectId));
            });
        }

        const result = mapEvents({
            calendar: payload.calendar,
            deals: deals,
        });

        return store.dispatch({type: eventsActionTypes.SET_EVENTS, payload: {
                events: result.events,
                eventsByMonth: result.eventsByMonth,
            }
        });
    } catch (err) {
        return console.error('Error in getEventsByTarget:\n' + err);
    }
};

/**
 * Receive deals array and return eventsByMonth object and events array.
 *
 * @param payload.deals
 * @param payload.calendar.month (optional) - Only affects eventsByMonth
 * @param payload.calendar.year (optional) - Only affects eventsByMonth
 * @param payload.date.from (optional) - Affects events and eventsByMonth
 * @param payload.date.to (optional) - Affects events and eventsByMonth
 */
const mapEvents = (payload) => {
    // Set calendar month and year.
    const monthInScope = (payload.calendar && payload.calendar.month) ? payload.calendar.month : moment(new Date()).format('M');
    const yearInScope = (payload.calendar && payload.calendar.year) ? payload.calendar.year : moment(new Date()).format('YYYY');

    // Create events array, start by getting all events from deals array.
    let events = payload.deals.reduce((memo, num) => {
        return memo.concat(
            num.events.map((event) => Object.assign(event, {
                name : num.name,
                dealId : num._id,
                prospects: num.prospects,
                user: num.userName,
                user_id: num.user_id,
            }))
        );
    }, []);

    // Second, filter on dates.
    if (payload.date && payload.date.from && payload.date.to) {
        events = events.filter((num) => {
            return (new Date(num.event_date) > new Date(payload.date.from) && new Date(num.event_date) < new Date(payload.date.to));
        });
    }

    // Finish by sorting on latest.
    events = events.sort((a, b) => {
        return (new Date(a.event_date) > new Date(b.event_date)) ? 1 : -1;
    });

    // Map eventsByMonth.month object, start by setting start and end points.
    const startDate = moment(new Date(yearInScope + '-' + monthInScope));
    const endDate = moment(new Date(yearInScope + '-' + monthInScope)).add(1, 'month');

    // Second, create object that has property for every valid event date.
    const eventsObject = _.groupBy(events, (num) => {
        const date = moment(new Date(num.event_date));
        const year = date.format('YYYY');
        const month = date.format('M');
        const day = date.format('DD');
        return '' + year + '-' + month + '-' + day;
    });

    // Finish by creating an object for whole month...
    let monthObject = {};
    let currentDate : any = startDate;
    // ...iterate every day in month, add events and date information appropriately.
    while (currentDate < endDate) {
        const day = moment(currentDate, 'YYYYMMDD').format('DD');
        const dateString = '' + yearInScope + '-' + monthInScope + '-' + day;
        const dateObject = {
            date: day,
            week: moment(currentDate, 'YYYYMMDD').week(),
            weekday: moment(currentDate, 'YYYYMMDD').format('dddd'),
        };

        monthObject[dateString] = eventsObject.hasOwnProperty(dateString) ? {
            date: dateObject,
            events: eventsObject[dateString]
        } : {
            date: dateObject,
            events: []
        };

        currentDate = currentDate.add(1, 'day');
    }

    return {
        events: events,
        eventsByMonth: {
            month: monthObject,
            monthInScope: Number(monthInScope),
            yearInScope: Number(yearInScope),
        }
    }
};

/**
 * Remove an event.
 *
 * @param payload.dealId
 * @param payload.eventId
 */
export const removeEvent = async (payload) => {
    if (!payload || (payload && !payload.dealId) || (payload && !payload.eventId)) {
        return console.error('Missing params in removeEvent');
    }

    try {
        const data = await requestWithBody({
            data: {
                dealId: payload.dealId,
                eventId: payload.eventId,
            },
            method: 'delete',
            url: '/deals/events/',
        });

        if (data && data instanceof Error) {
            return console.error('Error in removeEvent:\n' + data);
        }

        // Update activities and events
        await getActivity({type: 'last'});
        await getEvents({type: 'last'});

        return;
    } catch(err) {
        return console.error('Error in removeEvent:', err);
    }
};
