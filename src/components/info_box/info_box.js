import React from 'react';
import Icon from 'components/icon';

export default (props) => {
    return (
        <div className='infoBoxWrapper'>
            <div className='infoBoxWrapper__infoBox'>
                <div className='infoBoxWrapper__infoBox__icon'>
                    <Icon val='info'/>
                </div>
                {props.children}
            </div>
        </div>
    );
}
