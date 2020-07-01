import {tc} from 'helpers';

const cutOffValue = 10;

export const chartHelper = {
    remapArrays1: (data, label1, label2) => {
        try {
            data[0] = data[0].splice(1);
            data[1] = data[1].splice(1);
            let result = data[0].map((num, i) => {
                const label = (num === 9999999999 || num === '9999999999') ? tc.unknown : num;
                return [label, data[1][i]];
            });
            result = chartHelper.sortArrays(result);
            if (result.length > cutOffValue) {
                // If too many values, return first values and the rest as a collected value.
                const theRest = result.splice(cutOffValue);
                let theRestAmount = 0;
                theRest.forEach((num) => {
                    theRestAmount = theRestAmount + num[1]
                });
                result.push([tc.other, theRestAmount]);
            }
            result = chartHelper.sortArrays(result);
            result.unshift([label1, label2]);
            return result;
        } catch (err) {
            console.error('Could not remap data in chartHelper for: ' + label1 + ':\n' + err);
            return [];
        }
    },
    remapArrays2: (data, label1, label2) => {
        try {
            data = data.splice(1);
            data = chartHelper.sortArrays(data);
            if (data.length > cutOffValue) {
                // If too many values, return first values and the rest as a collected value.
                const theRest = data.splice(cutOffValue);
                let theRestAmount = 0;
                theRest.forEach((num) => {
                    theRestAmount = theRestAmount + num[1]
                });
                data.push([tc.other, theRestAmount]);
            }
            data = chartHelper.sortArrays(data);
            data.unshift([label1, label2]);
            return data;
        } catch (err) {
            console.error('Could not remap data in chartHelper for: ' + label1 + ':\n' + err);
            return [];
        }
    },
    sortArrays: (arr) => {
        return arr.sort((a, b) => {
            if (a[1] < b[1]) {
                return 1;
            } else if ( a[1] > b[1]) {
                return -1;
            } else {
                return 0;
            }
        });
    },
};
