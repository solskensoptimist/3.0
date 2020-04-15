import React from 'react';
import {tc} from 'helpers';
import ActivityStream from 'components/logged_in/content/shared/activity_stream';

export default () => {
    return (
        <div className='activityWrapper'>
            <div className='activityWrapper__activity'>
                {tc.activity}
            </div>
            <ActivityStream type='filter' />
        </div>
    );
}
