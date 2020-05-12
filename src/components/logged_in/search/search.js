import React from 'react';
import SearchMain from './search_main';
import SearchSelect from './search_select';

/**
 * Return a search component based on view.
 * For type 'main' we return the component we use in navigation
 * For all other types we return a search component with selectable rows.
 * Type 'all' return search result for all companies and the prospects where some name or other contact information is saved/ordered (same as main search).
 * Type 'cars' return search result for targets fleet, can include all cars in koncern if possible.
 * Type 'contacts' returns all contacts.
 * Type 'koncernCompanies' returns all companies in a  koncern. Target id can be parent company or just a company within a koncern.
 *
 * SearchSelect only sets values in store.search.selectedAll, store.search.selectedCars, store.search.selectedContacts etc.
 * To use these values there need to be a send props.save.
 *
 * @param props.koncern - bool
 * @param props.save - function
 * @param props.targetId - string
 * @param props.type - string
 */
export default (props) => {
    switch (props.type) {
        case 'all':
            return <SearchSelect save={props.save} type={props.type}/>;
        case 'cars':
            return <SearchSelect koncern={props.koncern} save={props.save} targetId={props.targetId} type={props.type}/>;
        case 'contacts':
            return <SearchSelect save={props.save} type={props.type}/>;
        case 'koncernCompanies':
            return <SearchSelect save={props.save} targetId={props.targetId} type={props.type}/>;
        case 'main':
            return <SearchMain/>;
        default:
            return console.error('Missing props.type in Search component');
    }
};
