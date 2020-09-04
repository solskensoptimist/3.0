import React, {useEffect, useState} from 'react';
import {activityHelper, agileHelper, tc} from 'helpers';
import DatePicker from 'react-datepicker';
import Icon from 'components/icon';
import WidgetFooter from 'components/widget_footer';
import WidgetHeader from 'components/widget_header';

/**
 * Render add activity component.
 *
 * @param props.close - func
 * @param props.save - func
 * @param props.moveItem - bool - When we're in the process of moving an item and adding an activity simultaneously. This affects which function to run for save and close.
 */
const AgileAddActivity = (props) => {
    const [action, setAction] = useState(null);
    const [activityIsPerformed, setActivityIsPerformed] = useState(null);
    const [comment, setComment] = useState('');
    const [date, setDate] = useState(null);
    const [isValid, setIsValid] = useState(false);

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
                    'agileAddActivityWrapper__agileAddActivity__content__actions__holder__action agileAddActivityBoxActive' :
                    'agileAddActivityWrapper__agileAddActivity__content__actions__holder__action'}
                     key={num}
                     onClick={() => {setAction(num)}}
                >
                    <Icon val={num}/>
                    <p>{activityHelper.getReadableActivity(num)}</p>
                </div>
            );
        });
    };

    return (
        <div className='agileAddActivityWrapper'>
            <div className='agileAddActivityWrapper__agileAddActivity'>
                <div className='agileAddActivityWrapper__agileAddActivity__header'>
                    <WidgetHeader
                        iconVal='events'
                        headline={tc.addActivity}
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
                            <Icon val='check'/>
                        </div>
                        <div className={(activityIsPerformed === false) ?
                            'agileAddActivityWrapper__agileAddActivity__content__isPerformed__choice agileAddActivityBoxActive' :
                            'agileAddActivityWrapper__agileAddActivity__content__isPerformed__choice'}
                             onClick={() => {
                                 setActivityIsPerformed(false);
                             }}
                        >
                            {tc.plannedActivity}
                            <Icon val='time'/>
                        </div>
                    </div>
                    <div className='agileAddActivityWrapper__agileAddActivity__content__actions'>
                        <h4>{tc.typeOfActivity}</h4>
                        <div className='agileAddActivityWrapper__agileAddActivity__content__actions__holder'>
                            {_renderActions()}
                        </div>
                    </div>
                    <div className='agileAddActivityWrapper__agileAddActivity__content__dateAndComment'>
                        <div className={(date === null ) ?
                            'agileAddActivityWrapper__agileAddActivity__content__dateAndComment__date' :
                            'agileAddActivityWrapper__agileAddActivity__content__dateAndComment__dateActive'}
                        >
                            <h4>{tc.dateAndTime}</h4>
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
                        <div className='agileAddActivityWrapper__agileAddActivity__content__dateAndComment__comment'>
                            <h4>{tc.comment}</h4>
                            <textarea value={comment} onChange={(e) => {setComment(e.target.value)}}/>
                        </div>
                    </div>
                </div>
                <div className='agileAddActivityWrapper__agileAddActivity__footer'>
                    <WidgetFooter
                        disableButtonOne={!isValid}
                        buttonOneFunc={() => {
                            props.save({
                                action: action,
                                comment: comment,
                                event_date: date,
                                performed: activityIsPerformed,
                            });
                        }}
                        buttonTwoFunc={(props.moveItem) ? () => {
                            // If we have a moveDeal object, we should
                            props.save({
                                action: action,
                                comment: comment,
                                event_date: date,
                                performed: activityIsPerformed,
                                skipAddActivity: true,
                            });
                        } : null}
                        buttonTwoText={tc.skip}
                    />
                </div>
            </div>
        </div>
    );
};

export default AgileAddActivity;
