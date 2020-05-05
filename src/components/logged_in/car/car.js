import React from 'react';
import {useParams} from 'react-router-dom';

export default () => {
    const {regNr} = useParams();

    return (
        <div className='carWrapper'>
            <div className='carWrapper__car'>
                <div className='carWrapper__car__header'>
                </div>
                <div className='carWrapper__car__content'>
                    <p>Regnr: {regNr}</p>
                </div>
            </div>
        </div>
    );
};
