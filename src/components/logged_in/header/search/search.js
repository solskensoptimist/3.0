import React, {useEffect, useRef} from 'react';
import tc from 'text_content';
import {connect} from 'react-redux';

const Search = (state) => {
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current.focus(); // Focus input field.
    }, []);

    const _handleClick = (e) => {
        e.stopPropagation(); // Prevent search to close when clicking inside.
    };

    return (
        <div className='searchWrapper' onClick={_handleClick}>
            <div className='searchWrapper__search'>
                <div className='searchWrapper__search__input'>
                    <input ref={inputRef} type='text' placeholder={tc.searchPlaceholder} />
                </div>
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


