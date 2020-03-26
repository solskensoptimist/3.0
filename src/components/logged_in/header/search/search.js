import React, {useEffect, useRef} from 'react';
import ReactDOM from 'react-dom';
import tc from 'text_content';
import {setShowSearch} from 'store/search/tasks';

export default () => {
    const inputRef = useRef(null);
    const searchWrapperRef = useRef(null);

    const _closeShowSearch = () => {
        setShowSearch({showSearch: false});
    };

    useEffect(() => {
        inputRef.current.focus(); // Focus input field.


        /**
         * When clicking outside searchWrapper, close it.
         */
        const _unmountSearch = (e) => {
            if (searchWrapperRef && searchWrapperRef.current) {
                const node = ReactDOM.findDOMNode(searchWrapperRef.current);
                if (node && !node.contains(e.target)) {
                    _closeShowSearch();
                }
            }
        };

        window.addEventListener('mousedown', _unmountSearch);
        return () => window.removeEventListener('mousedown', _unmountSearch);
    }, []);

    return (
        <div className='searchWrapper' ref={searchWrapperRef}>
            <div className='searchWrapper__search'>
                <div className='searchWrapper__search__input'>
                    <input ref={inputRef} type='text' placeholder={tc.searchPlaceholder} />
                </div>
            </div>
        </div>
    );
};

