import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  biometricAvailable: boolean;
  biometricType: string | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  biometricAvailable: false,
  biometricType: null,
  isLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload;
      state.isLoading = false;
    },
    setBiometricAvailable(state, action: PayloadAction<boolean>) {
      state.biometricAvailable = action.payload;
    },
    setBiometricType(state, action: PayloadAction<string | null>) {
      state.biometricType = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
    },
  },
});

export const {
  setAuthenticated,
  setBiometricAvailable,
  setBiometricType,
  setLoading,
  logout,
} = authSlice.actions;

export const authReducer = authSlice.reducer;
