import {tc} from 'helpers';
import _ from 'underscore';

/**
 * Remap data for Google charts.
 */
export const chartHelper = {
    getBrands: (fleet) => {
        let brandNames = _.chain(fleet).pluck('brand').uniq().value();
        brandNames = brandNames.sort((a, b) => {
            if ( a < b){
                return -1;
            } else if ( a > b){
                return 1;
            } else {
                return 0;
            }
        });
        brandNames = brandNames.map((num) => [num.slice(0, 1).toUpperCase() + num.slice(1).toLowerCase(), fleet.filter((vehicle) => vehicle.brand === num).length]);
        brandNames.unshift([chartHelper.getBrandsAxes().hAxis, chartHelper.getBrandsAxes().vAxis]);
        return brandNames;
    },
    getBrandsAxes: () => {
        return {hAxis: tc.brands, vAxis: tc.amount};
    },
};
