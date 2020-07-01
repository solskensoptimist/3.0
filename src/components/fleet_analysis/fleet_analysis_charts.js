import React, {useEffect, useState} from 'react';
import {tc} from 'helpers';
import {getFleetAnalysis} from 'store/fleet_analysis/tasks';
import {connect} from 'react-redux';
import {Chart} from 'react-google-charts';
import colors from '../../styles/_colors.scss';
import Icon from 'components/icon';
import Loading from 'components/loading';
import Tooltip from 'components/tooltip';
import WidgetHeader from 'components/widget_header';

/**
 * Render some charts for fleet data.
 *
 * @param state.props.historic - bool - Historic fleet data.
 * @param state.props.prospectId - string - TS user id.
 */
const FleetAnalysisCharts = (state) => {
    const [fleetAnalysis, setFleetAnalysis] = useState({});
    const [minimize, setMinimize] = useState(false);

    const _stateCheck = () => {
        return !!(fleetAnalysis && Object.keys(fleetAnalysis).length && fleetAnalysis.historic === !!state.props.historic && fleetAnalysis.target === state.props.prospectId);
    };

    useEffect(() => {
        getFleetAnalysis({
            historic: state.props.historic,
            prospectId: state.props.prospectId
        });
    }, [state.props]);

    useEffect(() => {
        if (state.props.historic && state.fleetAnalysis && state.fleetAnalysis.fleetAnalysisHistoric && Object.keys(state.fleetAnalysis.fleetAnalysisHistoric).length) {
            setFleetAnalysis(state.fleetAnalysis.fleetAnalysisHistoric);
        } else if (!state.props.historic && state && state.fleetAnalysis && state.fleetAnalysis.fleetAnalysis && Object.keys(state.fleetAnalysis.fleetAnalysis).length) {
            setFleetAnalysis(state.fleetAnalysis.fleetAnalysis);
        }
    }, [state]);

    return (_stateCheck() ?
        <div className='fleetAnalysisChartsWrapper'>
            <div className='fleetAnalysisChartsWrapper__fleetAnalysisCharts'>
                <div className='fleetAnalysisChartsWrapper__fleetAnalysisCharts__header'>
                    <WidgetHeader
                        dashboard={minimize ? <Tooltip horizontalDirection='left' tooltipContent={tc.maximize}><Icon val='maximize' onClick={() => {setMinimize(false)}}/></Tooltip> : <Tooltip horizontalDirection='left' tooltipContent={tc.minimize}><Icon val='minimize' onClick={() => {setMinimize(true)}}/></Tooltip>}
                        iconVal='chart'
                        headline={(state.props.historic) ? tc.fleetAnalysisChartsHistoric : tc.fleetAnalysisCharts}
                        headlineSub={`${tc.total} ${fleetAnalysis.total.total} ${tc.vehicles.toLowerCase()}`}
                    />
                </div>
                {!minimize &&
                    <div className='fleetAnalysisChartsWrapper__fleetAnalysisCharts__content'>
                        <div className='fleetAnalysisChartsWrapper__fleetAnalysisCharts__content__itemThird'>
                            <Chart
                                chartType='PieChart'
                                loader={<Loading/>}
                                data={fleetAnalysis.carType}
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
                                data={fleetAnalysis.new}
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
                                data={fleetAnalysis.finance}
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
                                data={fleetAnalysis.brands}
                                options={{
                                    colors: [colors.chartColor4],
                                    bars: 'horizontal',
                                    title: tc.brands,
                                    chartArea: {width: '30%' },
                                    hAxis: {
                                        title: tc.brands,
                                        minValue: 0,
                                    },
                                    vAxis: {
                                        title: tc.amount,
                                    },
                                }}
                            />
                        </div>
                        <div className='fleetAnalysisChartsWrapper__fleetAnalysisCharts__content__itemHalf'>
                            <Chart
                                chartType='Bar'
                                loader={<Loading/>}
                                data={fleetAnalysis.models}
                                options={{
                                    colors: [colors.chartColor5],
                                    bars: 'horizontal',
                                    title: tc.models,
                                    chartArea: {width: '30%'},
                                    hAxis: {
                                        title: tc.models,
                                        minValue: 0,
                                    },
                                    vAxis: {
                                        title: tc.amount,
                                    },
                                }}
                            />
                        </div>
                        <div className='fleetAnalysisChartsWrapper__fleetAnalysisCharts__content__itemHalf'>
                            <Chart
                                chartType='Bar'
                                loader={<Loading/>}
                                data={fleetAnalysis.carYear}
                                options={{
                                    colors: [colors.chartColor6],
                                    bars: 'horizontal',
                                    title: tc.models,
                                    chartArea: {width: '30%'},
                                    hAxis: {
                                        title: tc.carYear,
                                        minValue: 0,
                                    },
                                    vAxis: {
                                        title: tc.amount,
                                    },
                                }}
                            />
                        </div>
                        <div className='fleetAnalysisChartsWrapper__fleetAnalysisCharts__content__itemHalf'>
                            <Chart
                                chartType='Bar'
                                loader={<Loading/>}
                                data={fleetAnalysis.regYear}
                                options={{
                                    colors: [colors.chartColor7],
                                    bars: 'horizontal',
                                    title: tc.models,
                                    chartArea: {width: '30%'},
                                    hAxis: {
                                        title: tc.regYear,
                                        minValue: 0,
                                    },
                                    vAxis: {
                                        title: tc.amount,
                                    },
                                }}
                            />
                        </div>
                        <div className='fleetAnalysisChartsWrapper__fleetAnalysisCharts__content__itemHalf'>
                            <Chart
                                chartType='Bar'
                                loader={<Loading/>}
                                data={fleetAnalysis.kaross}
                                options={{
                                    colors: [colors.chartColor1],
                                    bars: 'horizontal',
                                    title: tc.models,
                                    chartArea: {width: '30%'},
                                    hAxis: {
                                        title: tc.carBody,
                                        minValue: 0,
                                    },
                                    vAxis: {
                                        title: tc.amount,
                                    },
                                }}
                            />
                        </div>
                        <div className='fleetAnalysisChartsWrapper__fleetAnalysisCharts__content__itemHalf'>
                            <Chart
                                chartType='Bar'
                                loader={<Loading/>}
                                data={fleetAnalysis.boughtPlace}
                                options={{
                                    colors: [colors.chartColor2],
                                    bars: 'horizontal',
                                    title: tc.models,
                                    chartArea: {width: '30%'},
                                    hAxis: {
                                        title: tc.sellerName,
                                        minValue: 0,
                                    },
                                    vAxis: {
                                        title: tc.amount,
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

