import React from 'react';
import Icon from 'components/shared/icon';

/***
 * We use this to render headers for content/widgets in a consistent fashion.
 *
 * @param props.dashboard (optional) - div with icons that handles the content
 * @param props.headline - headline of widget
 * @param props.headlineSub (optional) - sub headline of widget
 * @param props.iconVal - value for icon
 * @returns {*}
 */
export default (props) => {
    const icon = <Icon val={props.iconVal} />;
    const dashboard = (props.dashboard) ? props.dashboard : null;
    const headline = <h2>{props.headline}</h2>;
    const headlineSub = (props.headlineSub) ? <h3>{props.headlineSub}</h3> : null;

    return (
        <div className='headerWrapper'>
            <div className='headerWrapper__header'>
                <div className='headerWrapper__header__headline'>
                    <div className='headerWrapper__header__headline__left'>
                        {icon}
                    </div>
                    <div className='headerWrapper__header__headline__center'>
                        {headline}
                        {headlineSub}
                    </div>
                    <div className='headerWrapper__header__headline__right'>
                        {dashboard}
                    </div>
                </div>
            </div>
        </div>
    );
}
