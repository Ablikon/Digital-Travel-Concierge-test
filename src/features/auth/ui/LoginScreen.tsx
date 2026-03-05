import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useBiometricAuth } from '../lib/use-biometric-auth';

export function LoginScreen() {
  const { biometricAvailable, biometricType, isLoading, authenticate } = useBiometricAuth();
  const [error, setError] = useState<string | null>(null);

  async function handleAuthenticate() {
    setError(null);
    const success = await authenticate();
    if (!success) {
      setError('Authentication failed. Please try again.');
    }
  }

  function getBiometricIcon() {
    if (biometricType === 'Face ID') {
      return <MaterialCommunityIcons name="face-recognition" size={28} color="#FFFFFF" />;
    }
    return <Ionicons name="finger-print" size={28} color="#FFFFFF" />;
  }

  function getBiometricLabel() {
    if (!biometricAvailable) return 'Sign in with Passcode';
    if (biometricType) return `Sign in with ${biometricType}`;
    return 'Sign in with Biometrics';
  }

  return (
    <LinearGradient
      colors={['#4338CA', '#4F46E5', '#6366F1']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <View className="flex-1 items-center justify-center px-8">
        <View className="mb-14 items-center">
          <View
            className="mb-8 h-28 w-28 items-center justify-center rounded-[32px]"
            style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.2)',
            }}
          >
            <View
              className="h-16 w-16 items-center justify-center rounded-2xl"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              <Ionicons name="globe-outline" size={36} color="#FFFFFF" />
            </View>
          </View>

          <Text className="text-center text-[32px] font-extrabold text-white">
            Digital Travel
          </Text>
          <Text className="mt-2 text-center text-[15px] text-white/60">
            Your personal news companion
          </Text>
        </View>

        <View className="w-full items-center" style={{ maxWidth: 360 }}>
          <Pressable
            onPress={handleAuthenticate}
            disabled={isLoading}
            className={`w-full flex-row items-center justify-center rounded-2xl px-6 py-4 ${
              isLoading ? 'opacity-60' : ''
            }`}
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.25)',
            }}
          >
            {isLoading ? (
              <AntDesign name="loading" size={22} color="#FFFFFF" />
            ) : (
              getBiometricIcon()
            )}
            <Text className="ml-3 text-[16px] font-semibold text-white">
              {isLoading ? 'Authenticating...' : getBiometricLabel()}
            </Text>
          </Pressable>

          {error && (
            <View
              className="mt-4 w-full flex-row items-center justify-center rounded-2xl px-4 py-3"
              style={{ backgroundColor: 'rgba(239,68,68,0.2)' }}
            >
              <AntDesign name="exclamation-circle" size={15} color="#FCA5A5" />
              <Text className="ml-2.5 text-[13px] font-medium text-red-200">{error}</Text>
            </View>
          )}

          {!biometricAvailable && (
            <Text className="mt-5 text-center text-[12px] leading-5 text-white/40">
              Biometric authentication is not available on this device.{'\n'}
              Device passcode will be used instead.
            </Text>
          )}
        </View>
      </View>

      <View className="items-center pb-12">
        <View className="flex-row items-center">
          <Ionicons name="shield-checkmark" size={14} color="rgba(255,255,255,0.3)" />
          <Text className="ml-1.5 text-[11px] font-medium text-white/30">
            Secured with on-device authentication
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}
