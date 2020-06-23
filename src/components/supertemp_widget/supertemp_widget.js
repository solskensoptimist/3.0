import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {getSupertempData} from 'store/supertemp/tasks';
import Loading from 'components/loading';
import WidgetHeader from 'components/widget_header';
import Tooltip from "../tooltip/tooltip";
import {tc} from "helpers";
import Icon from "../icon/icon";

export const SupertempWidget = (state) => {
    const [data, setData] = useState(null);
    const [minimize, setMinimize] = useState(false);

    const _stateCheck = () => {
        return !!(data);
    };

    useEffect(() => {
        getSupertempData({id: state.props._id, criterias: state.props.data.criterias})
    }, [state.props]);

    useEffect(() => {
        if (state.supertemp.subscriptions && state.supertemp.subscriptions[state.props._id]) {
            setData(state.supertemp.subscriptions[state.props._id]);
        }
    }, [state.supertemp.subscriptions]);

    return (_stateCheck() ?
        <div className='supertempWidgetWrapper'>
            <div className='supertempWidgetWrapper__supertempWidget'>
                <div className='supertempWidgetWrapper__supertempWidget__header'>
                    <WidgetHeader
                        dashboard={minimize ? <Tooltip horizontalDirection='left' tooltipContent={tc.maximize}><Icon val='maximize' onClick={() => {setMinimize(false)}}/></Tooltip> : <Tooltip horizontalDirection='left' tooltipContent={tc.minimize}><Icon val='minimize' onClick={() => {setMinimize(true)}}/></Tooltip>}
                        iconVal='supertemp'
                        headline={tc.supertemp}
                        headlineSub={`${tc.subscription}: ${state.props.name}`}
                    />
                </div>
                {!minimize &&
                    <div className='supertempWidgetWrapper__supertempWidget__content'>
                        {data && data.total && data.total.amount}
                    </div>
                }
            </div>
        </div> :
        <Loading/>
    );
};

const MapStateToProps = (state, props) => {
    return {
        props: props,
        supertemp: state.supertemp,
    };
};

export default connect(
    MapStateToProps,
)(SupertempWidget);
