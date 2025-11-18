// authTokenSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthTokenState {
    tempToken: string | null;
    accessToken: string | null;
    refreshToken: string | null;
    newUserAccessToken: string | null;
    newUserRefreshToken: string | null;
    isInitialized: boolean;
}

const initialState: AuthTokenState = {
    tempToken: null,
    accessToken: sessionStorage.getItem('accessToken'),
    refreshToken: sessionStorage.getItem('refreshToken'),
    newUserAccessToken: null,
    newUserRefreshToken: null,
    isInitialized: false,
};

const authTokenSlice = createSlice({
    name: 'authToken',
    initialState,
    reducers: {
        setTempToken: (state, action: PayloadAction<string>) => {
            state.tempToken = action.payload;
        },
        clearTempToken: (state) => {
            state.tempToken = null;
        },
        setTokens: (
            state,
            action: PayloadAction<{ accessToken: string; refreshToken: string }>
        ) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.tempToken = null;

            sessionStorage.setItem('accessToken', action.payload.accessToken);
            sessionStorage.setItem('refreshToken', action.payload.refreshToken);
        },
        clearTokens: (state) => {
            state.accessToken = null;
            state.refreshToken = null;

            sessionStorage.removeItem('accessToken');
            sessionStorage.removeItem('refreshToken');
        },
        setNewUserTokens: (
            state,
            action: PayloadAction<{ accessToken: string; refreshToken: string }>
        ) => {
            state.newUserAccessToken = action.payload.accessToken;
            state.newUserRefreshToken = action.payload.refreshToken;
            state.tempToken = null;
        },
        clearNewUserTokens: (state) => {
            state.newUserAccessToken = null;
            state.newUserRefreshToken = null;
        },
        setInitialized: (state, action: PayloadAction<boolean>) => {
            state.isInitialized = action.payload;
        },
    },
});

export const { setTempToken, clearTempToken, setTokens, clearTokens, setNewUserTokens, clearNewUserTokens, setInitialized } = authTokenSlice.actions;
export default authTokenSlice.reducer;
