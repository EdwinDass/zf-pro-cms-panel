import { configureStore } from "@reduxjs/toolkit";

import appConfigReducer from './slices/appConfigSlice'
import userReducer from './slices/userDataSlice'
import authTokenReducer from './slices/authTokenSlice';

const store = configureStore({
    reducer:{
        appConfig:appConfigReducer,
        user:userReducer,
        authToken: authTokenReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store