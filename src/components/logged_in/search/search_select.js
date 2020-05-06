import React, {useEffect, useRef, useState} from 'react';
import {connect} from 'react-redux';
import {tc} from 'helpers';
import carHelper from 'shared_helpers/car_helper';
import companyHelper from 'shared_helpers/company_helper';
import {getAllSuggestions, getContactSuggestions, resetSearch, toggleSelectAll, toggleSelectContacts} from 'store/search/tasks';
import Icon from 'components/shared/icon';
import ReactDOM from "react-dom";

const SearchSelect = (state) => {
    const [searchValue, setSearchValue] = useState('');
    const [selected, setSelected] = useState([]);
    const inputRef = useRef(null);
    const searchWrapperRef = useRef(null);

    let placeholder;
    switch (state.props.type) {
        case 'carKoncern':
            placeholder = tc.placeholderSearchConnectCarKoncern;
            break;
        case 'contacts':
            placeholder = tc.placeholderSearchConnectContacts;
            break;
        case 'all':
            placeholder = tc.placeholderSearchConnectAll;
            break;
        default:
            placeholder = '';
    }

    /**
     * Handle input change.
     */
    const _handleInput = async () => {
        if (inputRef && inputRef.current && inputRef.current.value && inputRef.current.value.length) {
            setSearchValue(inputRef.current.value);
            switch (state.props.type) {
                case 'carKoncern':
                    return await getAllSuggestions({q: inputRef.current.value}); //byt
                case 'contacts':
                    return await getContactSuggestions({q: inputRef.current.value}); //byt
                case 'all':
                    return await getAllSuggestions({limit: 5, q: inputRef.current.value});
                default:
                    await getAllSuggestions({limit: 5, q: inputRef.current.value});
            }
        }
    };

    /**
     * Return search result rows.
     */
    const _renderSuggestionRows = () => {
        if (!state.search.searchSuggestions || state.search.searchSuggestions.length === 0) {
            return null;
        }

        return state.search.searchSuggestions.map((num) => {
            let iconVal;
            if (companyHelper.isValidOrgNr(num.id)) {
                iconVal = 'company';
            } else if (carHelper.isValidRegNumber(num.id)) {
                iconVal = 'car';
            } else {
                iconVal = 'person';
            }

            const iconCheckboxVal = (selected.includes(num.id)) ? 'check' : 'checkbox';

            return (
                <div className='searchSelectWrapper__searchSelect__content__searchResult__item' key={num.id} onClick={() => {_toggleSelected(num.id)}}>
                    <Icon val={iconCheckboxVal}/><Icon val={iconVal}/>{num.name}
                </div>
            );
        });
    };

    const _toggleSelected = (id) => {
        if (selected.includes(id)) {
            const filtered = selected.filter((x) => x !== id);
            setSelected(filtered);
        } else {
            setSelected([...selected, id]);
        }

        if (state.props.type === 'contacts') {
            toggleSelectContacts(id);
        } else {
            toggleSelectAll(id);
        }
    };

    useEffect(() => {
        /**
         * When clicking outside searchWrapper, reset search.
         */
        const _closeSearch = (e) => {
            if (searchWrapperRef && searchWrapperRef.current) {
                const node = ReactDOM.findDOMNode(searchWrapperRef.current);
                if (node && !node.contains(e.target)) {
                    setSearchValue('');
                    return resetSearch();
                }
            }
        };

        /**
         * Handle key press.
         */
        const _handleKey = async (e) => {
            if (e.keyCode === 27) {
                setSearchValue('');
                return resetSearch();
            }
        };

        window.addEventListener('mousedown', _closeSearch);
        window.addEventListener('keydown', _handleKey);
        return () => {
            window.removeEventListener('mousedown', _closeSearch);
            window.removeEventListener('keydown', _closeSearch);
        };
    }, []);

    return (
        <div className='searchSelectWrapper' ref={searchWrapperRef}>
            <div className='searchSelectWrapper__searchSelect'>
                <div className='searchSelectWrapper__searchSelect__header'>
                    <input ref={inputRef} type='search' placeholder={placeholder} onChange={_handleInput} />
                </div>
                {searchValue.length > 0 &&
                    <div className='searchSelectWrapper__searchSelect__content'>
                        <div className='searchSelectWrapper__searchSelect__content__searchResult'>
                            {_renderSuggestionRows()}
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
)(SearchSelect);
