import React, {useEffect, useState} from 'react';
import {chartHelper, tc} from 'helpers';
import {getFleet} from 'store/fleet_analysis/tasks';
import {connect} from 'react-redux';
import {Chart} from 'react-google-charts';
import colors from '../../styles/_colors.scss';
import Loading from 'components/loading';
import WidgetHeader from 'components/widget_header';
import Tooltip from "../tooltip/tooltip";
import Icon from "../icon/icon";

const FleetAnalysisCharts = (state) => {
    const [dataIsCollected, setDataIsCollected] = useState(false);
    const [minimize, setMinimize] = useState(false);

    const _stateCheck = () => {
        return !!dataIsCollected;
    };

    useEffect(() => {
        const getData = async () => {
            await getFleet({
                koncern: false,
                historic: false,
                prospectId: state.props.prospectId,
            });

            setDataIsCollected(true);
        };

        getData();
    }, [state.props.prospectId]);

    return (_stateCheck() ?
        <div className='fleetAnalysisChartsWrapper'>
            <div className='fleetAnalysisChartsWrapper__fleetAnalysisCharts'>
                <div className='fleetAnalysisChartsWrapper__fleetAnalysisCharts__header'>
                    <WidgetHeader
                        dashboard={minimize ? <Tooltip horizontalDirection='left' tooltipContent={tc.maximize}><Icon val='maximize' onClick={() => {setMinimize(false)}}/></Tooltip> : <Tooltip horizontalDirection='left' tooltipContent={tc.minimize}><Icon val='minimize' onClick={() => {setMinimize(true)}}/></Tooltip>}
                        iconVal='chart'
                        headline={tc.fleetAnalysisCharts}
                        headlineSub={tc.inCharts}
                    />
                </div>
                {!minimize &&
                    <div className='fleetAnalysisChartsWrapper__fleetAnalysisCharts__content'>
                        <div className='fleetAnalysisChartsWrapper__fleetAnalysisCharts__content__itemThird'>
                            <Chart
                                chartType='PieChart'
                                loader={<Loading/>}
                                data={chartHelper.getVehicleTypes(state.fleetAnalysis.fleet.data)}
                                options={{
                                    colors: [colors.chartColor1, colors.chartColor2, colors.chartColor3, colors.chartColor4, colors.chartColor5, colors.chartColor6, colors.chartColor7, colors.chartColor8, colors.chartColor9, colors.chartColor10],
                                    is3D: true,
                                    title: tc.vehicleTypes,
                                }}
                            />
                        </div>
                        <div className='fleetAnalysisChartsWrapper__fleetAnalysisCharts__content__itemThird'>
                            <Chart
                                chartType='PieChart'
                                loader={<Loading/>}
                                data={chartHelper.getNew(state.fleetAnalysis.fleet.data)}
                                options={{
                                    colors: [colors.chartColor3, colors.chartColor2, colors.chartColor1, colors.chartColor5, colors.chartColor4, colors.chartColor6, colors.chartColor7, colors.chartColor8, colors.chartColor9, colors.chartColor10],
                                    is3D: true,
                                    title: tc.bought,
                                }}
                            />
                        </div>
                        <div className='fleetAnalysisChartsWrapper__fleetAnalysisCharts__content__itemThird'>
                            <Chart
                                chartType='PieChart'
                                loader={<Loading/>}
                                data={chartHelper.getFinancedBy(state.fleetAnalysis.fleet.data)}
                                options={{
                                    colors: [colors.chartColor2, colors.chartColor1, colors.chartColor3, colors.chartColor4, colors.chartColor5, colors.chartColor6, colors.chartColor7, colors.chartColor8, colors.chartColor9, colors.chartColor10],
                                    is3D: true,
                                    title: tc.financedBy,
                                }}
                            />
                        </div>
                        <div className='fleetAnalysisChartsWrapper__fleetAnalysisCharts__content__itemHalf'>
                            <Chart
                                chartType='Bar'
                                loader={<Loading/>}
                                data={chartHelper.getBrands(state.fleetAnalysis.fleet.data)}
                                options={{
                                    colors: [colors.chartColor4],
                                    bars: 'horizontal',
                                    title: tc.brands,
                                    chartArea: {width: '30%' },
                                    hAxis: {
                                        title: chartHelper.getBrandsAxes().hAxis,
                                        minValue: 0,
                                    },
                                    vAxis: {
                                        title: chartHelper.getBrandsAxes().vAxis,
                                    },
                                }}
                            />
                        </div>
                        <div className='fleetAnalysisChartsWrapper__fleetAnalysisCharts__content__itemHalf'>
                            <Chart
                                chartType='Bar'
                                loader={<Loading/>}
                                data={chartHelper.getModels(state.fleetAnalysis.fleet.data)}
                                options={{
                                    colors: [colors.chartColor5],
                                    bars: 'horizontal',
                                    title: tc.brands,
                                    chartArea: {width: '30%'},
                                    hAxis: {
                                        title: chartHelper.getModelsAxes().hAxis,
                                        minValue: 0,
                                    },
                                    vAxis: {
                                        title: chartHelper.getModelsAxes().vAxis,
                                    },
                                }}
                            />
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
        fleetAnalysis: state.fleetAnalysis,
        props: props,
    };
};

export default connect(
    MapStateToProps,
)(FleetAnalysisCharts);

