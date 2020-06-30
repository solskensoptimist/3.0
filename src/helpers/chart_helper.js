import {tc} from 'helpers';
import _ from 'underscore';

/**
 * Remap data for Google charts.
 */
export const chartHelper = {
    getBrands: (fleet) => {
        let data = _.chain(fleet).pluck('brand').uniq().value();
        data = data.sort((a, b) => {
            if ( a < b){
                return -1;
            } else if ( a > b){
                return 1;
            } else {
                return 0;
            }
        });
        data = data.map((num) => [num.slice(0, 1).toUpperCase() + num.slice(1).toLowerCase(), fleet.filter((vehicle) => vehicle.brand === num).length]);
        data.unshift([chartHelper.getBrandsAxes().hAxis, chartHelper.getBrandsAxes().vAxis]);
        return data;
    },
    getBrandsAxes: () => {
        return {hAxis: tc.brands, vAxis: tc.amount};
    },
    getFinancedBy: (fleet) => {
        let data = _.chain(fleet).pluck('financed_by').uniq().value();
        data = data.sort((a, b) => {
            if ( a < b){
                return -1;
            } else if ( a > b){
                return 1;
            } else {
                return 0;
            }
        });
        data = data.map((num) => [num, fleet.filter((vehicle) => vehicle.financed_by === num).length]);
        data.unshift([chartHelper.getFinancedByAxes().hAxis, chartHelper.getFinancedByAxes().vAxis]);
        return data;
    },
    getFinancedByAxes: () => {
        return {hAxis: tc.financedBy, vAxis: tc.amount};
    },
    getModels: (fleet) => {
        let data = _.chain(fleet).pluck('model').uniq().value();
        data = data.sort((a, b) => {
            if ( a < b){
                return -1;
            } else if ( a > b){
                return 1;
            } else {
                return 0;
            }
        });
        data = data.map((num) => [num.slice(0, 1).toUpperCase() + num.slice(1).toLowerCase(), fleet.filter((vehicle) => vehicle.model === num).length]);
        data.unshift([chartHelper.getModelsAxes().hAxis, chartHelper.getModelsAxes().vAxis]);
        return data;
    },
    getModelsAxes: () => {
        return {hAxis: tc.models, vAxis: tc.amount};
    },
    getNew: (fleet) => {
        const newVehicles = fleet.filter((num) => num.new === 1).length;
        const usedVehicles = fleet.length - newVehicles;
        let data = [[tc.new, newVehicles], [tc.used, usedVehicles]];
        data = data.sort((a, b) => {
            if ( a[1] < b[1]){
                return 1;
            } else if ( a[1] > b[1]){
                return -1;
            } else {
                return 0;
            }
        });
        data.unshift([chartHelper.getNewAxes().hAxis, chartHelper.getNewAxes().vAxis]);
        return data;
    },
    getNewAxes: () => {
        return {hAxis: tc.new, vAxis: tc.amount};
    },
    getVehicleTypes: (fleet) => {
        let data = _.chain(fleet).pluck('type').uniq().value();
        data = data.map((num) => [num, fleet.filter((vehicle) => vehicle.type === num).length]);
        data = data.sort((a, b) => {
            if ( a[1] < b[1]){
                return 1;
            } else if ( a[1] > b[1]){
                return -1;
            } else {
                return 0;
            }
        });
        data = data.map((num) => {
            num[0] = tc[num[0].toLowerCase()]; // Turn abbrevation to word.
            return num;
        });
        data.unshift([chartHelper.getVehicleTypesAxes().hAxis, chartHelper.getVehicleTypesAxes().vAxis]);
        return data;
    },
    getVehicleTypesAxes: () => {
        return {hAxis: tc.vehicleTypes, vAxis: tc.amount};
    },
};
