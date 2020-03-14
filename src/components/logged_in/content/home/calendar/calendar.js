import React from 'react';
import tc from 'text_content';
import {connect} from "react-redux";
import Day from './subcomponents/day';
import Loading from 'components/common/loading';

const Calendar = (state) => {
    const _renderDays = () => {
        const result = [];
        for (const day in state.events.month) {
            result.push(<Day key={day} day={day} events={state.events.month[day]} />);
        }
        return result;
    };

    const _stateCheck = () => {
        return (state.events && state.events.month);
    };

    return ( _stateCheck() ?
        <div className='calendarWrapper'>
            <div className='calendarWrapper__extraWrap'>
                {tc.calendar}
            {_renderDays()}
            </div>
        </div> :
            <Loading />
    );
};

const MapStateToProps = (state) => {
    return {
        events: state.events,
    };
};

export default connect(
    MapStateToProps,
)(Calendar);
