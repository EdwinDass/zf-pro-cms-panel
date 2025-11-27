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

export const getAllSkus = async () => {
    return api
        .get("sku/skus")
        .then((response) => response);
};

export const getSubcategoriesBySku = async (skuId: number) => {
    return api
        .get(`sku/skus/${skuId}/subcategories`)
        .then((response) => response);
};

export const getCategories = async () => {
    return api.get("sku/categories").then((res) => res);
};

export const getSubcategoriesByCategory = async (categoryId: number) => {
    return api.get(`sku/categories/${categoryId}/subcategories`).then((res) => res);
};

export const getSkusBySubcategory = async (subCategoryId: number) => {
    return api.get(`sku/subcategories/${subCategoryId}/skus`).then((res) => res);
};

export const getSkusByCategoryAndSubcategory = async (
    categoryId: number,
    subCategoryId: number
) => {
    return api
        .get(`sku/categories/${categoryId}/subcategories/${subCategoryId}/skus`)
        .then((res) => res);
};

export const generateQRCodes = async (quantity: number, skuCode: string) => {
    return api.post("qr/qrs", {
        quantity,
        skuCode,
    });
};

export const getQRHistory = async () => {
    return api
        .get("qr/qrs/history")
        .then((response) => response);
};

export const getQRFile = async (batchId: number) => {
    return api
        .get(`qr/qrs/file`, { params: { batchId } })
        .then((response) => response);
};

export const getTotalGenerated = async () => {
    return api
        .get("masters/inventory/total-count")
        .then((response) => response);
};

export const getTicketCountByStatus = async (status?: string) => {
    const url = status
        ? `masters/tickets/count/status/${status}`
        : `masters/tickets/count/status`;

    return api
        .get(url)
        .then((response) => response);
};

export const getTickets = async (params: { [key: string]: any }) => {
    return api
        .get("user/tickets", { params })
        .then((response) => response);
};

export const getTicketCategories = async () => {
    return api
        .get("masters/tickets/categories")
        .then((response) => response);
};

export const getTicketStatus = async () => {
    return api
        .get("masters/tickets/statuses")
        .then((response) => response);
};

export const getRoles = async () => {
    return api
        .get("user/roles")
        .then((response) => response);
};


export const getRedemptionHistory = async (payload: any) => {
    return api
        .post("redeem/redemptions/history", payload)
        .then((res) => res.data);
};

export const updateRedemptionStatus = async (payload: any) => {
    return api
        .patch("redeem/redemptions", payload)
        .then((response) => response)
        .catch((error) => { throw error });
};

export const getApplicationLoginReport = (data: any) => {
    return api.post('report/application-login', data);
};

export const getregisteredUsersReport = (data: any) => {
    return api.post('report/registered-users', data);
};

export const getQrTransactionReport = (data: any) => {
    return api.post('report/qr-transaction', data);
};

export const getAdminreferralReport = (data: any) => {
    return api.post('report/admin-referal-history', data);
};

export const userLogout = () => {
    return api.get('auth/user-logout');
};