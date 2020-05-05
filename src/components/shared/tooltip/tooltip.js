import React from 'react';

/**
 * Adds a tooltip to components.
 *
 * @param props.horizontalCirection (optional) - left|right
 * @param props.verticalDirection (optional) - top|bottom
 */
export default (props) => {
    let style = (props.horizontalDirection === 'left') ? {right: '0'} : {left: '0'};
    if (props.verticalDirection === 'bottom') {
        style = Object.assign(style, {top: 'calc(100% + 12px)'});
    } else {
        style = Object.assign(style, {bottom: 'calc(100%  + 12px)'});
    }

    return (
        <div className='tooltipWrapper'>
            <div className='tooltipWrapper__tooltip'>
                <div className='tooltipWrapper__tooltip__hover' style={style}>
                    {props.tooltipContent}
                </div>
                <div className='tooltipWrapper__tooltip__content'>
                    {props.children}
                </div>
            </div>
        </div>
    );
}
