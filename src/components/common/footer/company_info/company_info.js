import React from 'react';
import tc from 'text_content';

export default () => {
    return (
        <div className='companyInfo'>
            <h4>{tc.aboutUs}</h4>
            <p>{tc.companyInfo}</p>
        </div>
    );
}
