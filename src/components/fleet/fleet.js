import React, {useEffect, useState} from 'react';
import {tableHelper, tc} from 'helpers';
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

    // const columns = React.useMemo(
    //     () => [
    //         {
    //             Header: tc.model,
    //             accessor: 'real_model',
    //         },
    //         {
    //             Header: tc.brand,
    //             accessor: 'brand',
    //         },
    //         {
    //             Header: tc.type,
    //             accessor: 'type'
    //         },
    //         {
    //             Header: tc.regNumber,
    //             accessor: 'reg_number',
    //         },
    //         {
    //             Header: tc.dateAcquired,
    //             accessor: 'date_acquired',
    //         },
    //         {
    //             Header: tc.dateSold,
    //             accessor: 'date_sold',
    //         },
    //         {
    //             Header: tc.boughtPlace,
    //             accessor: 'seller_name'
    //         },
    //     ],
    //     []
    // );

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
        if (state.props.historic && state && state.fleet && state.fleet.fleetHistoric && state.fleet.fleetHistoric && state.fleet.fleetHistoric.data) {
            if (!state.fleet.fleetHistoric.data.length) {
                setMinimize(true);
            }
            setFleet(state.fleet.fleetHistoric);
        } else if (state && state.fleet && state.fleet.fleet && state.fleet.fleet && state.fleet.fleet.data) {
            if (!state.fleet.fleet.data.length) {
                setMinimize(true);
            }
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
                            (fleet.data && fleet.data.length) ?
                                minimize ?
                                    <>
                                        <Tooltip horizontalDirection='left' tooltipContent={tc.maximize}><Icon val='maximize' onClick={() => {setMinimize(false)}}/></Tooltip>
                                    </> :
                                    <>
                                        <Tooltip horizontalDirection='left' tooltipContent={tc.minimize}><Icon val='minimize' onClick={() => {setMinimize(true)}}/></Tooltip>
                                    </> :
                                null
                        }
                        headline={(state.props.historic) ? tc.fleetHistoric : tc.fleet}
                        headlineSub={
                            (fleet.data && fleet.data.length) ?
                                (fleet.total && fleet.amount)
                                    ?
                                        fleet.total + ' ' + tc.vehicle.toLowerCase() + ' ' + tc.showing.toLowerCase() + ' ' + fleet.amount + ' st'
                                    :
                                        '0 ' + tc.vehicle.toLowerCase() + ' ' + tc.showing.toLowerCase() + ' 0 st' :
                            tc.noVehicles
                        }
                    />
                </div>
                {(!minimize && fleet.data && fleet.data.length) &&
                <div className='fleetWrapper__fleet__content'>
                    <Table columns={tableHelper.getFleetColumns(state.props.historic)} linkRows={true} rows={tableHelper.getFleetRows(fleet.data, state.props.historic)}/>
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
