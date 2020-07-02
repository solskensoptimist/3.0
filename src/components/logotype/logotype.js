import React from 'react';
import {tc} from 'helpers';
import {connect} from 'react-redux';

export const Logotype = (state) => {
    const _renderLogo = () => {
        if (state.user.info && state.user.info.verendus_dealer === 1) {
            return <img src={__dirname + 'images/kundprospekt.png'} alt={tc.imgTextLogoKundprospekt} />;
        } else {
            return <img src={__dirname + 'images/logo_white.png'} alt={tc.imgTextLogo} />;
        }
    };

    return (
        <div className='logotypeWrapper'>
            <div className='logotype'>
                {_renderLogo()}
            </div>
        </div>
    );
}

const MapStateToProps = (state) => {
    return {
        user: state.user,
    };
};

export default connect(
    MapStateToProps,
)(Logotype);
