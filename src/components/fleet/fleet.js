import React, {useEffect, useState} from 'react';
import {tableHelper, tc} from 'helpers';
import {connect} from 'react-redux';
import history from '../../router_history';
import {getFleet} from 'store/fleet/tasks';
import {TablePropsManaged} from 'components/table';
import Icon from 'components/icon';
import Loading from 'components/loading';
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
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [query, setQuery] = useState(null);
    const [sorting, setSorting] = useState(null);

    const _pageChange = (newPage) => {
        setPage(newPage);
        getFleet({
            koncern: !!state.props.koncern,
            historic: !!state.props.historic,
            page: newPage,
            prospectId: state.props.prospectId,
            rowsPerPage: rowsPerPage,
            query: query,
            sorting: sorting,
        });
    };

    const _reloadData = () => {
        // Reload data clean.
        getFleet({
            koncern: !!state.props.koncern,
            historic: !!state.props.historic,
            page: 0,
            prospectId: state.props.prospectId,
            rowsPerPage: 10,
        });
    };

    const _rowsPerPageChange = (val) => {
        setRowsPerPage(val);
        getFleet({
            koncern: !!state.props.koncern,
            historic: !!state.props.historic,
            page: page,
            prospectId: state.props.prospectId,
            rowsPerPage: val,
            query: query,
            sorting: sorting,
        });
    };

    const _stateCheck = () => {
        return !!(fleet && Object.keys(fleet).length);
    };

    const _searchFleet = (newQuery) => {
        setQuery(newQuery);
        getFleet({
            koncern: !!state.props.koncern,
            historic: !!state.props.historic,
            page: page,
            prospectId: state.props.prospectId,
            rowsPerPage: rowsPerPage,
            query: newQuery,
            sorting: sorting,
        });
    };

    const _sortFleet = (newSorting) => {
        setSorting(newSorting);
        getFleet({
            koncern: !!state.props.koncern,
            historic: !!state.props.historic,
            page: page,
            prospectId: state.props.prospectId,
            rowsPerPage: rowsPerPage,
            query: query,
            sorting: newSorting,
        });
    };

    useEffect(() => {
        getFleet({
            koncern: !!state.props.koncern,
            historic: !!state.props.historic,
            page: 0,
            prospectId: state.props.prospectId,
            rowsPerPage: 10,
        });
    }, [state.props]);

    useEffect(() => {
        if (state.props.historic && state.fleet.fleetHistoric && state.fleet.fleetHistoric.data) {
            if (!state.fleet.fleetHistoric.data.length) {
                setMinimize(true);
            }
            setFleet(state.fleet.fleetHistoric);
        } else if (!state.props.historic && state.fleet.fleet && state.fleet.fleet.data) {
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
                            minimize ?
                                <>
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.maximize}><Icon val='maximize' onClick={() => {
                                        setMinimize(false)
                                        _reloadData();
                                    }}/></Tooltip>
                                </> :
                                <>
                                    {(!window.location.pathname.includes('vagnparksanalys')) && <Tooltip horizontalDirection='left' tooltipContent={tc.navigateToFleetAnalysis}><Icon val='navigate' onClick={() => {history.push('/vagnparksanalys/' + state.props.prospectId)}}/></Tooltip>}
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.minimize}><Icon val='minimize' onClick={() => {setMinimize(true)}}/></Tooltip>
                                </>
                        }
                        headline={(state.props.historic) ? tc.fleetHistoric : tc.fleet}
                        headlineSub={
                            (fleet.total && fleet.data && fleet.data.length) ? `${tc.total} ${fleet.total} ${tc.vehicles.toLowerCase()}` : tc.noVehicles
                        }
                    />
                </div>
                {!minimize &&
                    <div className='fleetWrapper__fleet__content'>
                        <TablePropsManaged
                            columns={tableHelper.getFleetColumns(state.props.historic)}
                            pageChange={_pageChange}
                            rows={tableHelper.getFleetRows(fleet.data, state.props.historic)}
                            rowsPerPage={rowsPerPage}
                            rowsPerPageChange={_rowsPerPageChange}
                            search={_searchFleet}
                            sort={_sortFleet}
                            total={fleet.total}
                        />
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
