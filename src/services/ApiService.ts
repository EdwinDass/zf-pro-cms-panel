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

export const getUserProfile = () => {
    return api.get('user/user-profile');
};

export const userLogout = () => {
    return api.get('auth/user-logout');
};

export const resolveTicket = async (ticketId: number, comments: string) => {
    const payload = [
        {
            ticketId,
            resolvedComments: comments
        }
    ];
    return api.post("user/resolve-ticket", payload);
};

export const assignTicket = async (ticketId: number, roleId: number) => {
    const payload = [
        {
            roleId,
            ticketId
        }
    ];
    return api.post("user/assign-ticket", payload);
};

export const getTicketImage = async (ticketId: number) => {
    return api.get(`user/tickets/image?ticketId=${ticketId}`);
};

export const getUserCount = async (params: string) => {
    return api.get(`user/count?${params}`);
};

export const getUserList = async (filters: {
    status?: string;
    role?: number[];
    search?: string;
    page?: number;
    limit?: number;
}) => {
    const query = new URLSearchParams();
    if (filters.status) query.append("status", filters.status);
    if (filters.search) query.append("search", filters.search);
    if (filters.page !== undefined) query.append("page", String(filters.page));
    if (filters.limit !== undefined) query.append("limit", String(filters.limit));
    if (filters.role && filters.role.length > 0) {
        filters.role.forEach(r => query.append("role", String(r)));
    }
    return api.get(`user/list?${query.toString()}`);
};

export const getUserActivityLogs = async (filters: {
    activityType?: "login" | "logout";
    userId?: number;
    fromDate?: string;
    toDate?: string;
    search?: string;
    page?: number;
    limit?: number;
}) => {
    const query = new URLSearchParams();
    if (filters.activityType) query.append("activityType", filters.activityType);
    if (filters.userId !== undefined) query.append("userId", String(filters.userId));
    if (filters.fromDate) query.append("fromDate", filters.fromDate);
    if (filters.toDate) query.append("toDate", filters.toDate);
    if (filters.search) query.append("search", filters.search);
    if (filters.page !== undefined) query.append("page", String(filters.page));
    if (filters.limit !== undefined) query.append("limit", String(filters.limit));
    return api.get(`user/activity/logs?${query.toString()}`);
};

export const getUserRoles = async () => {
    return api.get(`user/roles`);
};

export const activateUser = async (userId: number) => {
    return api.patch(`user/${userId}/activate`);
};

export const deactivateUser = async (userId: number) => {
    return api.patch(`user/${userId}/deactivate`);
};

export const editUser = async (userId: number, payload: any) => {
    return api.put(`user/users/${userId}`, payload);
};

export const getActivityLogs = async (filters: {
    fromDate?: string;
    toDate?: string;
    activityType?: "login" | "logout";
    search?: string;
    page?: number;
    limit?: number;
}) => {
    const query = new URLSearchParams();
    if (filters.fromDate) query.append("fromDate", filters.fromDate);
    if (filters.toDate) query.append("toDate", filters.toDate);
    if (filters.activityType) query.append("activityType", filters.activityType);
    if (filters.search && filters.search.trim().length >= 3) {
        query.append("search", filters.search);
    }
    if (filters.page !== undefined) query.append("page", String(filters.page));
    if (filters.limit !== undefined) query.append("limit", String(filters.limit));
    return api.get(`user/activity/logs?${query.toString()}`);
};

export const addUser = (data: any) => {
    return api.post('user/addUser', data);
};

export const getUserKycsByUserId = async (userId: number, page: number, limit: number) => {
    return api.get(`kyc/kycs`, {
        params: { userId, page, limit }
    });
};

export const updateKycRecords = async (updates: { detailId: number; status: "Approved" | "Rejected" | "Completed"; comment?: string }[]) => {
    return api.post(`kyc/updateKycRecords`, {
        updates
    });
};

export const raiseTicket = async (
    ticketId: string,
    description: string,
    userId: string,
    ticketImage: File | Blob
) => {
    const formData = new FormData();
    formData.append("ticketId", ticketId);
    formData.append("description", description);
    formData.append("userId", userId);
    formData.append("ticket", ticketImage);
    return api.post("user/raise-ticket", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });
};

export const getAdminOtpReport = (params: any) => {
    return api.get("report/otp-report", { params });
};

export const bulkProductScan = async (items: { userCode: string; payload: { qr: string } }[]) => {
    return api
        .post("qr/bulk-product-scan", { items })
        .then((response) => response?.data)
        .catch((error) => { throw error });
};

export const bulkRedeemPoints = async (
    items: { userCode: string; payload: { type: string; value: number } }[]
) => {
    return api
        .post("redeem/bulk-redeem-points", { items })
        .then((response) => response?.data)
        .catch((error) => { throw error });
};

export const getFaqs = async () => {
    return api
        .get("masters/faqs")
        .then((response) => response)
        .catch((error) => { throw error });
};

export const addFaq = async (payload: { faqQuestion: string; faqAnswer: string }) => {
    return api
        .post("masters/faqs", payload)
        .then((response) => response)
        .catch((error) => { throw error });
};

export const deleteFaq = async (faqId: number) => {
    return api
        .delete(`masters/faqs/${faqId}`)
        .then((response) => response);
};

// Amazon Marketplace
export const getAmazonProducts = async (payload: { limit: number; skip: number }) => {
    return api
        .post("amazon-market/products", payload)
        .then((response) => response?.data);
};

export const editAmazonProduct = async (formData: FormData) => {
    return api
        .post("amazon-market/edit-product", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then((response) => response?.data);
};

export const addAmazonProducts = async (data: any[]) => {
    return api
        .post("amazon-market/add-products", data)
        .then((response) => response?.data);
};

export const getDeliveryStatuses = async () => {
    return api.get("amazon-market/delivery-statuses").then((res) => res?.data);
};

export const updateDeliveryStatus = async (payload: { status: string; redemptionId: number }) => {
    return api.post("amazon-market/update-delivery-status", payload)
        .then((response) => response)
        .catch((error) => { throw error });
};
