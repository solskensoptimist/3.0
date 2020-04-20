import axios from 'axios';

/**
 * Helper to make requests.
 *
 * @param payload.url
 * @param payload.method
 */
export const request = async (payload) => {
    try {
        let params = {
            url: payload.url,
            method: payload.method,
            headers: {
                'Content-Type' : 'application/json',
                'Cache': 'no-cache'
            },
            withCredentials: true // Important for authentication to backend.
        };

        if (payload.method === 'get') {
            Object.assign(params, {params: payload.data});
        } else {
            Object.assign(params, {data: payload.data});
        }

        const res = await axios(params);

        if (res && res.data) {
            return res.data;
        } else {
            return null;
        }
    } catch (err) {
        return err;
    }
};
