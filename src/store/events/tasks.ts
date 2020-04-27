import {store} from 'store';
import {request} from 'helpers';
import {eventsActionTypes} from './actions';
import _ from 'underscore';
import moment from 'moment';

/**
 * Get all non expired events for user. If dealId is set, returns events for that deal.
 *
 * @param payload.date (optional) - object - Defaults to one month from today. Specify year and month, {year: 2020, month: 4}.
 * @param payload.dealId (optional) - string - Retrieve events for one specific deal.
 * @param payload.lists (optional) - array - Retrieve events for all users in all lists.
 * @param payload.prospectId (optional) - string - Retrieve events for a specific prospect id.
 * @param payload.users (optional) - array - Users to retrieve events for, defaults to current logged in user.
 */
export const getEvents = async (payload) => {
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
        let deals = (data && data.length && !(data instanceof Error)) ? data : null;

        if (!deals) {
            return;
        }

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
        let events = deals.reduce((memo, num) => {
            return memo.concat(
                num.events.map((event) => Object.assign(event, {
                    name : num.name,
                    dealId : num._id,
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
            events: events,
            month: monthObject,
            monthInScope: Number(dateMonth),
            yearInScope: Number(dateYear),
        };

        return store.dispatch({ type: eventsActionTypes.SET_EVENTS, payload: result });
    } catch (err) {
        return console.error('Error in getEvents:\n' + err);
    }
};
