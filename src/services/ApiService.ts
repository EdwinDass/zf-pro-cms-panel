import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingService from './LoadingService';
import { API_LINK } from '../values/constants';

const api = axios.create({
    baseURL: API_LINK,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        //const token = sessionStorage.getItem('accessToken') || '';
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsIm1vYmlsZSI6IjgwODgxODM3NDciLCJlbWFpbCI6ImxvaGl0aC5nbUBzY2ZwZS50ZWNoIiwidXNlckNvZGUiOiJaRlAwMTAwMDAyIiwiaWF0IjoxNzYzMzc1ODY0LCJleHAiOjE3NjM0NjIyNjR9.cIC_kkHvZQIXDykPCB4deR9GpSTE8PVAsQNxmmNTc_c';
        const loaderFlag = config.headers['loaderFlag'] === false ? false : true;
        config.headers.Authorization = token ? `Bearer ${token}` : '';
        if (loaderFlag) {
            LoadingService.setLoading(true);
        }
        return config;
    },
    (error) => {
        LoadingService.setLoading(false);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        LoadingService.setLoading(false);
        return response;
    },
    (error) => {
        LoadingService.setLoading(false);
        if (error.response) {
            const { status, data } = error.response;
            if (status === 401) {
                console.error('Unauthorized: Token might be expired');
                toast.error('Session expired. Please log in again.');
            } else if (status >= 500) {
                const message = 'Server error. Please try again later.';
                console.error('Server Error:', message);
                toast.error(message);
            } else {
                const message = 'Something went wrong.';
                toast.error(message);
            }
        } else {
            console.error('Network Error:', error.message);
            toast.error('Network error. Please check your connection.');
        }
        return Promise.reject(error);
    }
);

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






