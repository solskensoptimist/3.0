import React from 'react';
import tc from 'text_content';

export default () => {
    return (
        <div className='companyInfo'>
            <h3>{tc.aboutUs}</h3>
            <p>{tc.companyInfo}</p>
        </div>
    );
}
