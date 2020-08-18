import React from 'react';
import ExcelLists from './excel_lists';

/**
 * Render component for new comment, edit comment or remove comment.
 *
 * @param props.close - func
 * @param props.selectedLists - array - When props.type 'lists'
 * @param props.type - string - 'lists'... more to come?
 */
export default (props) => {
    switch (props.type) {
        case 'lists':
            return <ExcelLists close={props.close} selectedLists={props.selectedLists}/>;
        default:
            return <ExcelLists close={props.close} selectedLists={props.selectedLists}/>;
    }
}
