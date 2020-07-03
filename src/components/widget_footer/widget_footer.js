import React from 'react';
import {tc} from 'helpers';

/**
 * Just a footer.
 *
 * @param props.remove - func (optional)
 * @param props.removeText - string (optional)
 * @param props.save - func (optional)
 * @param props.saveText - string (optional)
 */
export default (props) => {
    const removeButton = (props.remove) ? <button onClick={props.remove}>{props.removeText ? props.removeText : tc.remove}</button> : null;
    const saveButton = (props.save) ? <button onClick={props.save}>{props.saveText ? props.saveText : tc.save}</button> : null;

    return (
        <div className='widgetFooterWrapper'>
            <div className='widgetFooterWrapper__widgetFooter'>
                {removeButton}
                {saveButton}
            </div>
        </div>
    );
}
