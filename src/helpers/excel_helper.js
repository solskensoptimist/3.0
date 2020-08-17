import {tc} from 'helpers';

export const excelHelper = {
    getSectionHeading: (val) => {
        switch(val) {
            case 'carColumns':
                return tc.vehicleInformation;
            case 'contactColumns':
                return tc.contact;
            case 'techColumns':
                return tc.techInformation;
            case 'formatColumns':
                return tc.format;
            case 'userColumns':
                return tc.vehicleUser;
            case 'wheelColumns':
                return tc.wheelData;
            default:
                return val;
        }
    },
    getSelectors: () => {
        return {
            formatColumns: [
                {val: 'duplicateProspect', label: tc.duplicateProspect, active: false},
                {val: 'removeProspectsWithoutNames', label: tc.removeProspectsWithoutNames, active: false},
            ],
            userColumns: [
                {val: 'nameCompany', label: tc.companyName, active: false},
                {val: 'forenamePerson', label: tc.firstNamePerson, active: false},
                {val: 'surenamePerson', label: tc.surNamePerson, active: false},
                {val: 'phone', label: tc.phone, active: false},
                {val: 'address', label: tc.address, active: false},
                {val: 'zip', label: tc.zipcode, active: false},
                {val: 'zipMuncipality', label: tc.zipMuncipalityAllaBolag, active: false},
                {val: 'city', label: tc.township, active: false},
                {val: 'region', label: tc.county, active: false},
                {val: 'age', label: tc.age, active: false},
                {val: 'antanst_AB_X', label: tc.noEmployees, active: false},
                {val: 'numberOfCarsHV', label: tc.numberOfCarsHV, active: false},
                {val: 'numberOfCarsSV', label: tc.numberOfCarsSV, active: false},
                {val: 'numberOfCarsHB', label: tc.numberOfCarsHB, active: false},
                {val: 'numberOfCarsBU', label: tc.numberOfCarsBU, active: false},
                {val: 'numberOfCarsTR', label: tc.numberOfCarsTR, active: false},
                {val: 'numberOfCarsTLB', label: tc.numberOfCarsTLB, active: false},
                {val: 'numberOfCarsLB', label: tc.numberOfCarsLB, active: false},
                {val: 'numberOfCarsPB', label: tc.numberOfCarsPB, active: false},
                {val: 'numberOfCars', label: tc.numberOfCars, active: false},
                {val: 'abv_hgrupp', label: tc.lineOfBusiness + ' 1', active: false},
                {val: 'abv_ugrupp', label: tc.lineOfBusiness + ' 2', active: false},
                {val: 'netoms_AB_X', label: tc.turnover, active: false},
                {val: 'orgNr', label: tc.orgNr, active: false},
                {val: 'solid_NT_AB_X', label: tc.solidity, active: false},
                {val: 'gender', label: tc.prospectType, active: false},
                {val: 'mostCommonBrandBU', label: tc.mostCommonBrandBU, active: false},
                {val: 'mostCommonBrandHB', label: tc.mostCommonBrandHB, active: false},
                {val: 'mostCommonBrandSV', label: tc.mostCommonBrandSV, active: false},
                {val: 'mostCommonBrandHV', label: tc.mostCommonBrandHV, active: false},
                {val: 'mostCommonBrandTLB', label: tc.mostCommonBrandTLB, active: false},
                {val: 'mostCommonBrandLB', label: tc.mostCommonBrandLB, active: false},
                {val: 'mostCommonBrandPB', label: tc.mostCommonBrandPB, active: false},
            ],
            contactColumns: [
                {val: 'email', label: tc.contactEmail, active: false},
                {val: 'tele', label: tc.contactPhone, active: false},
                {val: 'contactName', label: tc.contactName, active: false},
                {val: 'title', label: tc.contactTitle, active: false},
            ],
            carColumns: [
                {val: 'brand', label: tc.brand, active: false},
                {val: 'model_series', label: tc.modelSeries, active: false},
                {val: 'real_trade_name', label: tc.realTradeName, active: false},
                {val: 'real_model', label: tc.realModel, active: false},
                {val: 'reg_number', label: tc.regNumber, active: false},
                {val: 'possession', label: tc.acquiredAges, active: false},
                {val: 'carYear', label: tc.carYear, active: false},
                {val: 'carAge', label: tc.carAgeMonth, active: false},
                {val: 'registrationDate', label: tc.regDate, active: false},
                {val: 'registrationYear', label: tc.regYear, active: false},
                {val: 'boughtCondition', label: tc.boughtCondition, active: false},
                {val: 'boughtPlace', label: tc.boughtPlace, active: false},
                {val: 'sellerId', label: tc.boughtPlaceId, active: false},
                {val: 'salesman', label: tc.salesPersonYourData, active: false},
                {val: 'financed_by', label: tc.financed, active: false},
                {val: 'leasing_owner', label: tc.leasingOwner, active: false},
                {val: 'carType', label: tc.vehicleType, active: false},
            ],
            techColumns: [
                {val: 'shaft_amount', label: tc.shaftAmount, active: false},
                {val: 'shaft_distance1', label: tc.shaftDistance1, active: false},
                {val: 'shaft_distance2', label: tc.shaftDistance2, active: false},
                {val: 'shaft_distance3', label: tc.shaftDistance3, active: false},
                {val: 'chassi', label: tc.chassiNo, active: false},
                {val: 'import', label: tc.import, active: false},
                {val: 'pulley', label: tc.pulley, active: false},
                {val: 'fuel', label: tc.fuel, active: false},
                {val: 'fuel2', label: tc.fuelSecond, active: false},
                {val: 'duo', label: tc.doubleCommand, active: false},
                {val: 'fuel_depletion_usage1', label: tc.fuelDepletion, active: false},
                {val: 'fuel_depletion_usage2', label: tc.fuelDepletionSecond, active: false},
                {val: 'fwd', label: tc.fourwheel, active: false},
                {val: 'color', label: tc.color, active: false},
                {val: 'rental', label: tc.rental, active: false},
                {val: 'car_status', label: tc.inService, active: false},
                {val: 'kaross', label: tc.kaross, active: false},
                {val: 'kaross2', label: tc.kaross2, active: false},
                {val: 'kaross_extra', label: tc.karossExtra, active: false},
                {val: 'coupling1', label: tc.coupling, active: false},
                {val: 'coupling2', label: tc.couplingSecond, active: false},
                {val: 'max_load_weight', label: tc.maxLoadWeight, active: false},
                {val: 'engine_strength_hk', label: tc.engineStrengthHk, active: false},
                {val: 'climate_class', label: tc.climateClass, active: false},
                {val: 'climate_classification', label: tc.climateClassification, active: false},
                {val: 'segmentPB', label: tc.segmentPB, active: false},
                {val: 'segmentHB', label: tc.segmentHB, active: false},
                {val: 'segmentSV', label: tc.segmentSV, active: false},
                {val: 'segmentLLB', label: tc.segmentLB, active: false},
                {val: 'segmentLB1', label: tc.segmentLB1, active: false},
                {val: 'segmentLB2', label: tc.segmentLB2, active: false},
                {val: 'segmentLB3', label: tc.segmentLB3, active: false},
                {val: 'passengers', label: tc.seats, active: false},
                {val: 'weight', label: tc.totalWeight, active: false},
                {val: 'service_weight', label: tc.serviceWeight, active: false},
                {val: 'taxi', label: tc.taxi, active: false},
                {val: 'submission', label: tc.submission, active: false},
                {val: 'co2_usage1', label: tc.co2Usage1, active: false},
                {val: 'co2_usage2', label: tc.co2Usage2, active: false},
                {val: 'co2_usage3', label: tc.co2Usage3, active: false},
            ],
            wheelColumns: [
                {val: 'dack_fram', label: tc.tireFront, active: false},
                {val: 'dack_bak', label: tc.tireBack, active: false},
                {val: 'falg_fram', label: tc.wheelFront, active: false},
                {val: 'falg_bak', label: tc.wheelBack, active: false},
                {val: 'et_fram', label: tc.offsetFront, active: false},
                {val: 'et_bak', label: tc.offsetBack, active: false},
                {val: 'nav_diameter', label: tc.hubDiam, active: false},
                {val: 'bult_cirkel', label: tc.boltCircle, active: false},
                {val: 'bult_antal', label: tc.boltQty, active: false},
                {val: 'bult_ganga', label: tc.boltThread, active: false},
                {val: 'gangstigning', label: tc.boltThreadType, active: false},
                {val: 'hjulinfastning', label: tc.hjulFastener, active: false}
            ]
        };
    },
};
