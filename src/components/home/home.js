import React from 'react';
import Events from 'components/events';
import News from 'components/news';

export default () => {
    return (
        <div className='homeWrapper'>
            <News />
            <Events small={true} type='all' view='calendar' />
        </div>
    );
}
