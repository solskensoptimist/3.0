import React, {useEffect, useState} from 'react';
// import {connect} from 'react-redux';
import {activityHelper, agileHelper, tc} from 'helpers';
import DatePicker from 'react-datepicker';
import Icon from 'components/icon';
import WidgetFooter from 'components/widget_footer';
import WidgetHeader from 'components/widget_header';

export default (props) => {
    const [action, setAction] = useState(null);
    const [activityIsPerformed, setActivityIsPerformed] = useState(null);
    const [comment, setComment] = useState('');
    const [date, setDate] = useState(null);
    const [isValid, setIsValid] = useState(false);

    // useEffect(() => {
    //     if (state.props.id && state.agile.columns && Array.isArray(state.agile.columns)) {
    //         let found;
    //         state.agile.columns.forEach((column) => {
    //             if (column.items.find((num) => num._id === state.props.id)) {
    //                 found = column.items.find((num) => num._id === state.props.id);
    //             }
    //         });
    //
    //         if (found) {
    //             setItem(found);
    //         }
    //     }
    // }, [state.agile.columns, state.props.id]);

    useEffect(() => {
        setDate(null);
    }, [activityIsPerformed]);

    useEffect(() => {
        setIsValid(!!(activityIsPerformed !== null && date && action));
    }, [activityIsPerformed, action, date]);

    const _renderActions = () => {
        return agileHelper.getActionTypes.map((num) => {
            return (
                <div className={(action === num) ?
                    'agileAddActivityWrapper__agileAddActivity__content__selectables__actions__action agileAddActivityBoxActive' :
                    'agileAddActivityWrapper__agileAddActivity__content__selectables__actions__action'}
                     key={num}
                     onClick={() => {setAction(num)}}
                >
                    <Icon val={num}/>
                    <p>{activityHelper.getReadableActivity(num)}</p>
                </div>
            );
        });
    };

    const _saveActivity = () => {
        console.log('SPARA');
        props.close();
    };

    return (
        <div className='agileAddActivityWrapper'>
            <div className='agileAddActivityWrapper__agileAddActivity'>
                <div className='agileAddActivityWrapper__agileAddActivity__header'>
                    <WidgetHeader
                        iconVal='events'
                        headline={tc.addAgileActivity}
                    />
                </div>
                <div className='agileAddActivityWrapper__agileAddActivity__content'>
                    <div className='agileAddActivityWrapper__agileAddActivity__content__isPerformed'>
                        <div className={(activityIsPerformed === true) ?
                            'agileAddActivityWrapper__agileAddActivity__content__isPerformed__choice agileAddActivityBoxActive' :
                            'agileAddActivityWrapper__agileAddActivity__content__isPerformed__choice'}
                             onClick={() => {
                                 setActivityIsPerformed(true);
                             }}
                        >
                            {tc.performedActivity}
                            <Icon val={(activityIsPerformed === true) ? 'check' : 'checkbox'}/>
                        </div>
                        <div className={(activityIsPerformed === false) ?
                            'agileAddActivityWrapper__agileAddActivity__content__isPerformed__choice agileAddActivityBoxActive' :
                            'agileAddActivityWrapper__agileAddActivity__content__isPerformed__choice'}
                             onClick={() => {
                                 setActivityIsPerformed(false);
                             }}
                        >
                            {tc.plannedActivity}
                            <Icon val={(activityIsPerformed === false) ? 'check' : 'checkbox'}/>
                        </div>
                    </div>
                    <div className={(activityIsPerformed !== null) ?
                        'agileAddActivityWrapper__agileAddActivity__content__selectables' :
                        'agileAddActivityWrapper__agileAddActivity__content__selectables agileAddActivityDisabled'}
                    >
                        <h4>{tc.chooseAction}</h4>
                        <div className='agileAddActivityWrapper__agileAddActivity__content__selectables__actions'>
                            {_renderActions()}
                        </div>
                        <div className='agileAddActivityWrapper__agileAddActivity__content__selectables__dateAndComment'>
                            <div className={(date === null ) ?
                                'agileAddActivityWrapper__agileAddActivity__content__selectables__dateAndComment__date' :
                                'agileAddActivityWrapper__agileAddActivity__content__selectables__dateAndComment__dateActive'}
                            >
                                <h4>{tc.chooseDateAndTime}</h4>
                                <DatePicker
                                    dateFormat='Pp'
                                    locale='sv'
                                    maxDate={(activityIsPerformed) ? new Date() : null}
                                    minDate={!(activityIsPerformed) ? new Date() : null}
                                    onChange={(val) => {setDate(val)}}
                                    selected={date}
                                    showTimeSelect
                                    timeCaption={tc.time}
                                />
                            </div>
                            <div className='agileAddActivityWrapper__agileAddActivity__content__selectables__dateAndComment__comment'>
                                <h4>{tc.addComment}</h4>
                                <textarea value={comment} onChange={(e) => {setComment(e.target.value)}}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='agileAddActivityWrapper__agileAddActivity__footer'>
                    <WidgetFooter disableSave={!isValid} save={_saveActivity}/>
                </div>
            </div>
        </div>
    );
};
