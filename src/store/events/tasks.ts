import {store} from 'store';
import {request} from 'helpers';
import {eventsActionTypes} from './actions';
import _ from 'underscore';

const weekdayMap = {
    0: 'Måndag',
    1: 'Tisdag',
    2: 'Onsdag',
    3: 'Torsdag',
    4: 'Fredag',
    5: 'Lördag',
    6: 'Söndag',
};

/**
 * Get all non expired events for user. If dealId is set, returns events for that deal.
 *
 * @param payload.date (optional) - object - Defaults to one month from today. Specify year and month, {year: 2020, month: 4}.
 * @param payload.lists (optional) - array - Retrieve events for all users in every list.
 * @param payload.users (optional) - array - Users to retrieve events for, defaults to current logged in user.
 */
export const getEvents = async (payload) => {
    request({
        data: {
            excludePhases: ['trash'],
            lists: (payload && payload.lists) ? payload.lists : null,
            users: (payload && payload.users) ? payload.users : null,
        },
        method: 'get',
        url: '/deals/events',
    })
    .then((data) => {
        // All deals that have events.
        const deals = (data && data.length) ? data : [];

        const dateYear = (payload && payload.date && payload.date.year) ?
            payload.date.year :
            new Date().getFullYear();

        const dateMonth = (payload && payload.date && payload.date.month) ?
            payload.date.year :
            (new Date().getMonth() + 1); // We want january as 1, not 0.

        // Current month.
        const startDate = new Date(dateYear + '-' + dateMonth);
        const endDate = new Date(dateYear + '-' + (dateMonth + 1));

        // New array with all events collected.
        let events = deals.reduce((memo, num) => {
            return memo.concat(
                num.events.map((event) => Object.assign(event, {
                    name : num.name,
                    dealId : num._id,
                }))
            );
        }, []);

        // Object with events.
        const eventsObject = _.chain(events)
        .filter((num) => {
            return (new Date(num.event_date) > startDate && new Date(num.event_date) < endDate);
        })
        .groupBy((num) => {
            const date = new Date(num.event_date);
            const year = '' + date.getFullYear();
            const month = '' + (date.getMonth() + 1); // We want january as 1, not 0.
            const day = '' + date.getDate();
            return year + month + day;
        })
        .value();

        // Create object for every day of month...
        let monthObject = {};
        let currentDate : any = startDate;
        // ...iterate every day in month, add events and date information appropriately.
        while (currentDate < endDate) {
            let day = '' + currentDate.getDate();
            if (day.length === 1) {
                day = '0' + day;
            }
            const dateString = '' + dateYear + dateMonth + day;

            const dateObject = {
                date: (new Date(currentDate).getDate().toString().length === 1) ? '0' + new Date(currentDate).getDate().toString() : new Date(currentDate).getDate().toString(),
                week: 12,
                weekday: weekdayMap[new Date(currentDate).getDay()],
            };

            monthObject[dateString] = eventsObject.hasOwnProperty(dateString) ? {
                date: dateObject,
                events: eventsObject[dateString]
            } : {
                date: dateObject,
                events: []
            };

            currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
        }

        // We're done.
        const result = {
            events: {...events},
            month: monthObject
        };

        return store.dispatch({ type: eventsActionTypes.SET_EVENTS, payload: result });
    })
    .catch((err) => {
        return console.error('Error in getEvents:', err);
    });
};
