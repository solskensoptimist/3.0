import React from 'react';
import {tc} from 'helpers';

/**
 * Just a footer.
 *
 * @param props.disableRemove - bool (optional)
 * @param props.disableSave - bool (optional)
 * @param props.remove - func (optional)
 * @param props.removeText - string (optional)
 * @param props.save - func (optional)
 * @param props.saveText - string (optional)
 */
export default (props) => {
    const removeButton = (props.remove) ?
        <button
            className={(props.disableRemove) ? 'widgetFooterWrapper__widgetFooter__disabled' : null}
            onClick={(!props.disableRemove) ? props.remove : null}
        >
            {props.removeText ? props.removeText : tc.remove}
        </button> : null;
    const saveButton = (props.save) ?
        <button
            className={(props.disableSave) ? 'widgetFooterWrapper__widgetFooter__disabled' : null}
            onClick={(!props.disableSave) ? props.save : null}
        >
            {props.saveText ? props.saveText : tc.save}
        </button> : null;

    return (
        <div className='widgetFooterWrapper'>
            <div className='widgetFooterWrapper__widgetFooter'>
                {saveButton}
                {removeButton}
            </div>
        </div>
    );
}
