import React from 'react';
import {tc} from 'helpers';
import {connect} from "react-redux";
import WidgetHeader from 'components/shared/widget_header';

/**
 * Edit a deal.
 * Renders as a popup, closes via props func.
 */
const EditDeal = (state) => {
    return (
        <div className='editDealWrapper'>
            <div className='editDealWrapper__editDeal'>
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
