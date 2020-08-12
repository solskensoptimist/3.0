import {store} from 'store';
import {excelHelper, request} from 'helpers';
import {excelActionTypes} from './actions';
// import {showFlashMessage} from 'store/flash_messages/tasks';

export const getSavedExcelSelectors = async (payload) => {
    try {
        const data = await request({
            method: 'get',
            url: '/excel/getselectors/',
        });

        if (data instanceof Error) {
            console.error('Error in getSavedSelectors', data);
            return store.dispatch({type: excelActionTypes.SET_ACTIVE_SELECTORS, payload: []});
        }

        if (!data) {
            return store.dispatch({type: excelActionTypes.SET_ACTIVE_SELECTORS, payload: []});
        } else {
            const selectors = excelHelper.getSelectors();

            // Additional check that saved values actually exists in selectors val property.
            // Because in old frontend we saved 'label' value instead of 'val' value, so old db objects may have irrelevant values.
            const filteredData = data.filter((num) => {
                let hit = false;
                for (const prop in selectors) {
                    if (selectors[prop].find((x) => x.val === num)) {
                        hit = true;
                    }
                }
                return hit;
            });
            return store.dispatch({type: excelActionTypes.SET_ACTIVE_SELECTORS, payload: filteredData});
        }
    } catch (err) {
        return console.error('Error in getSavedExcelSelectors:\n' + err);
    }
};
