import React from 'react';
import SearchMain from './search_main';
import SearchSelectAll from './search_select_all';
import SearchSelectCars from './search_select_cars';
import SearchSelectContacts from './search_select_contacts';
import SearchSelectKoncernCompanies from './search_select_koncern_companies';

/**
 * Return a search component based on view.
 * For type 'main' we return the component we use in navigation
 * For all other types we return a search component with selectable rows.
 * Type 'all' return search result for all companies and the prospects where some name or other footer_contact information is saved/ordered (same as main search).
 * Type 'cars' return search result for targets fleet, can include all cars in koncern if possible.
 * Type 'contacts' returns all contacts.
 * Type 'koncernCompanies' returns all companies in a  koncern. Target id can be parent company or just a company within a koncern.
 *
 * SearchSelect only sets values in store.search.selectedAll, store.search.selectedCars, store.search.selectedContacts etc.
 * To use these values there need to be a send props.save.
 *
 * @param props.koncern - bool
 * @param props.save - function
 * @param props.target - string
 * @param props.type - string
 */
export default (props) => {
    switch (props.type) {
        case 'all':
            return <SearchSelectAll save={props.save}/>;
        case 'cars':
            return <SearchSelectCars koncern={props.koncern} save={props.save} target={props.target}/>;
        case 'contacts':
            return <SearchSelectContacts save={props.save}/>;
        case 'koncernCompanies':
            return <SearchSelectKoncernCompanies save={props.save} target={props.target}/>;
        case 'main':
            return <SearchMain/>;
        default:
            return console.error('Missing props.type in Search component');
    }
};
