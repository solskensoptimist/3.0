import React, {useEffect, useState} from 'react';
import {tc} from 'helpers';
import {Chart} from 'react-google-charts';
import colors from '../../styles/_colors.scss';
import Icon from 'components/icon';
import Loading from 'components/loading';
import Tooltip from 'components/tooltip';
import WidgetHeader from 'components/widget_header';

/**
 * Render some charts for fleet data.
 *
 * @param props.data - object - Fleet analysis data.
 * @param props.historic - bool - Historic or not.
 */
export default (props) => {
    const [minimize, setMinimize] = useState(false);

    useEffect(() => {
        setMinimize((props.data.total.total === 0));
    }, [props.data]);

    return (
        <div className='fleetAnalysisChartsWrapper'>
            <div className='fleetAnalysisChartsWrapper__fleetAnalysisCharts'>
                <div className='fleetAnalysisChartsWrapper__fleetAnalysisCharts__header'>
                    <WidgetHeader
                        dashboard={
                            <>
                                {(minimize && (props.data.total.total !== 0)) && <Tooltip horizontalDirection='left' tooltipContent={tc.maximize}><Icon val='maximize' onClick={() => {setMinimize(false)}}/></Tooltip>}
                                {(!minimize && (props.data.total.total !== 0)) && <Tooltip horizontalDirection='left' tooltipContent={tc.minimize}><Icon val='minimize' onClick={() => {setMinimize(true)}}/></Tooltip>}
                            </>
                        }
                        iconVal='chart'
                        headline={(props.historic) ? tc.fleetAnalysisChartsHistoric : tc.fleetAnalysisCharts}
                        headlineSub={((props.data.total.total === 0)) ?
                            tc.noVehicles :
                            `${tc.total} ${props.data.total.total} ${tc.vehicles.toLowerCase()}`
                        }
                    />
                </div>
                {!minimize &&
                    <div className='fleetAnalysisChartsWrapper__fleetAnalysisCharts__content'>
                        <div className='fleetAnalysisChartsWrapper__fleetAnalysisCharts__content__itemThird'>
                            <Chart
                                chartType='PieChart'
                                loader={<Loading/>}
                                data={props.data.carType}
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
                                data={props.data.new}
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
                                data={props.data.finance}
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
                                data={props.data.brands}
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
                                data={props.data.models}
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
                                data={props.data.carYear}
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
                                data={props.data.regYear}
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
                                data={props.data.kaross}
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
                                data={props.data.boughtPlace}
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
        </div>
    );
};

