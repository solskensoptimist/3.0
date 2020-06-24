import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {getSupertempData} from 'store/supertemp/tasks';
import {NavLink} from 'react-router-dom';
import {tableHelper, tc} from 'helpers';
import Icon from 'components/icon';
import Loading from 'components/loading';
import Tooltip from 'components/tooltip';
import Table from 'components/table';
import WidgetHeader from 'components/widget_header';

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
    }, [state.props._id, state.supertemp.subscriptions]);

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
                    <div className='supertempWidgetWrapper__supertempWidget__content__info'>
                        <div className='supertempWidgetWrapper__supertempWidget__content__info__left'>
                            <h4>{tc.supertempWidgetNew_1}</h4>
                            <h4 className='supertempWidgetEmphasize'>0</h4>
                            <p>{tc.supertempWidgetNew_2}</p>
                        </div>
                        <div className='supertempWidgetWrapper__supertempWidget__content__info__right'>
                            <h4>{tc.supertempWidgetHandle_1}</h4>
                            <h4 className='supertempWidgetEmphasize'>72</h4>
                            <p>{tc.supertempWidgetHandle_2}</p>
                        </div>
                    </div>
                        <Table columns={tableHelper.getSupertempWidgetColumns()} rows={tableHelper.getSupertempWidgetRows(data.items)} rowsPerPage={5}/>
                        <div className='supertempWidgetWrapper__supertempWidget__content__navigate'>
                            <NavLink exact to={`/supertemp/${state.props._id}`}>
                                <h5>{tc.exploreProspects}</h5>
                                <Icon val='navigate'/>
                            </NavLink>
                        </div>
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
