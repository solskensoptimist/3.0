import React from 'react';
import {tc} from 'helpers';

export default () => {
    return (
        <div className='logotypeWrapper'>
            <div className='logotype'>
                <img src={__dirname + 'images/logo_white.png'} alt={tc.imgTextLogo} />
            </div>
        </div>
    );
}
