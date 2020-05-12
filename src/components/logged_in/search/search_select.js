import React, {useEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {tc} from 'helpers';
import carHelper from 'shared_helpers/car_helper';
import companyHelper from 'shared_helpers/company_helper';
import {getAllSuggestions, getCarSuggestionsBasedOnRegNumber, getCarSuggestionsBasedOnTarget, getKoncernCompaniesSuggestions, getContactSuggestions, resetSearch, resetSelected, toggleSelected} from 'store/search/tasks';
import Icon from 'components/shared/icon';
import Loading from 'components/shared/loading';

const SearchSelect = (state) => {
    const [placeholder, setPlaceholder] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [selected, setSelected] = useState([]);
    const [title, setTitle] = useState('');
    const inputSelectRef = useRef(null);
    const searchSelectWrapperRef = useRef(null);

    const _clearSearch = () => {
        setSearchValue('');
        inputSelectRef.current.value = '';
        resetSelected({type: state.props.type});
    };

    /**
     * Handle input change.
     */
    const _handleInput = async () => {
        if (inputSelectRef && inputSelectRef.current && inputSelectRef.current.value && inputSelectRef.current.value.length) {
            setSearchValue(inputSelectRef.current.value);
            switch (state.props.type) {
                case 'cars':
                    if (state.props.target) {
                        return await getCarSuggestionsBasedOnTarget({koncern: state.props.koncern, q: inputSelectRef.current.value, target: state.props.target});
                    } else {
                        return await getCarSuggestionsBasedOnRegNumber({q: inputSelectRef.current.value});
                    }
                case 'koncernCompanies':
                    return await getKoncernCompaniesSuggestions({q: inputSelectRef.current.value, target: state.props.target});
                case 'contacts':
                    return await getContactSuggestions({q: inputSelectRef.current.value});
                case 'all':
                    return await getAllSuggestions({q: inputSelectRef.current.value});
                default:
                    return console.error('Missing prop.type in SearchSelect');
            }
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
        if (!state.search.searchSuggestions || (state.search.searchSuggestions && state.search.searchSuggestions.length === 0)) {
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
        return _clearSearch();
    };

    const _stateCheck = () => {
        return !!(searchValue !== undefined && selected && state && state.search && state.search.searchSuggestions);
    };

    const _toggleSelected = (payload) => {
        console.log('_toggleselected', payload);
        toggleSelected({obj: payload, type: state.props.type});
    };

    useEffect(() => {
        // Reset selected array.
        resetSelected({type: state.props.type});
        // Reset search suggestions.
        resetSearch();

        // Set placeholder and title.
        switch (state.props.type) {
            case 'all':
                setPlaceholder(tc.placeholderSearchAll);
                setTitle(tc.connectProspects);
                break;
            case 'cars':
                setPlaceholder(tc.placeholderSearchCars);
                setTitle(tc.connectCars);
                break;
            case 'contacts':
                setPlaceholder(tc.placeholderSearchContacts);
                setTitle(tc.connectContacts);
                break;
            case 'koncernCompanies':
                setPlaceholder(tc.placeholderSearchKoncernCompanies);
                setTitle(tc.connectKoncernCompanies);
                break;
            default:
                setPlaceholder('');
        }

        /**
         * When clicking outside searchWrapper, reset search.
         */
        const _closeSearch = (e) => {
            if (searchSelectWrapperRef && searchSelectWrapperRef.current) {
                const node = ReactDOM.findDOMNode(searchSelectWrapperRef.current);
                if (node && !node.contains(e.target)) {
                    setSearchValue('');
                    return resetSearch();
                }
            }
        };

        /**
         * Handle key press.r
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
    }, [state.props.type]);

    useEffect(() => {
        if (state.props.type === 'all') {
            setSelected(state.search.selectedAll);
        }
    }, [state.props.type, state.search.selectedAll]);

    useEffect(() => {
        if (state.props.type === 'cars') {
            setSelected(state.search.selectedCars);
        }
    }, [state.props.type, state.search.selectedCars]);


    useEffect(() => {
        if (state.props.type === 'contacts') {
            setSelected(state.search.selectedContacts);
        }
    }, [state.props.type, state.search.selectedContacts]);

    useEffect(() => {
        if (state.props.type === 'koncernCompanies') {
            setSelected(state.search.selectedKoncernCompanies);
        }
    }, [state.props.type, state.search.selectedKoncernCompanies]);

    return ( _stateCheck() ?
        <div className='searchSelectWrapper' ref={searchSelectWrapperRef}>
            <div className='searchSelectWrapper__searchSelect'>
                <div className='searchSelectWrapper__searchSelect__header'>
                    <div className='searchSelectWrapper__searchSelect__header__top'>
                        <div className='searchSelectWrapper__searchSelect__header__top__title'>
                            <h4>{title}:</h4>
                        </div>
                        <div className='searchSelectWrapper__searchSelect__header__top__input'>
                            <Icon val='link'/>
                            <input ref={inputSelectRef} type='search' placeholder={placeholder} onChange={_handleInput} />
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
