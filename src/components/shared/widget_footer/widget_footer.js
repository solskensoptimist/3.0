import React from 'react';
import {tc} from 'helpers';

export default (props) => {
    const saveButton = (props.save) ? <button onClick={props.save}>{tc.save}</button> : null;

    return (
        <div className='widgetFooterWrapper'>
            <div className='widgetFooterWrapper__widgetFooter'>
                {saveButton}
            </div>
        </div>
    );
}
