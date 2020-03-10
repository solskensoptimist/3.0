import React from 'react';

export default () => {
    return (
        <div className='search'>
            <div className='search__icon'>
                <i className="fas fa-search" />
            </div>
            <div className='search__input'>
                <input type='text' placeholder='Sök fordon eller fordonsbrukare...' />
            </div>
        </div>
    );
};
