import React from 'react';
import tc from 'text_content';

export default () => {
    return (
        <div className='newsWrapper'>
            <div className='headlineMain'>
                <div className='headlineMain__left'>
                    <h2>{tc.news}</h2>
                    <h3>{tc.newsSub}</h3>
                </div>
            </div>
         </div>
    );
}
