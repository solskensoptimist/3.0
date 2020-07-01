import {store} from 'store';
import {chartHelper, request, tc} from 'helpers';
import {fleetAnalysisActionTypes} from './actions';

/**
 * Fetch fleet analysis data.
 *
 * @param payload.historic - bool - Get historic fleet data.
 * @param payload.prospectId - string - TS user id to fetch data for.
 */
export const getFleetAnalysis = async (payload) => {
    try {
        if (!payload || (payload && !payload.prospectId)) {
            return console.error('Missing params in getFleetAnalysis:\n' + payload);
        } else {
            payload.prospectId = payload.prospectId.toString();
        }

        if (payload.historic) {
            store.dispatch({type: fleetAnalysisActionTypes.SET_FLEET_ANALYSIS_HISTORIC, payload: {}});
        } else {
            store.dispatch({type: fleetAnalysisActionTypes.SET_FLEET_ANALYSIS, payload: {}});
        }

        const historic = payload.historic ? '/historic/' : '';

        const data = await request({
            data: {
                koncern: 0,
            },
            method: 'get',
            url: '/fleet/carAnalyse/' + payload.prospectId + historic,
        });

        if (!data || data instanceof Error) {
            console.log('No data in getFleetAnalysis', data);
            if (payload.historic) {
                return store.dispatch({type: fleetAnalysisActionTypes.SET_FLEET_ANALYSIS_HISTORIC, payload: {}});
            } else {
                return store.dispatch({type: fleetAnalysisActionTypes.SET_FLEET_ANALYSIS, payload: {}});
            }
        }

        // Remap data from (old) backend to suit Google charts.
        const result = {
            brands: chartHelper.remapArrays1(data.brands, tc.brands, tc.amount),
            boughtPlace: chartHelper.remapArrays1(data.boughtPlace, tc.sellerName, tc.amount),
            carType: chartHelper.remapArrays2(data.carType, tc.vehicleTypes, tc.amount),
            carYear: chartHelper.remapArrays1(data.date_car_year, tc.carYear, tc.amount),
            finance: chartHelper.remapArrays2(data.finance, tc.financedBy, tc.amount),
            kaross: chartHelper.remapArrays1(data.kaross, tc.carBody, tc.amount),
            models: chartHelper.remapArrays1(data.models, tc.models, tc.amount),
            new: chartHelper.remapArrays2(data.new, tc.new, tc.amount),
            regYear: chartHelper.remapArrays1(data.regYear, tc.regYear, tc.amount),
            total: data.total,
            target: payload.prospectId,
            historic: !!payload.historic,
        };

        if (payload.historic) {
            return store.dispatch({type: fleetAnalysisActionTypes.SET_FLEET_ANALYSIS_HISTORIC, payload: result});
        } else {
            return store.dispatch({type: fleetAnalysisActionTypes.SET_FLEET_ANALYSIS, payload: result});
        }
    } catch (err) {
        return console.error('Error in getFleetAnalysis:\n' + err);
    }
};
