import React, {useEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {NavLink} from 'react-router-dom';
import {tc} from 'helpers';
import carHelper from 'shared_helpers/car_helper';
import companyHelper from 'shared_helpers/company_helper';
import {cleanSearch, getAllSuggestions, redirectSearch} from 'store/search/tasks';
import Icon from 'components/shared/icon';
import Tooltip from 'components/shared/tooltip';

const SearchLinks = (state) => {
    const [searchValue, setSearchValue] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const inputRef = useRef(null);
    const searchWrapperRef = useRef(null);

    /**
     * Handle input change.
     */
    const _handleInput = async () => {
        if (inputRef && inputRef.current && inputRef.current.value && inputRef.current.value.length) {
            setSearchValue(inputRef.current.value);
            await getAllSuggestions({limit: 10, q: inputRef.current.value});
        }
    };

    const _redirectSearch = async () => {
        if (inputRef && inputRef.current && inputRef.current.value && inputRef.current.value.length) {
            return await redirectSearch({q: inputRef.current.value});
        }
    };

    /**
     * Return search prospect_result rows.
     */
    const _renderSuggestionRows = () => {
        if (!state.search.searchSuggestions || state.search.searchSuggestions.length === 0) {
            return null;
        }

        return state.search.searchSuggestions.map((num) => {
            let iconVal;
            let to;
            if (companyHelper.isValidOrgNr(num.id)) {
                iconVal = 'company';
                to = '/foretag/' + num.id;
            } else if (carHelper.isValidRegNumber(num.id)) {
                iconVal = 'car';
                to = '/bil/' + num.id;
            } else {
                iconVal = 'person';
                to = '/person/' + num.id;
            }

            return (
                <div className='searchLinksWrapper__searchLinks__content__searchResult__item' key={num.id}>
                    <NavLink exact to={to} key={num.id}><Icon val={iconVal} />{num.name}</NavLink>
                </div>
            );
        });
    };

    const _showSearch = () => {
        setSearchValue('');
        setShowSearch(true)
    };

    useEffect(() => {
        inputRef && inputRef.current && inputRef.current.focus();

        /**
         * When clicking outside searchWrapper, close it.
         */
        const _closeSearch = (e) => {
            if (searchWrapperRef && searchWrapperRef.current) {
                const node = ReactDOM.findDOMNode(searchWrapperRef.current);
                if (node && !node.contains(e.target)) {
                    setShowSearch(false);
                }
            }
        };

        /**
         * Handle key press.
         */
        const _handleKey = async (e) => {
            if (!showSearch) {
                return null;
            } else if (e.keyCode === 27) {
                setShowSearch(false);
                setSearchValue('');
                return cleanSearch();
            } else if (e.keyCode === 13 && inputRef && inputRef.current && inputRef.current.value) {
                return await _redirectSearch();
            }
        };

        window.addEventListener('mousedown', _closeSearch);
        window.addEventListener('keydown', _handleKey);
        return () => {
            window.removeEventListener('mousedown', _closeSearch);
            window.removeEventListener('keydown', _closeSearch);
        };
    }, [showSearch]);

    return (
        <div className='searchLinksWrapper' ref={searchWrapperRef}>
            <div className='searchLinksWrapper__searchLinks'>
                <div className='searchLinksWrapper__searchLinks__header'>
                    {showSearch && <input ref={inputRef} type='text' placeholder={tc.placeholderSearchAll} onChange={_handleInput} />}
                    <Tooltip horizontalDirection='left' tooltipContent={tc.search}><Icon val='search' onClick={_showSearch} /></Tooltip>
                </div>
                {showSearch && searchValue.length > 0 &&
                    <div className='searchLinksWrapper__searchLinks__content'>
                        <div className='searchLinksWrapper__searchLinks__content__searchResult'>
                            {_renderSuggestionRows()}
                        </div>
                        <div className='searchLinksWrapper__searchLinks__content__vehicleSearch' onClick={_redirectSearch}>
                            {tc.doVehicleSearch}<Icon val='link'/>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};


const MapStateToProps = (state, props) => {
    return {
        props: props,
        search: state.search,
    };
};

export default connect(
    MapStateToProps,
)(SearchLinks);
