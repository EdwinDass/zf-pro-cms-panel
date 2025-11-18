import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AppConfig from '../../types/AppConfig';

const initialState:AppConfig={
    language:'en',
    theme:'light'
}

interface ChangeLocalePayload {
    language: string; 
}

interface ChangeThemePayload {
    theme: string; 
}

const appConfigSlice = createSlice({
    name:'app-config',
    initialState,
    reducers:{
        changeLocale(state,action:PayloadAction<ChangeLocalePayload>){
            console.log('payload',action.payload)
           state.language = action.payload.language
           console.log('state',state)
        },
        changeTheme(state,action:PayloadAction<ChangeThemePayload>){
            state.theme = action.payload.theme
        }
    }
})

export const { changeLocale,changeTheme} = appConfigSlice.actions;
export default appConfigSlice.reducer;