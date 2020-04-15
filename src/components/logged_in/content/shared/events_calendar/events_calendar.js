import React, {useState, useEffect} from 'react';
import {tc} from 'helpers';
import {connect} from "react-redux";
import DayMonth from './day_month';
import DayWeek from './day_week';
import Loading from 'components/shared/loading';
import {getEvents} from 'store/events/tasks';
import moment from 'moment';

const EventsCalendar = (state) => {
    const [showWeek, setShowWeek] = useState(false);

    const _renderDays = () => {
        const days = [];
        let result;

        if (showWeek) {
            for (const day in state.events.month) {
                const hasPassed = moment(new Date()).format('YYYY-MM-DD') > moment(new Date(day)).format('YYYY-MM-DD');
                const isToday = moment(new Date(day)).isSame(new Date(), 'day');
                days.push(<DayWeek date={state.events.month[day].date} events={state.events.month[day].events} hasPassed={hasPassed} isToday={isToday} key={day} />);
            }
            result = (
                <div className='eventsCalendar__week'>
                    {days}
                </div>
            );
        } else {
            for (const day in state.events.month) {
                const hasPassed = moment(new Date()).format('YYYY-MM-DD') > moment(new Date(day)).format('YYYY-MM-DD');
                const isToday = moment(new Date(day)).isSame(new Date(), 'day');
                days.push(<DayMonth date={state.events.month[day].date} events={state.events.month[day].events} hasPassed={hasPassed} isToday={isToday} key={day} />);
            }
            result = (
                <div className='eventsCalendar__month'>
                    {days}
                </div>
            );
        }

        return result;
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
    }

    useEffect(() => {
        getEvents();
    }, []);

    return ( _stateCheck() ?
        <div className='eventsCalendarWrapper'>
            <div className='headlineMain'>
                <div className='headlineMain__left'>
                    <h2>{tc.plannedActivities}</h2>
                    <h3>{tc.calendarMonths[state.events.monthInScope]} {state.events.yearInScope}</h3>
                </div>
                <div className='headlineMain__right'>
                    <i className='fas fa-caret-left' onClick={_stepBack} />
                    <i className='fas fa-caret-right' onClick={_stepForward} />
                   <i className={showWeek ? 'far fa-calendar-alt' : 'far fa-calendar-alt active'} onClick={() => {setShowWeek(false)}} />
                   <i className={showWeek ? 'far fa-calendar active' : 'far fa-calendar'} onClick={() => {setShowWeek(true)}}  />
                </div>
            </div>
            <div className='eventsCalendar'>
            {_renderDays()}
            </div>
        </div> :
            <Loading />
    );
};

const MapStateToProps = (state) => {
    return {
        events: state.events,
        user: state.user,
    };
};

export default connect(
    MapStateToProps,
)(EventsCalendar);
