import React from 'react';
import Events from 'components/logged_in/content/shared/events';
import News from './news';

export default () => {
    return (
        <div className='homeWrapper'>
            <News />
            <Events view='calendar' />
        </div>
    );
}
