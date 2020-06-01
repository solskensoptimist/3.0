import React, {useEffect, useState} from 'react';
import {tc} from 'helpers';
import {connect} from 'react-redux';
import {getFleet} from 'store/fleet/tasks';
import Icon from 'components/icon';
import Loading from 'components/loading';
import Table from 'components/table';
import Tooltip from 'components/tooltip';
import WidgetHeader from 'components/widget_header';

/**
 * Render a fleet table.
 *
 * @param state.props.historic - bool - Get historic fleet or current.
 * @param state.props.prospectId - string - TS user id to get fleet for.
 */
const Fleet = (state) => {
    const [fleet, setFleet] = useState({});
    const [minimize, setMinimize] = useState(false);

    const columns = React.useMemo(
        () => [
            {
                Header: tc.model,
                accessor: 'real_model',
            },
            {
                Header: tc.brand,
                accessor: 'brand',
            },
            {
                Header: tc.type,
                accessor: 'type'
            },
            {
                Header: tc.regNumber,
                accessor: 'reg_number',
            },
            {
                Header: tc.dateAcquired,
                accessor: 'date_acquired',
            },
            {
                Header: tc.dateSold,
                accessor: 'date_sold',
            },
            {
                Header: tc.boughtPlace,
                accessor: 'seller_name'
            },
        ],
        []
    );

    const _stateCheck = () => {
        return !!(fleet && Object.keys(fleet).length);
    };

    useEffect(() => {
        getFleet({
            // koncern: '',
            historic: !!(state.props.historic),
            // noPagination: '',
            // page: '',
            prospectId: state.props.prospectId,
        });
    }, [state.props]);

    useEffect(() => {
        if (state.props.historic && state && state.fleet && state.fleet.fleetHistoric && state.fleet.fleetHistoric) {
            setFleet(state.fleet.fleetHistoric);
        } else if (state && state.fleet && state.fleet.fleet && state.fleet.fleet) {
            setFleet(state.fleet.fleet);
        }
    }, [state, state.props]);

    return ( _stateCheck() ?
        <div className='fleetWrapper'>
            <div className='fleetWrapper__fleet'>
                <div className='fleetWrapper__fleet__header'>
                    <WidgetHeader
                        iconVal='car'
                        dashboard={
                            minimize ?
                                <>
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.maximize}><Icon val='maximize' onClick={() => {setMinimize(false)}}/></Tooltip>
                                </> :
                                <>
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.minimize}><Icon val='minimize' onClick={() => {setMinimize(true)}}/></Tooltip>
                                </>
                        }
                        headline={(state.props.historic) ? tc.fleetHistoric : tc.fleet}
                        headlineSub={
                            (fleet.total && fleet.amount)
                                ?
                                    fleet.total + ' ' + tc.vehicle.toLowerCase() + ' ' + tc.showing.toLowerCase() + ' ' + fleet.amount + ' st'
                                :
                                    '0 ' + tc.vehicle.toLowerCase() + ' ' + tc.showing.toLowerCase() + ' 0 st'
                        }
                    />
                </div>
                {!minimize &&
                <div className='fleetWrapper__fleet__content'>
                    {(fleet.data && fleet.data.length) ?
                        <Table columns={columns} data={fleet.data} /> :
                        <p>{tc.noFleetData}</p>
                    }
                </div>
                }
            </div>
        </div> :
        <Loading/>
    );
};

const MapStateToProps = (state, props) => {
    return {
        fleet: state.fleet,
        props: props,
    };
};

export default connect(
    MapStateToProps,
)(Fleet);
