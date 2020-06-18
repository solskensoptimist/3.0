import {tc} from 'helpers';


export const vehicleHelper = {
    getVehicleTypeFromAbbr: (abbr) => {
        const type = tc[abbr.toLowerCase()];
        return (type) ? type : abbr;
    },
};
