import React from 'react';
import {useParams} from 'react-router-dom';

export default () => {
    let {id} = useParams();

    return (
        <div className='companyWrapper'>
            <div className='companyWrapper__company'>
                <p>Företagskomponent</p>
                <p>Id: {id}</p>
            </div>
        </div>
    );
}
