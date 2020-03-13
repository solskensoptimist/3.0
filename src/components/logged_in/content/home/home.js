import React from 'react';
import Calendar from './calendar';
import News from './news';

export default () => {
    return (
        <div className='homeWrapper'>
            <News />
            <Calendar />
        </div>
    );
}
