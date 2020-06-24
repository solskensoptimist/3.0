import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {getLeads} from 'store/leads/tasks';
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
        getLeads({limit: 25})
    }, []);

    useEffect(() => {
        if (state.leads && state.leads.data) {
            setData(state.leads.data);
        }
    }, [state.leads]);

    return (_stateCheck() ?
            <div className='leadsWidgetWrapper'>
                <div className='leadsWidgetWrapper__leadsWidget'>
                    <div className='leadsWidgetWrapper__leadsWidget__header'>
                        <WidgetHeader
                            dashboard={minimize ? <Tooltip horizontalDirection='left' tooltipContent={tc.maximize}><Icon val='maximize' onClick={() => {setMinimize(false)}}/></Tooltip> : <Tooltip horizontalDirection='left' tooltipContent={tc.minimize}><Icon val='minimize' onClick={() => {setMinimize(true)}}/></Tooltip>}
                            iconVal='leads'
                            headline={tc.leads}
                            headlineSub={tc.leadsReceived}
                        />
                    </div>
                    {!minimize &&
                    <div className='leadsWidgetWrapper__leadsWidget__content'>
                        <div className='leadsWidgetWrapper__leadsWidget__content__info'>
                            <div className='leadsWidgetWrapper__leadsWidget__content__info__left'>
                                <h4>{tc.leadsWidgetNew_1}</h4>
                                <h4 className='leadsWidgetEmphasize'>{(data.latestBatchCount) ? data.latestBatchCount: 0}</h4>
                                <p>{tc.leadsWidgetNew_2}</p>
                            </div>
                            <div className='leadsWidgetWrapper__leadsWidget__content__info__right'>
                                <h4>{tc.leadsWidgetHandle_1}</h4>
                                <h4 className='leadsWidgetEmphasize'>{(data.totalCount) ? data.totalCount : 0}</h4>
                                <p>{tc.leadsWidgetHandle_2}</p>
                            </div>
                        </div>
                        <Table columns={tableHelper.getLeadsWidgetColumns()} rows={tableHelper.getLeadsWidgetRows((data.items && data.items.length) ? data.items : [])} rowsPerPage={5}/>
                        <div className='leadsWidgetWrapper__leadsWidget__content__navigate'>
                            <NavLink exact to='/leads'>
                                <h5>{tc.exploreLeads}</h5>
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

const MapStateToProps = (state) => {
    return {
        leads: state.leads,
    };
};

export default connect(
    MapStateToProps,
)(SupertempWidget);
