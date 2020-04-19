import React, {useEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom';
import {tc} from 'helpers';
import {setShowSearch} from 'store/search/tasks';
import {connect} from "react-redux";
import Icon from 'components/shared/icon';

const Search = (state) => {
    const [searchResults, setSearchResults] = useState([]); //Temp for testing, change this to search results from store...
    const inputRef = useRef(null);
    const searchWrapperRef = useRef(null);

    const _closeShowSearch = () => {
        setShowSearch({showSearch: false});
    };

    const _inputHandler = () => {
        console.log('inputRef.current.value', inputRef.current.value);
        setTimeout(() => {
            setSearchResults(['Postnord Sverige AB', 'Postnord Norge AB', 'Postnord Danmark AB']);
        }, 1000);
    };

    /**
     * Return search result rows.
     */
    const _searchResultRows = () => {
        const result = [];
        for (const val of searchResults) {
            result.push(
                <div className='searchWrapper__search__results__item' key={val}><Icon val='company' />{val}</div>
            );
        }
        return result;
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
                    <input ref={inputRef} type='text' placeholder={tc.searchPlaceholder} onChange={_inputHandler} />
                </div>
                {(searchResults.length > 0) && <div className='searchWrapper__search__results'>{_searchResultRows()}</div>}
            </div>
        </div>
    );
};

const MapStateToProps = (state) => {
    return {
        search: state.search,
    };
};

export default connect(
    MapStateToProps,
)(Search);

