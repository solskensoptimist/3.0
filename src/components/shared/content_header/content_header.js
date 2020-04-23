import React from 'react';
import Icon from 'components/shared/icon';

/***
 * We use this to render headers for content/widgets in a consistent fashion.
 *
 * @param props.dashboard (optional) - component/element with content handler (for example icons with onClicks).
 * @param props.headline - headline of content_header
 * @param props.headlineSub (optional) - sub headline of content_header
 * @param props.iconVal (optional) - value for icon
 * @returns {*}
 */
export default (props) => {
    const icon = (props.iconVal) ? <Icon val={props.iconVal} /> : null;
    const dashboard = (props.dashboard) ? props.dashboard : null;
    const headline = <h2>{props.headline}</h2>;
    const headlineSub = (props.headlineSub) ? <h3>{props.headlineSub}</h3> : null;

    return (
        <div className='contentHeaderWrapper'>
            <div className='contentHeaderWrapper__contentHeader'>
                <div className='contentHeaderWrapper__contentHeader__left'>
                    <div className='contentHeaderWrapper__contentHeader__left__left'>
                        {icon}
                    </div>
                    <div className='contentHeaderWrapper__contentHeader__left__right'>
                        {headline}
                        {headlineSub}
                    </div>
                </div>
                <div className='contentHeaderWrapper__contentHeader__right'>
                    {dashboard}
                </div>
            </div>
        </div>
    );
}
