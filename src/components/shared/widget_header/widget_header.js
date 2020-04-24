import React from 'react';
import Icon from 'components/shared/icon';

/***
 * We use this to render headers for content when they are displayed as a widget.
 *
 * @param props.dashboard (optional) - component/element with content handler (icons with onClicks), usually minimize/maximize is included.
 * @param props.headline - headline
 * @param props.headlineSub (optional) - sub headline
 * @param props.iconVal (optional) - determines which icon to display
 * @returns {*}
 */
export default (props) => {
    const icon = (props.iconVal) ? <Icon val={props.iconVal} /> : null;
    const dashboard = (props.dashboard) ? props.dashboard : null;
    const headline = <h2>{props.headline}</h2>;
    const headlineSub = (props.headlineSub) ? <h3>{props.headlineSub}</h3> : null;

    return (
        <div className='widgetHeaderWrapper'>
            <div className='widgetHeaderWrapper__widgetHeader'>
                <div className='widgetHeaderWrapper__widgetHeader__left'>
                    <div className='widgetHeaderWrapper__widgetHeader__left__left'>
                        {icon}
                    </div>
                    <div className='widgetHeaderWrapper__widgetHeader__left__right'>
                        {headline}
                        {headlineSub}
                    </div>
                </div>
                <div className='widgetHeaderWrapper__widgetHeader__right'>
                    {dashboard}
                </div>
            </div>
        </div>
    );
}
