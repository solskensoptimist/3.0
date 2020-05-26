import axios from 'axios';

/**
 * Helper to make requests.
 *
 * @param payload.data (optional)
 * @param payload.method
 * @param payload.url
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

        if (payload.method === 'get' || payload.method === 'delete') {
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

/**
 * Where you know you have to send a body rather than query, you can you this.
 */
export const requestWithBody = async (payload) => {
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

        Object.assign(params, {data: payload.data});

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
