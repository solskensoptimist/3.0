import React, {useState, useEffect} from 'react';
import {tc} from 'helpers';
import {connect} from "react-redux";
import DayMonth from './day_month';
import DayWeek from './day_week';
import Loading from 'components/shared/loading';
import {getEvents} from 'store/events/tasks';
import moment from 'moment';
import Icon from "../../../../shared/icon/icon";

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
                <div className='eventsCalendarWrapper__eventsCalendar__content__week'>
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
                <div className='eventsCalendarWrapper__eventsCalendar__content__month'>
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
            <div className='eventsCalendarWrapper__eventsCalendar'>
                <div className='eventsCalendarWrapper__eventsCalendar__header'>
                    <div className='eventsCalendarWrapper__eventsCalendar__header__left'>
                        <h2>{tc.plannedActivities}</h2>
                        <h3>{tc.calendarMonths[state.events.monthInScope]} {state.events.yearInScope}</h3>
                    </div>
                    <div className='eventsCalendarWrapper__eventsCalendar__header__right'>
                        <div className='eventsCalendarWrapper__eventsCalendar__header__right__icon' onClick={_stepBack}><Icon val='navigateBefore'/></div>
                        <div className='eventsCalendarWrapper__eventsCalendar__header__right__icon' onClick={_stepForward}><Icon val='navigateNext'/></div>
                       <div className={showWeek ? 'eventsCalendarWrapper__eventsCalendar__header__right__icon' : 'eventsCalendarWrapper__eventsCalendar__header__right__icon active'} onClick={() => {setShowWeek(false)}}><Icon val='events'/></div>
                        <div className={showWeek ? 'eventsCalendarWrapper__eventsCalendar__header__right__icon active' : 'eventsCalendarWrapper__eventsCalendar__header__right__icon'} onClick={() => {setShowWeek(true)}}><Icon val='eventsWeek'/></div>
                    </div>
                </div>
                <div className='eventsCalendarWrapper__eventsCalendar__content'>
                {_renderDays()}
                </div>
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
