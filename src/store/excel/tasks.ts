import {store} from 'store';
import {excelHelper, request, tc} from 'helpers';
import {excelActionTypes} from './actions';
import {showFlashMessage} from 'store/flash_messages/tasks';
import axios from 'axios';

/**
 *
 * @param payload.listIds - array
 * @param payload.selectors - object - Columns with active values.
 */
export const convertListsToExcel = async (payload) => {
    try {
        if (!payload.listIds || (payload.listIds && !payload.listIds.length)) {
            console.error('Missing params in convertListsToExcel ');
        }

        // Format data that is sent...
        let listsString = '';
        payload.listIds.forEach((id, i) => {
            if (i === payload.listIds.length - 1) {
                listsString += id;
            } else {
                listsString += id + ',';
            }
        });

        let duplicateProspect = false;
        let removeProspectsWithoutNames = false;
        if (payload.selectors.hasOwnProperty('formatColumns')) {
            payload.selectors.formatColumns.forEach((num) => {
                if (num.val === 'duplicateProspect') {
                    duplicateProspect = true;
                }
                if (num.val === 'removeProspectsWithoutNames') {
                    removeProspectsWithoutNames = true;
                }
            });

            delete payload.selectors.formatColumns;
        }

        // ...send request to backend to execute search and create excel file...
        const excelFile = await request({
            data: {
                columns: JSON.stringify(payload.selectors),
                dataSourceParameters: listsString,
                duplicateProspect: duplicateProspect,
                no_socket: true,
                removeProspectsWithoutNames: removeProspectsWithoutNames,
            },
            method: 'post',
            url: '/lists/exportToExcel/',
        });

        console.log('excelFile tillbaka', excelFile);

        if (excelFile instanceof Error) {
            console.error('Error in convertListsToExcel ', excelFile);
            return showFlashMessage(tc.couldNotExportToExcel);
        }

        // ...file is ready, open in browser using axios in this format to make sure we're going through proxy.
        axios.request({
            url: excelFile,
            method: 'GET',
            responseType: 'blob',
        }).then(({data}) => {
            const url = window.URL.createObjectURL(new Blob([data]));
            const a = document.createElement('a');
            a.href = url;
            const splits = excelFile.split('/');
            const filename = splits[splits.length - 1];
            a.setAttribute('download', filename);
            document.body.appendChild(a);
            a.click();
            a.remove();
            return showFlashMessage(tc.excelExportSuccess);
        }).catch((err) => {
            console.error('Error in convertListsToExcel, second step:\n' + err);
            return showFlashMessage(tc.couldNotExportToExcel);
        });
    } catch (err) {
        return console.error('Error in convertListsToExcel:\n' + err);
    }
};

export const getSavedExcelSelectors = async () => {
    try {
        let data = await request({
            method: 'get',
            url: '/excel/getselectors/',
        });

        if (data instanceof Error) {
            console.error('Error in getSavedSelectors', data);
            return store.dispatch({type: excelActionTypes.SET_SAVED_SELECTORS, payload: []});
        }

        if (!data) {
            return store.dispatch({type: excelActionTypes.SET_SAVED_SELECTORS, payload: []});
        } else {
            const selectors = excelHelper.getSelectors();

            // Make sure all saved values is still relevant, filter out values that doesnt exist in excelHelper.getSelectors.
            const filteredData = data.filter((num) => {
                let hit = false;
                for (const prop in selectors) {
                    if (selectors[prop].find((x) => x.label === num)) {
                        hit = true;
                    }
                }
                return hit;
            });

            return store.dispatch({type: excelActionTypes.SET_SAVED_SELECTORS, payload: filteredData});
        }
    } catch (err) {
        return console.error('Error in getSavedExcelSelectors:\n' + err);
    }
};
