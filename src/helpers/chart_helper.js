export const chartHelper = {
    remapArrays1: (data, label1, label2) => {
        try {
            data[0] = data[0].splice(1);
            data[1] = data[1].splice(1);
            let result = data[0].map((num, i) => {
                return [num, data[1][i]];
            });
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
            data.unshift([label1, label2]);
            return data;
        } catch (err) {
            console.error('Could not remap data in chartHelper for: ' + label1 + ':\n' + err);
            return [];
        }
    },
};
