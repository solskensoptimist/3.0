import React from 'react';
import SearchLinks from './search_links';
import SearchSelect from './search_select';

export default (props) => {
    switch (props.view) {
        case 'links':
            return <SearchLinks/>;
        case 'select':
            return <SearchSelect type={props.type}/>;
        default:
            return <SearchLinks/>;
    }
};
