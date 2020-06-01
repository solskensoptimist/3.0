import React from 'react';
import {tc} from 'helpers';

export default (props) => {
    const removeButton = (props.remove) ? <button onClick={props.remove}>{tc.remove}</button> : null;
    const saveButton = (props.save) ? <button onClick={props.save}>{tc.save}</button> : null;

    return (
        <div className='widgetFooterWrapper'>
            <div className='widgetFooterWrapper__widgetFooter'>
                {removeButton}
                {saveButton}
            </div>
        </div>
    );
}
