import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import User, { UserDetails } from '../../types/User';
import { Persistance } from '../../services/storage.service';
import { RootState } from '../../redux/store';

export interface UserState {
  userData: UserDetails | null;
  isAuthenticated: boolean;
  loading: boolean;
  kycData: KYCData 
}

export interface KYCData {
    aadhaarFront: string | null;
    aadhaarBack: string | null;
    panNumber: string | null;
    panFront: string | null;
    preferredRetailers: number[];
  }

const initialState: UserState = {
  userData: null,
  isAuthenticated: false,
  loading: false,
  kycData: {
    aadhaarFront: "",
    aadhaarBack: "",
    panNumber: "",
    panFront: "",
    preferredRetailers: []
  }
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    existingLogin(state) {
      state.isAuthenticated = true;
    },
    loginUser(state, action: PayloadAction<UserDetails>) {
      state.userData = action.payload;
      state.isAuthenticated = true;
      Persistance.storeData({ key: 'isAuthenticated', value: true });
      Persistance.storeData({ key: 'userData', value: action.payload });
    },
    logoutUser(state) {
      state.userData = null;
      state.isAuthenticated = false;
      state.kycData = {
        ...state?.kycData,
        aadhaarBack:null,
        aadhaarFront: null,
        panFront: null,
        panNumber: null,
        preferredRetailers: []
      }
      Persistance.removeData('isAuthenticated');
      Persistance.removeData('userData');
      Persistance.removeData('countryName');
    },
    updateUserData(state, action: PayloadAction<UserDetails>) {
      state.userData = action.payload;
      const { userRoleId, userSubRoleId } = action.payload;
    },
    hydrateUser(state, action: PayloadAction<UserState>) {
      return { ...state, ...action.payload };
    },
    updateKycData(state, action: PayloadAction<KYCData >){
      state.kycData = action?.payload
    },
    clearKycData(state){
      state.kycData = {
        ...state?.kycData,
        aadhaarBack:null,
        aadhaarFront: null,
        panFront: null,
        panNumber: null,
        preferredRetailers: []
      }
    }
  },
});

const selectUserState = (state: RootState) => state.user;

export const hydrateAuth = createAsyncThunk(
  'user/hydrateAuth',
  async (_, { dispatch }) => {
    const authFlag = await Persistance.retrieveData('isAuthenticated');
    const storedUser = await Persistance.retrieveData('userData') as UserDetails;
    if (authFlag && storedUser) {
      dispatch(loginUser(storedUser));
    }
  }
);

export const selectAuthState = createSelector(
  [selectUserState],
  (userState) => ({
    loading: userState.loading,
    isAuthenticated: userState.isAuthenticated,
  })
);

export const { loginUser, logoutUser, existingLogin, updateUserData, hydrateUser, updateKycData, clearKycData } = userSlice.actions;
export default userSlice.reducer;