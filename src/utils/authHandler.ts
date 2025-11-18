import axios from 'axios';
import store, { RootState } from '../redux/store';
import { logoutUser } from '../redux/slices/userDataSlice';
import { setTokens, clearTokens as clearAuthTokens } from '../redux/slices/authTokenSlice';
import { saveTokens, clearTokens as clearStoredTokens } from '../services/tokenStorage';
import { refreshAuthToken } from '../services/ApiService';
    
let isRefreshing = false;
let failedQueue: any[] = [];

// Queue handler for requests waiting on token refresh
const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

export const handleAuthError = async (error: any, apiInstance: any) => {
    const originalRequest = error.config;
    const status = error?.response?.status;

    // Logout immediately if no retry and status is one of these
    if ((status === 401 || status === 403) && !originalRequest._retry) {
        store.dispatch(logoutUser());
        store.dispatch(clearAuthTokens());
        await clearStoredTokens();
        return Promise.reject(error);
    }

    // Token expired, try refresh flow
    if (status === 440 && !originalRequest._retry) {
        //console.log('[AuthHandler] Token expired (440). Attempting to refresh token...');
        const state: RootState = store.getState();
        const refreshToken = state.authToken.refreshToken;

        if (!refreshToken) {
            // console.warn('[AuthHandler] No refresh token found. Logging out.');
            store.dispatch(logoutUser());
            store.dispatch(clearAuthTokens());
            await clearStoredTokens();
            return Promise.reject(error);
        }

        if (isRefreshing) {
            //console.log('[AuthHandler] Refresh in progress. Queuing request...');
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then((token) => {
                //console.log('[AuthHandler] Retrying request with new token from queue...');
                originalRequest.headers['Authorization'] = `Bearer ${token}`;
                return apiInstance(originalRequest);
            }).catch((e)=>console.log("dscdscsdcc",error));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            //console.log('[AuthHandler] Calling refreshAuthToken API...');
            const response = await refreshAuthToken(refreshToken);
            const { accessToken, refreshToken: newRefreshToken } = response.data;
            if (!accessToken || !newRefreshToken) {
                throw new Error('[AuthHandler] Token refresh response missing required fields');
            }

            // console.log('[AuthHandler] Received new tokens:', {
            //     accessToken,
            //     refreshToken: newRefreshToken,
            // });

            store.dispatch(setTokens({ accessToken, refreshToken: newRefreshToken }));
            await saveTokens({ accessToken, refreshToken: newRefreshToken });

            processQueue(null, accessToken);

            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
            //console.log('[AuthHandler] Retrying original request with new access token...');
            return apiInstance(originalRequest);
        } catch (refreshError) {
            store.dispatch(logoutUser());
            store.dispatch(clearAuthTokens());
            await clearStoredTokens();
            // return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }

    // Flash messages for general errors
    if (!error.response) {
        // showMessage({
        //     message: 'Network error. Please check your internet connection.',
        //     type: 'danger',
        //     duration: 3000,
        // });
    } else if (error.code === 'ECONNABORTED') {
        // showMessage({
        //     message: 'Request timed out. Please try again.',
        //     type: 'danger',
        //     duration: 3000,
        // });
    } else if (error.response.status >= 500) {
        // showMessage({
        //     message: 'Server is currently unavailable. Please try again later.',
        //     type: 'danger',
        //     duration: 3000,
        // });
    } else {
        // showMessage({
        //     message: 'Something went wrong. Please try again.',
        //     type: 'danger',
        //     duration: 3000,
        // });
    }

    return Promise.reject(error);
};