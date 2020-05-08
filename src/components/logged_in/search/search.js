import React from 'react';
import SearchMain from './search_main';
import SearchSelect from './search_select';

/**
 * Return a search component based on view.
 *
 * @param props.companyId - string
 * @param props.koncern - bool
 * @param props.type - string
 * @param props.view - string
 */
export default (props) => {
    switch (props.view) {
        case 'main':
            return <SearchMain/>;
        case 'select':
            return <SearchSelect companyId={props.companyId} koncern={props.koncern} type={props.type}/>;
        default:
            return <SearchMain/>;
    }
};
