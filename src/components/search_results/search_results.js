import React from 'react';
import {useParams} from 'react-router-dom';

export default () => {
    const {q} = useParams();

    return (
        <div className='searchResultsWrapper'>
            <div className='searchResultsWrappe__searchResults'>
                <div className='searchResultsWrapper__searchResults__header'>
                </div>
                <div className='searchResultsWrapper__searchResults__content'>
                    Search value = {q}
                </div>
            </div>
        </div>
    );
}
