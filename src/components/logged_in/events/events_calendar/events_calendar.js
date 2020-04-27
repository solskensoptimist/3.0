import React, {useEffect, useState} from 'react';
import {tc} from 'helpers';
import {connect} from "react-redux";
import EventsCalendarDay from './events_calendar_day';
import EventsCalendarDayEmpty from './events_calendar_day_empty';
import Loading from 'components/shared/loading';
import {getEvents} from 'store/events/tasks';
import moment from 'moment';
import Icon from 'components/shared/icon';
import WidgetHeader from 'components/shared/widget_header';
import Tooltip from 'components/shared/tooltip';

const EventsCalendar = (state) => {
    const [minimize, setMinimize] = useState(false);

    const _renderDays = () => {
        const days = [];

        // First, push empty days to calendar so weekdays get in right position.
        const firstDay = state.events.month[Object.keys(state.events.month)[0]];
        let emptyDays = 0;
        switch (firstDay.date.weekday) {
            case'tisdag':
                emptyDays = 1;
                break;
            case'onsdag':
                emptyDays = 2;
                break;
            case'torsdag':
                emptyDays = 3;
                break;
            case'fredag':
                emptyDays = 4;
                break;
            case'lördag':
                emptyDays = 5;
                break;
            case'söndag':
                emptyDays = 6;
                break;
            default:
                emptyDays = 0;
        }
        for (let index = 0; index < emptyDays; index++) {
            days.push(<EventsCalendarDayEmpty/>);
        }


        // Second, push real days. Also add over box with left or right position.
        let i = 1 + emptyDays;
        const leftDays = [1,2,3,4,8,9,10,11,15,16,17,18,22,23,24,25,29,30,31,32,36,37,38,39];

        for (const day in state.events.month) {
            const hasPassed = moment(new Date()).format('YYYY-MM-DD') > moment(new Date(day)).format('YYYY-MM-DD');
            const isToday = moment(new Date(day)).isSame(new Date(), 'day');
            const position = (leftDays.includes(i)) ? 'left' : 'right'; // First four days of week we want left position.

            days.push(<EventsCalendarDay date={state.events.month[day].date} events={state.events.month[day].events} hasPassed={hasPassed} isToday={isToday} key={day} position={position} />);
            i++;
        }

        return days;
    };

    const _stateCheck = () => {
        return (state.events && state.events.month);
    };

    const _stepBack = () => {
        getEvents({
            date: {
                month: (state.events.monthInScope === 1) ? 12 : state.events.monthInScope - 1,
                year: (state.events.monthInScope === 1) ? state.events.yearInScope - 1 : state.events.yearInScope,
            }
        })
    };

    const _stepForward = () => {
        getEvents({
            date: {
                month: (state.events.monthInScope === 12) ? 1 : state.events.monthInScope + 1,
                year: (state.events.monthInScope === 12) ? state.events.yearInScope + 1 : state.events.yearInScope,
            }
        })
    };

    useEffect(() => {
        getEvents({
            dealId: (state.props && state.props.dealId) ? state.props.dealId : null,
            prospectId: (state.props && state.props.prospectId) ? state.props.prospectId : null,
        });
    }, [state.props]);

    return ( _stateCheck() ?
        <div className='eventsCalendarWrapper'>
            <div className='eventsCalendarWrapper__eventsCalendar'>
                <div className='eventsCalendarWrapper__eventsCalendar__header'>
                    <WidgetHeader
                        dashboard={
                            <>
                                <Tooltip horizontalDirection='left' tooltipContent={tc.eventsCalendar}><Icon val='eventsCalendar' onClick={() => {state.props.setView('calendar')}}/></Tooltip>
                                <Tooltip horizontalDirection='left' tooltipContent={tc.eventsFlow}><Icon val='eventsFlow' onClick={() => {state.props.setView('flow')}}/></Tooltip>
                                <Tooltip horizontalDirection='left' tooltipContent={tc.navigateBefore}><Icon val='navigateBefore' onClick={_stepBack}/></Tooltip>
                                <Tooltip horizontalDirection='left' tooltipContent={tc.navigateNext}><Icon val='navigateNext' onClick={_stepForward}/></Tooltip>
                                {minimize ? <Tooltip horizontalDirection='left' tooltipContent={tc.maximize}><Icon val='maximize' onClick={() => {setMinimize(false)}}/></Tooltip> : <Tooltip horizontalDirection='left' tooltipContent={tc.minimize}><Icon val='minimize' onClick={() => {setMinimize(true)}}/></Tooltip>}
                            </>
                        }
                        iconVal='events'
                        headline={tc.events}
                        headlineSub={'' + tc.calendarMonths[state.events.monthInScope] + ' ' + state.events.yearInScope}
                    />
                </div>
                <div className={minimize ? 'hide' : 'eventsCalendarWrapper__eventsCalendar__content'}>
                    {_renderDays()}
                </div>
            </div>
        </div> :
            <Loading />
    );
};

const MapStateToProps = (state, props) => {
    return {
        events: state.events,
        props: props,
        user: state.user,
    };
};

export default connect(
    MapStateToProps,
)(EventsCalendar);