import React from 'react';
import SearchMain from './search_main';
import SearchSelect from './search_select';

export default (props) => {
    switch (props.view) {
        case 'main':
            return <SearchMain/>;
        case 'select':
            return <SearchSelect type={props.type}/>;
        default:
            return <SearchSelect type={props.type}/>;
    }
};
