import React, {useEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {NavLink} from 'react-router-dom';
import {tc} from 'helpers';
import carHelper from 'shared_helpers/car_helper';
import companyHelper from 'shared_helpers/company_helper';
import {getAllSuggestions, redirectSearch} from 'store/search/tasks';
import Icon from 'components/icon';
import Loading from 'components/loading';
import Tooltip from 'components/tooltip';

const SearchMain = (state) => {
    const [searchValue, setSearchValue] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const inputRefMain = useRef(null);
    const searchMainWrapperRef = useRef(null);

    /**
     * Handle input change.
     */
    const _handleInput = async () => {
        if (inputRefMain && inputRefMain.current && inputRefMain.current.value && inputRefMain.current.value.length) {
            setSearchValue(inputRefMain.current.value);
            await getAllSuggestions({limit: 6, q: inputRefMain.current.value});
        }
    };

    const _redirectSearch = async () => {
        if (inputRefMain && inputRefMain.current && inputRefMain.current.value && inputRefMain.current.value.length) {
            return await redirectSearch({q: inputRefMain.current.value});
        }
    };

    /**
     * Return search result rows.
     */
    const _renderSuggestionRows = () => {
        if (!state.search.searchSuggestions ||
            (state.search.searchSuggestions && state.search.searchSuggestions.length === 0) ||
            (!searchValue || (searchValue && !searchValue.length))) {
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
                <div className='searchMainWrapper__searchMain__content__searchResult__item' key={Math.random().toString()}>
                    <NavLink exact to={to} key={num.id} onClick={() => {setShowSearch(false)}}><Icon val={iconVal} /><span>{num.name}</span></NavLink>
                </div>
            );
        });
    };

    const _showSearch = () => {
        setSearchValue('');
        setShowSearch(true)
    };

    const _stateCheck = () => {
        return !!(searchValue !== undefined && state && state.search);
    };

    useEffect(() => {
        inputRefMain && inputRefMain.current && inputRefMain.current.focus();

        /**
         * When clicking outside searchWrapper, close it.
         */
        const _closeSearch = (e) => {
            if (searchMainWrapperRef && searchMainWrapperRef.current) {
                const node = ReactDOM.findDOMNode(searchMainWrapperRef.current);
                if (node && !node.contains(e.target)) {
                    if (inputRefMain.current && inputRefMain.current) {
                        inputRefMain.current.value = '';
                    }
                    setSearchValue('');
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
                setSearchValue('');
                inputRefMain.current.value = '';
                setShowSearch(false);
            } else if (e.keyCode === 13 && inputRefMain && inputRefMain.current && inputRefMain.current.value) {
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

    return ( _stateCheck() ?
        <div className='searchMainWrapper' ref={searchMainWrapperRef}>
            <div className='searchMainWrapper__searchMain'>
                <div className='searchMainWrapper__searchMain__header'>
                    {showSearch && <input ref={inputRefMain} type='search' placeholder={tc.placeholderSearchAll} onChange={_handleInput} />}
                    <Tooltip horizontalDirection='left' tooltipContent={tc.search}><Icon val='search' onClick={_showSearch} /></Tooltip>
                </div>
                {showSearch && searchValue.length > 0 &&
                    <div className='searchMainWrapper__searchMain__content'>
                        <div className='searchMainWrapper__searchMain__content__searchResult'>
                            {_renderSuggestionRows()}
                        </div>
                        <div className='searchMainWrapper__searchMain__content__vehicleSearch' onClick={_redirectSearch}>
                            {tc.doVehicleSearch}<Icon val='navigate'/>
                        </div>
                    </div>
                }
            </div>
        </div> :
        <Loading/>
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
)(SearchMain);
