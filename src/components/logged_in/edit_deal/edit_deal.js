import React, {useEffect, useRef} from 'react';
import {tc} from 'helpers';
import WidgetHeader from 'components/shared/widget_header';
import {connect} from "react-redux";
import ReactDOM from "react-dom";

/**
 * Edit a deal.
 * Renders as a popup, closes via props func.
 */
const EditDeal = (state) => {
    const editDealRef = useRef(null);

    const _closeComponent = () => {
        state.props.close();
    };

    useEffect(() => {
        /**
         * When clicking outside EditDeal, close it.
         */
        const _closeEditDeal = (e) => {
            if (editDealRef && editDealRef.current) {
                const node = ReactDOM.findDOMNode(editDealRef.current);
                if (node && !node.contains(e.target)) {
                    _closeComponent();
                }
            }
        };

        window.addEventListener('mousedown', _closeEditDeal);
        return () => window.removeEventListener('mousedown', _closeEditDeal);
    }, []);

    return (
        <div className='editDealWrapper'>
            <div className='editDealWrapper__editDeal' ref={editDealRef}>
                <div className='editDealWrapper__editDeal__header'>
                    <WidgetHeader
                        iconVal='edit'
                        headline={tc.editDeal}
                    />
                </div>
                <div className='editDealWrapper__editDeal__content'>
                    Content
                </div>
            </div>
        </div>
    );
};

const MapStateToProps = (state, props) => {
    return {
        props: props,
    };
};

export default connect(
    MapStateToProps,
)(EditDeal);
