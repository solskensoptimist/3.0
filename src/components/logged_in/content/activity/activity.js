import React, {useEffect} from 'react';
import {tc} from 'helpers';
import {getActivityByFilter} from 'store/activity/tasks';
import ActivityStream from 'components/logged_in/content/shared/activity_stream';

export default () => {
    useEffect(() => {
        getActivityByFilter();
    });

    return (
        <div className='activityWrapper'>
            <div className='activityWrapper__activity'>
                {tc.activity}
            </div>
            <ActivityStream type='filter' />
        </div>
    );
}
