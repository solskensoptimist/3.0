import React from 'react';
import Events from 'components/logged_in/events';
import News from 'components/logged_in//news';

export default () => {
    return (
        <div className='homeWrapper'>
            <News />
            <Events small={true} type='all' view='calendar' />
        </div>
    );
}
