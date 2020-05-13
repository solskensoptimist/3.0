import React, {useEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {tc} from 'helpers';
import carHelper from 'shared_helpers/car_helper';
import companyHelper from 'shared_helpers/company_helper';
import {getContactSuggestions, resetSearch, resetSelected, toggleSelected} from 'store/search/tasks';
import Icon from 'components/shared/icon';
import Loading from 'components/shared/loading';

const SearchSelect = (state) => {
    const [searchValue, setSearchValue] = useState('');
    const [selected, setSelected] = useState([]);
    const inputSelectContactsRef = useRef(null);
    const searchSelectContactsWrapperRef = useRef(null);

    /**
     * Handle input change.
     */
    const _handleInput = async () => {
        if (inputSelectContactsRef && inputSelectContactsRef.current && inputSelectContactsRef.current.value && inputSelectContactsRef.current.value.length) {
            setSearchValue(inputSelectContactsRef.current.value);
            return await getContactSuggestions({q: inputSelectContactsRef.current.value});
        }
    };

    /**
     * Render selected values, with remove button.
     */
    const _renderChips = () => {
        if (selected && selected.length) {
            return selected.map((num) => {
                return (
                    <div className='searchSelectWrapper__searchSelect__content__chips__item' key={num.id ? num.id : num._id}>
                        {num.name}
                        <Icon val='clear' onClick={() => {_toggleSelected(num)}}/>
                    </div>
                );
            });
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

        const rows = state.search.searchSuggestions.map((num, i) => {
            let iconVal;
            if (companyHelper.isValidOrgNr(num.id ? num.id : num._id)) {
                iconVal = 'company';
            } else if (carHelper.isValidRegNumber(num.id ? num.id : num._id)) {
                iconVal = 'car';
            } else {
                iconVal = 'person';
            }

            const iconCheckboxVal = (selected.find((x) => {
                const selectedId = x.id ? x.id : x._id;
                const searchResultId = num.id ? num.id : num._id;
                return selectedId === searchResultId;
            })) ? 'check' : 'checkbox';

            return (
                <div className='searchSelectWrapper__searchSelect__header__bottom__searchResult__item' key={num.id ? num.id : num._id} onClick={() => {_toggleSelected(num)}}>
                    <span className='small'><Icon val={iconVal}/></span><span className='text'>{num.name}</span><Icon val={iconCheckboxVal}/>
                </div>
            );
        });

        return (
            <div className='searchSelectWrapper__searchSelect__header__bottom__searchResult'>
                {rows}
            </div>
        );
    };

    const _saveSelected = async () => {
        if (typeof state.props.save === 'function') {
            await state.props.save();
        }
        setSearchValue('');
        inputSelectContactsRef.current.value = '';
        return resetSelected({type: 'contacts'});
    };

    const _stateCheck = () => {
        return !!(searchValue !== undefined && selected && state && state.search && state.search.searchSuggestions);
    };

    const _toggleSelected = (payload) => {
        toggleSelected({obj: payload, type: 'contacts'});
    };

    useEffect(() => {
        // Reset selected array.
        resetSelected({type: 'contacts'});
        // Reset search suggestions.
        resetSearch();

        /**
         * When clicking outside searchWrapper, reset search.
         */
        const _closeSearch = (e) => {
            if (searchSelectContactsWrapperRef && searchSelectContactsWrapperRef.current) {
                const node = ReactDOM.findDOMNode(searchSelectContactsWrapperRef.current);
                if (node && !node.contains(e.target)) {
                    if (inputSelectContactsRef.current && inputSelectContactsRef.current) {
                        inputSelectContactsRef.current.value = '';
                    }
                    setSearchValue('');
                }
            }
        };

        /**
         * Handle key press.r
         */
        const _handleKey = async (e) => {
            if (e.keyCode === 27) {
                setSearchValue('');
                inputSelectContactsRef.current.value = '';
            }
        };

        window.addEventListener('mousedown', _closeSearch);
        window.addEventListener('keydown', _handleKey);
        return () => {
            window.removeEventListener('mousedown', _closeSearch);
            window.removeEventListener('keydown', _closeSearch);
        };
    }, []);

    useEffect(() => {
        setSelected(state.search.selectedContacts);
    }, [state.search.selectedContacts]);

    return ( _stateCheck() ?
            <div className='searchSelectWrapper' ref={searchSelectContactsWrapperRef}>
                <div className='searchSelectWrapper__searchSelect'>
                    <div className='searchSelectWrapper__searchSelect__header'>
                        <div className='searchSelectWrapper__searchSelect__header__top'>
                            <div className='searchSelectWrapper__searchSelect__header__top__title'>
                                <h4>{tc.connectContacts}:</h4>
                            </div>
                            <div className='searchSelectWrapper__searchSelect__header__top__input'>
                                <Icon val='link'/>
                                <input ref={inputSelectContactsRef} type='search' placeholder={tc.placeholderSearchContacts} onChange={_handleInput} />
                            </div>
                        </div>
                        <div className='searchSelectWrapper__searchSelect__header__bottom'>
                            {_renderSuggestionRows()}
                        </div>
                    </div>
                    {selected.length > 0 &&
                    <div className='searchSelectWrapper__searchSelect__content'>
                        <div className='searchSelectWrapper__searchSelect__content__chips'>
                            {_renderChips()}
                        </div>
                        <div className='searchSelectWrapper__searchSelect__content__save' onClick={_saveSelected}>
                            {tc.save}
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
)(SearchSelect);
