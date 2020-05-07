import React, {useEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {tc} from 'helpers';
import carHelper from 'shared_helpers/car_helper';
import companyHelper from 'shared_helpers/company_helper';
import {getAllSuggestions, getContactSuggestions, resetSearch, toggleSelectAll, toggleSelectContacts} from 'store/search/tasks';
import Icon from 'components/shared/icon';

const SearchSelect = (state) => {
    const [searchValue, setSearchValue] = useState('');
    const [selected, setSelected] = useState([]);
    const inputSelectRef = useRef(null);
    const searchSelectWrapperRef = useRef(null);

    let placeholder;
    switch (state.props.type) {
        case 'carKoncern':
            placeholder = tc.placeholderSearchCarKoncern;
            break;
        case 'contacts':
            placeholder = tc.placeholderSearchContacts;
            break;
        case 'all':
            placeholder = tc.placeholderSearchAll;
            break;
        default:
            placeholder = '';
    }

    let title;
    switch (state.props.type) {
        case 'carKoncern':
            title = tc.connectCarKoncern;
            break;
        case 'contacts':
            title = tc.connectContacts;
            break;
        case 'all':
            title = tc.connectProspects;
            break;
        default:
            title = '';
    }

    /**
     * Handle input change.
     */
    const _handleInput = async () => {
        if (inputSelectRef && inputSelectRef.current && inputSelectRef.current.value && inputSelectRef.current.value.length) {
            setSearchValue(inputSelectRef.current.value);
            switch (state.props.type) {
                case 'carKoncern':
                    return await getAllSuggestions({q: inputSelectRef.current.value}); //byt
                case 'contacts':
                    return await getContactSuggestions({q: inputSelectRef.current.value});
                case 'all':
                    return await getAllSuggestions({q: inputSelectRef.current.value});
                default:
                    await getAllSuggestions({limit: 5, q: inputSelectRef.current.value});
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
            console.log('e.target', e.target);
            console.log('searchSelectWrapperRef.current', searchSelectWrapperRef.current);
            if (searchSelectWrapperRef && searchSelectWrapperRef.current) {
                const node = ReactDOM.findDOMNode(searchSelectWrapperRef.current);
                console.log('node', node);
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
        <div className='searchSelectWrapper' ref={searchSelectWrapperRef}>
            <div className='searchSelectWrapper__searchSelect'>
                <div className='searchSelectWrapper__searchSelect__header'>
                    <div className='searchSelectWrapper__searchSelect__header__title'>
                        <h4>{title}:</h4>
                    </div>
                    <div className='searchSelectWrapper__searchSelect__header__input'>
                        <Icon val='link'/>
                        <input ref={inputSelectRef} type='search' placeholder={placeholder} onChange={_handleInput} />
                    </div>
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
