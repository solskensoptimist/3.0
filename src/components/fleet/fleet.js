import React, {useEffect, useState} from 'react';
import {tableHelper, tc} from 'helpers';
import {connect} from 'react-redux';
import history from '../../router_history';
import {getFleet} from 'store/fleet/tasks';
import Icon from 'components/icon';
import Loading from 'components/loading';
import Table from 'components/table';
import Tooltip from 'components/tooltip';
import WidgetHeader from 'components/widget_header';

/**
 * Render a fleet table.
 *
 * @param state.props.historic - bool (optional) - Get historic fleet or current.
 * @param state.props.koncern - bool (optional) - Get fleet for koncern.
 * @param state.props.prospectId - string - TS user id to get fleet for.
 */
const Fleet = (state) => {
    const [fleet, setFleet] = useState({});
    const [minimize, setMinimize] = useState(false);

    const _stateCheck = () => {
        return !!(fleet && Object.keys(fleet).length);
    };

    useEffect(() => {
        getFleet({
            koncern: !!state.props.koncern,
            historic: !!state.props.historic,
            prospectId: state.props.prospectId,
        });
    }, [state.props]);

    useEffect(() => {
        if (state.props.historic && state.fleet && state.fleet.fleetHistoric && state.fleet.fleetHistoric && state.fleet.fleetHistoric.data) {
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
    }, [state]);

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
                                        {(!state.props.historic && !window.location.pathname.includes('vagnparksanalys')) && <Tooltip horizontalDirection='left' tooltipContent={tc.navigateToFleetAnalysis}><Icon val='navigate' onClick={() => {history.push('/vagnparksanalys/' + state.props.prospectId)}}/></Tooltip>}
                                        <Tooltip horizontalDirection='left' tooltipContent={tc.minimize}><Icon val='minimize' onClick={() => {setMinimize(true)}}/></Tooltip>
                                    </> :
                                null
                        }
                        headline={(state.props.historic) ? tc.fleetHistoric : tc.fleet}
                        headlineSub={
                            (fleet.data && fleet.data.length) ?
                                (fleet.total && fleet.amount)
                                    ?
                                        `${tc.showing} ${fleet.total} ${tc.vehicle.toLowerCase()} ${tc.of.toLowerCase()} ${fleet.amount} ${tc.total.toLowerCase()}`
                                    :
                                        `${tc.showing} 0 ${tc.vehicle.toLowerCase()} ${tc.of.toLowerCase()} 0 ${tc.total.toLowerCase()}` :
                            tc.noVehicles
                        }
                    />
                </div>
                {(!minimize && fleet.data && fleet.data.length) &&
                <div className='fleetWrapper__fleet__content'>
                    <Table columns={tableHelper.getFleetColumns(state.props.historic)} rows={tableHelper.getFleetRows(fleet.data, state.props.historic)}/>
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
