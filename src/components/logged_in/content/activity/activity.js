import React, {useEffect} from 'react';
import {tc} from 'helpers';
import {getActivityByFilter} from 'store/activity/tasks';
import Activities from 'components/logged_in/content/shared/activities';

export default () => {
    useEffect(() => {
        getActivityByFilter();
    });

    return (
        <div className='activityWrapper'>
            <div className='activityWrapper__activity'>
                {tc.activity}
            </div>
            <Activities type='filter' />
        </div>
    );
}
