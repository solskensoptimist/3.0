import {store} from 'store';
import {request} from 'helpers';
import {eventsActionTypes} from './actions';
import {getActivityByFilter, getActivityByTarget} from 'store/activity/tasks'
import _ from 'underscore';
import moment from 'moment';

/**
 * Complete an event.
 *
 * @param payload.eventId
 */
export const completeEvent = async (payload) => {
    if (!payload || (payload && !payload.eventId)) {
        return console.error('Missing params in completeEvent');
    }

    const event = store.getState().events.eventsFlow.find((num) => {
        return num._id === payload.eventId;
    });

    if (!event || (event && !event.action) || (event && !event.dealId)) {
        return console.error('Could not find event in completeEvent');
    }

    try {
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
 * Get events for one month.
 * If no date is given, return events for current month.
 * Can return events for specific deal, prospect id, lists and/or users.
 *
 * @param payload.date (optional) - object - Defaults to one month from today. Specify year and month, {year: 2020, month: 4}.
 * @param payload.dealId (optional) - string - Retrieve events for one specific deal.
 * @param payload.lists (optional) - array - Retrieve events for all users in all lists.
 * @param payload.prospectId (optional) - string - Retrieve events for a specific prospect id.
 * @param payload.users (optional) - array - Users to retrieve events for, defaults to current logged in user.
 */
export const getEventsCalendar = async (payload) => {
    const dealId = (payload && payload.dealId) ? payload.dealId : null;

    try {
        const data = await request({
            data: {
                excludePhases: ['trash'],
                lists: (payload && payload.lists) ? payload.lists : null,
                users: (payload && payload.users) ? payload.users : null,
            },
            method: 'get',
            url: '/deals/events/' + dealId,
        });

        // We now have all deals that have events.
        let deals = (data && data.length && !(data instanceof Error)) ? data : [];

        if (payload && payload.prospectId) {
            deals = deals.filter((num) => {
                return (num && num.prospects && num.prospects.includes(payload.prospectId));
            });
        }

        const dateYear = (payload && payload.date && payload.date.year) ?
            payload.date.year :
            moment(new Date()).format('YYYY');

        const dateMonth = (payload && payload.date && payload.date.month) ?
            payload.date.month :
            moment(new Date()).format('M');

        // Current month.
        const startDate = moment(new Date(dateYear + '-' + dateMonth));
        const endDate = moment(new Date(dateYear + '-' + dateMonth)).add(1, 'month');

        // New array with all events collected.
        const events = deals.reduce((memo, num) => {
            return memo.concat(
                num.events.map((event) => Object.assign(event, {
                    name : num.name,
                    dealId : num._id,
                    prospects: num.prospects,
                    user: num.userName,
                }))
            );
        }, []);

        // Create object that has property for every valid event date.
        const eventsObject = _.groupBy(events, (num) => {
            const date = moment(new Date(num.event_date));
            const year = date.format('YYYY');
            const month = date.format('M');
            const day = date.format('DD');
            return '' + year + '-' + month + '-' + day;
        });

        // Create object for every day of month...
        let monthObject = {};
        let currentDate : any = startDate;
        // ...iterate every day in month, add events and date information appropriately.
        while (currentDate < endDate) {
            const day = moment(currentDate, 'YYYYMMDD').format('DD');
            const dateString = '' + dateYear + '-' + dateMonth + '-' + day;
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

        const result = {
            month: monthObject,
            monthInScope: Number(dateMonth),
            yearInScope: Number(dateYear),
        };

        return store.dispatch({type: eventsActionTypes.SET_EVENTS_CALENDAR, payload: result});
    } catch (err) {
        return console.error('Error in getEventsCalendar:\n' + err);
    }
};


/**
 * Get all events by given arguments.
 * Can return events for specific deal, prospect id, lists and/or users.
 *
 * @param payload.dealId (optional) - string - Retrieve events for one specific deal.
 * @param payload.lists (optional) - array - Retrieve events for all users in all lists.
 * @param payload.prospectId (optional) - string - Retrieve events for a specific prospect id.
 * @param payload.users (optional) - array - Users to retrieve events for, defaults to current logged in user.
 */
export const getEventsFlow = async (payload) => {
    const dealId = (payload && payload.dealId) ? payload.dealId : null;

    try {
        const data = await request({
            data: {
                excludePhases: ['trash'],
                lists: (payload && payload.lists) ? payload.lists : null,
                users: (payload && payload.users) ? payload.users : null,
            },
            method: 'get',
            url: '/deals/events/' + dealId,
        });

        // We now have all deals that have events.
        let deals = (data && data.length && !(data instanceof Error)) ? data : [];

        if (payload && payload.prospectId) {
            deals = deals.filter((num) => {
                return (num && num.prospects && num.prospects.includes(payload.prospectId));
            });
        }

        // New array with all events collected.
        let result = deals.reduce((memo, num) => {
            return memo.concat(
                num.events.map((event) => Object.assign(event, {
                    name : num.name,
                    dealId : num._id,
                    prospects: num.prospects,
                    user: num.userName,
                }))
            );
        }, []);

        result = result.sort((a, b) => {
            return (new Date(a.event_date) > new Date(b.event_date)) ? 1 : -1;
        });

        return store.dispatch({type: eventsActionTypes.SET_EVENTS_FLOW, payload: result});
    } catch (err) {
        return console.error('Error in getEventsCalendar:\n' + err);
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
        const event = await request({
            data: {
                dealId: payload.dealId,
                eventId: payload.eventId,
            },
            method: 'delete',
            url: '/deals/events/',
        });

        if (event && event instanceof Error) {
            return console.error('Error in removeEvent');
        }

        await getActivityByFilter();
        await getActivityByTarget({});

        return;
    } catch(err) {
        return console.error('Error in removeEvent:', err);
    }
};
