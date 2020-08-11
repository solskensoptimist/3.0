import React, {useEffect, useState} from 'react';
import {tableHelper, tc} from 'helpers';
import {connect} from 'react-redux';
import history from '../../router_history';
import {getFleet, getFleetDebounced} from 'store/fleet/tasks';
import {TablePropsManaged} from 'components/table';
import Icon from 'components/icon';
import Info from 'components/info';
import Loading from 'components/loading';
import Tooltip from 'components/tooltip';
import WidgetHeader from 'components/widget_header';

/**
 * Render a fleet table.
 *
 * When search is used a loading property is set to show Loading component until result from backend is set to store.
 * When loading is not true and there is no rows in data, we show Info component.
 *
 * @param state.props.historic - bool (optional) - Get historic fleet or current.
 * @param state.props.koncern - bool (optional) - Get fleet for koncern.
 * @param state.props.prospectId - string - TS user id to get fleet for.
 */
const Fleet = (state) => {
    const [fleet, setFleet] = useState(null);
    const [minimize, setMinimize] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [query, setQuery] = useState(null);
    const [sorting, setSorting] = useState(null);

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
        if (state.props.historic && state.fleet.fleetHistoric) {
            setFleet(state.fleet.fleetHistoric);
            if (state.fleet.fleetHistoric.data) {
                state.fleet.fleetHistoric.data.length === 0 ? setMinimize(true) : setMinimize(false);
            }
        } else if (!state.props.historic && state.fleet.fleet) {
            setFleet(state.fleet.fleet);
            if (state.fleet.fleet.data) {
                state.fleet.fleet.data.length === 0 ? setMinimize(true) : setMinimize(false);
            }
        }
    }, [state.fleet.fleet, state.fleet.fleetHistoric, state.props]);

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
        setQuery('');
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
        return !!fleet;
    };

    const _searchFleet = (newQuery) => {
        setQuery(newQuery);
        getFleetDebounced({
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
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.reload}><Icon val='reset' onClick={() => {_reloadData()}}/></Tooltip>
                                    {(!window.location.pathname.includes('vagnparksanalys')) && <Tooltip horizontalDirection='left' tooltipContent={tc.navigateToFleetAnalysis}><Icon val='navigate' onClick={() => {history.push('/vagnparksanalys/' + state.props.prospectId)}}/></Tooltip>}
                                    <Tooltip horizontalDirection='left' tooltipContent={tc.minimize}><Icon val='minimize' onClick={() => {setMinimize(true)}}/></Tooltip>
                                </>
                        }
                        headline={(state.props.historic) ? tc.fleetHistoric : tc.fleet}
                        headlineSub={(fleet.loading) ?
                            `${tc.loading}...` :
                            (fleet.data && fleet.data.length === 0) ?
                                tc.noVehicles :
                                (query && query.length) ?
                                    `${tc.showing} ${tc.searchResult.toLowerCase()}: ${fleet.amount} ${tc.vehicles.toLowerCase()}` :
                                    (fleet.amount === 1000 && state.props.historic) ?
                                        `${tc.showing} ${tc.maximum.toLowerCase()} 1000 ${tc.vehicles.toLowerCase()}` :
                                        (fleet.amount === 10000 && !state.props.historic) ?
                                            `${tc.showing} ${tc.maximum.toLowerCase()} 10 000 ${tc.vehicles.toLowerCase()}` :
                                            `${tc.total} ${fleet.total} ${tc.vehicles.toLowerCase()}`
                        }

                    />
                </div>
                {!minimize ?
                    <>
                        {!fleet.loading ?
                            <div className='fleetWrapper__fleet__content'>
                            {(fleet.data && fleet.data.length) ?
                                <TablePropsManaged
                                    columns={tableHelper.getFleetColumns(state.props.historic)}
                                    query={query}
                                    pageChange={_pageChange}
                                    rows={tableHelper.getFleetRows(fleet.data, state.props.historic)}
                                    rowsPerPage={rowsPerPage}
                                    rowsPerPageChange={_rowsPerPageChange}
                                    search={_searchFleet}
                                    sort={_sortFleet}
                                    total={fleet.amount}
                                /> :
                                <Info>
                                    <h4>{tc.noFleet}</h4>
                                    {fleet.query ?
                                        <p>{`${tc.showing} 0 ${tc.of.toLowerCase()} ${fleet.amount}. ${tc.toReset} ${tc.clickOn.toLowerCase()} ${tc.reload.toLowerCase()}.`}</p> :
                                        <p>{tc.noFleetWhy}</p>
                                    }
                                </Info>
                            }
                            </div> :
                            <Loading/>
                        }
                    </> : null
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
