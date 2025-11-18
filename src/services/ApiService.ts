import axios, { AxiosInstance } from "axios";
import { handleAuthError } from "../utils/authHandler";
import { Persistance } from "./storage.service";
import store, { RootState } from "../redux/store";
import { LoginPayload } from "../types";
import { API_LINK } from '../values/constants';

export const api: AxiosInstance = axios.create({
    baseURL: API_LINK,
    headers: {
        'Content-Type': 'application/json',
    },
});

const api2: AxiosInstance = axios.create({
    baseURL: API_LINK,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    async (config) => {
        const state: RootState = store.getState();
        const accessToken = state.authToken.accessToken;
        const tempToken = state.authToken.tempToken;
        const tokenToUse = accessToken || tempToken;

        // console.log('API Request:', {
        //     url: config.url,
        //     method: config.method,
        //     tokenUsed: tokenToUse ? (accessToken ? 'accessToken' : 'tempToken') : 'none',
        //     tokenValue: tokenToUse,
        // });

        if (tokenToUse /* && config.headers?.set */) {
            config.headers.set('Authorization', `Bearer ${tokenToUse}`);
        }

        let userId = '';
        try {
            const storedUser = await Persistance.retrieveData('userData');
            userId = storedUser?.userId?.toString() || '';
        } catch (err) {
            // console.warn('Error fetching userId from persistence:', err);
        }

        // if (config.headers?.set) {
        //     config.headers.set('source', 'zf-web-cms');
        //     config.headers.set('userid', userId);
        //     config.headers.set('app-version', '');
        //     config.headers.set('build-version', '');
        //     config.headers.set('latitude', '');
        //     config.headers.set('longitude', '');
        // }

        // console.log('Headers Sent:', {
        //     Authorization: tokenToUse ? `Bearer ${tokenToUse}` : '',
        //     source: 'honeywell-genetron',
        //     userid: userId,
        //     'app-version': VersionNumber.appVersion || '',
        //     'build-version': String(VersionNumber.buildVersion || ''),
        //     latitude: '',
        //     longitude: '',
        // });

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => handleAuthError(error, api)
);

export const userLogin = async (payload: LoginPayload) => {
    const res = await api.post("auth/signin", payload);
    return res?.data;
}

export const refreshAuthToken = async (token: string) => {
    const body = {
        token,
        type: "zf-loyalty-mobile",
    };
    try {
        const response = await api2.post('auth/refresh-token', body);
        return response.data;
    } catch (error: any) {
        throw error;
    }
};


// Generic: Get member count by passing any query params
export const getMemberCount = async (params: any) => {
    return api
        .get('user/count', { params })
        .then((response) => response);
};

export const getScannedPoints = async (params: any) => {
    return api
        .get('masters/points/scanned', { params })
        .then((response) => response);
};

export const getRedeemedPoints = async (params: any) => {
    return api
        .get('masters/points/redeemed', { params })
        .then((response) => response);
};

export const getTotalScans = async (params: any) => {
    return api
        .get('masters/scans/total', { params })
        .then((response) => response);
};

export const getKycStatus = async (params: any) => {
    return api
        .get('masters/kyc/status', { params })
        .then((response) => response);
};

// Get member registration graph data
export const getUserRegistrations = async (params: { [key: string]: any }) => {
    return api
        .get("masters/users/registered", { params })
        .then((response) => response);
};

// Get points graph data (bar chart)
export const getPointsGraph = async (params: { [key: string]: any }) => {
    return api
        .get("masters/points/points-graph", { params })
        .then((response) => response);
};

// Get recent points transactions
export const getRecentTransactions = async (count: number) => {
    return api
        .get("masters/points/recent-transactions", {
            params: { count }
        })
        .then((response) => response);
};

// Get top performers
export const getTopPerformers = async (count: number) => {
    return api
        .get("masters/users/top-performers", {
            params: { count }
        })
        .then((response) => response);
};






