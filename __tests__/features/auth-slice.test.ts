import {
  authReducer,
  setAuthenticated,
  setBiometricAvailable,
  setBiometricType,
  setLoading,
  logout,
} from '@/features/auth/model/auth-slice';

const initialState = {
  isAuthenticated: false,
  biometricAvailable: false,
  biometricType: null,
  isLoading: true,
};

describe('authSlice', () => {
  it('returns the initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('handles setAuthenticated', () => {
    const state = authReducer(initialState, setAuthenticated(true));
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false);
  });

  it('handles setBiometricAvailable', () => {
    const state = authReducer(initialState, setBiometricAvailable(true));
    expect(state.biometricAvailable).toBe(true);
  });

  it('handles setBiometricType', () => {
    const state = authReducer(initialState, setBiometricType('Face ID'));
    expect(state.biometricType).toBe('Face ID');
  });

  it('handles setLoading', () => {
    const state = authReducer(initialState, setLoading(false));
    expect(state.isLoading).toBe(false);
  });

  it('handles logout', () => {
    const loggedIn = { ...initialState, isAuthenticated: true, isLoading: false };
    const state = authReducer(loggedIn, logout());
    expect(state.isAuthenticated).toBe(false);
  });
});
