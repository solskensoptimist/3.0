import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';

const FlashMessages = (state) => {
    const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {
        if (state.flashMessages.showMessage && state.flashMessages.message.length) {
            setShowMessage(true);
        } else {
            setShowMessage(false);
        }
    }, [state.flashMessages]);

    return (showMessage ?
        <div className='flashMessagesWrapper'>
            <div className='flashMessagesWrapper__flashMessages'>
                {state.flashMessages.message}
            </div>
        </div> : null
    );
};

const MapStateToProps = (state) => {
    return {
        flashMessages: state.flashMessages,
    };
};

export default connect(
    MapStateToProps,
)(FlashMessages);
