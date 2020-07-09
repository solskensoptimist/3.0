import React from 'react';
import Icon from 'components/icon';

export default (props) => {
    return (
        <div className='infoWrapper'>
            <div className='infoWrapper__info'>
                <div className='infoWrapper__info__icon'>
                    <Icon val='infoOutlined'/>
                </div>
                {props.children}
            </div>
        </div>
    );
}
