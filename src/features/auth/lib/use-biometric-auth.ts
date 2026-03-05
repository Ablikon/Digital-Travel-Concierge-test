import { useEffect, useCallback } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks';
import {
  setAuthenticated,
  setBiometricAvailable,
  setBiometricType,
  setLoading,
} from '../model/auth-slice';

export function useBiometricAuth() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, biometricAvailable, biometricType, isLoading } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  async function checkBiometricSupport() {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      dispatch(setBiometricAvailable(compatible));

      if (compatible) {
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        dispatch(setBiometricAvailable(enrolled));

        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          dispatch(setBiometricType('Face ID'));
        } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          dispatch(setBiometricType('Touch ID'));
        } else if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
          dispatch(setBiometricType('Iris'));
        }
      }

      dispatch(setLoading(false));
    } catch {
      dispatch(setBiometricAvailable(false));
      dispatch(setLoading(false));
    }
  }

  const authenticate = useCallback(async (): Promise<boolean> => {
    try {
      dispatch(setLoading(true));

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access Digital Travel',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
        fallbackLabel: 'Use passcode',
      });

      dispatch(setAuthenticated(result.success));
      return result.success;
    } catch {
      dispatch(setLoading(false));
      return false;
    }
  }, [dispatch]);

  return {
    isAuthenticated,
    biometricAvailable,
    biometricType,
    isLoading,
    authenticate,
  };
}
