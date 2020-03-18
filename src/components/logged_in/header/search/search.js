import React, {useEffect, useRef} from 'react';
import tc from 'text_content';
import {connect} from 'react-redux';

const Search = (state) => {
    useEffect(() => {
        inputRef.current.focus();
    }, []);
    const inputRef = useRef(null);

    const _handleClick = (e) => {
        e.stopPropagation(); // Prevent search to close when clicking inside.
    };

    return (
        <div className='searchWrapper__search' onClick={_handleClick}>
            <div className='searchWrapper__search__input'>
                <input ref={inputRef} type='text' placeholder={tc.searchPlaceholder} />
            </div>
        </div>
    );
};

const MapStateToProps = (state) => {
    return {
        //search: state.search,
    };
};

export default connect(
    MapStateToProps,
)(Search);


