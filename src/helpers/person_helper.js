import {tc} from 'helpers';

export const personHelper = {
    buildPersonDefaultName: (gender, birthYear, zipMuncipality = null) => {
        let string = personHelper.getGenderString(gender) + ', ' + personHelper.getAgeString(+birthYear) + ' ' + tc.years.toLowerCase();
        if (zipMuncipality) {
            string = string + ', ' + zipMuncipality.toUpperCase();
        }

        return string;
    },

    getAgeString: (birthYear) => {
        return (new Date().getFullYear() - birthYear);
    },

    getGenderString: (gender) => {
        if (gender && gender.toUpperCase() === 'M') {
            return tc.male;
        } else if (gender && gender.toUpperCase() === 'F') {
            return tc.female;
        } else if (gender) {
            return tc.genderNotProvided;
        } else {

        }
    },
};
