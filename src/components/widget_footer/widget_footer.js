import React from 'react';
import {tc} from 'helpers';

/**
 * Just a footer.
 *
 * @param props.disableButtonTwo - bool (optional)
 * @param props.disableButtonOne - bool (optional)
 * @param props.buttonTwoFunc - func (optional)
 * @param props.buttonTwoText - string (optional)
 * @param props.buttonOneFunc - func (optional)
 * @param props.buttonOneText - string (optional)
 */
const WidgetFooter = (props) => {
    const buttonTwo = (props.buttonTwoFunc) ?
        <button
            className={(props.disableButtonTwo) ? 'widgetFooterWrapper__widgetFooter__disabled' : null}
            onClick={(!props.disableButtonTwo) ? props.buttonTwoFunc : null}
        >
            {props.buttonTwoText ? props.buttonTwoText : tc.remove}
        </button> : null;
    const buttonOne = (props.buttonOneFunc) ?
        <button
            className={(props.disableButtonOne) ? 'widgetFooterWrapper__widgetFooter__disabled' : null}
            onClick={(!props.disableButtonOne) ? props.buttonOneFunc : null}
        >
            {props.buttonOneText ? props.buttonOneText : tc.save}
        </button> : null;

    return (
        <div className='widgetFooterWrapper'>
            <div className='widgetFooterWrapper__widgetFooter'>
                {buttonOne}
                {buttonTwo}
            </div>
        </div>
    );
};

export default WidgetFooter;
