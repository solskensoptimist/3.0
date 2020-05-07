import React, {useEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {tc} from 'helpers';
import carHelper from 'shared_helpers/car_helper';
import companyHelper from 'shared_helpers/company_helper';
import {getAllSuggestions, getContactSuggestions, resetSearch, resetSelected, toggleSelected} from 'store/search/tasks';
import Icon from 'components/shared/icon';
import Loading from 'components/shared/loading';

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
     * Render selected values, with remove button.
     */
    const _renderChips = () => {
        if (state.search.selected && state.search.selected.length) {
            return state.search.selected.map((num) => {
                return (
                    <div className='searchSelectWrapper__searchSelect__header__bottom__chips__item' key={num.id}>
                        {num.name}
                        <Icon val='clear' onClick={() => {_toggleSelected({id: num.id, name: num.name})}}/>
                    </div>
                );
            });
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

            const iconCheckboxVal = (selected.find((x) => x.id === num.id)) ? 'check' : 'checkbox';

            return (
                <div className='searchSelectWrapper__searchSelect__content__searchResult__item' key={num.id} onClick={() => {_toggleSelected({id: num.id, name: num.name})}}>
                    <Icon val={iconCheckboxVal}/><Icon val={iconVal}/>{num.name}
                </div>
            );
        });
    };

    const _saveSelected = async () => {
        console.log('SAVE');
        /*
        Vi behöver ytterligare en prop för detta där vi skickar id, kanske borde heta 'target'?
        Ska vi även skicka om deal === true?
        Och koncern === true. Så utreder vi senare hur vi gör med koncern.

        För prospekt/koncern ska vi kunna knyta kontakter.
        För affärer ska vi kunna knyta kontakter/prospekt/carKoncern.

        Beroende på vad som är true ska olika funktioner köras.
        Till exempel för deal ska vi köra samma funktion som vi kör för updateDeal, skicka in nya värden bara.
        Kanske hämta ut nuvarade deal-objekt, lägga till selected i contacts/prospects, och sen skicka
        in objektet till saveDeal..?

        För prospekt/koncern sparar vi annorlunda... kolla upp.
         */
        resetSelected();
    };

    const _stateCheck = () => {
        return !!(state && state.search && state.search.selected && state.search.searchSuggestions);
    };

    const _toggleSelected = (payload) => {
        if (selected.find((num) => num.id === payload.id)) {
            const filtered = selected.filter((num) => num.id !== payload.id);
            setSelected(filtered);
        } else {
            setSelected([...selected, payload]);
        }

        toggleSelected(payload);
    };

    useEffect(() => {
        resetSelected();

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
                        <div className='searchSelectWrapper__searchSelect__header__bottom__chips'>
                            {_renderChips()}
                        </div>
                        {state.search.selected.length > 0 &&
                            <div className='searchSelectWrapper__searchSelect__header__bottom__save' onClick={_saveSelected}>
                                {tc.save}
                            </div>
                        }
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
