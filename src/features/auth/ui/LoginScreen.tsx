import { useEffect, useState } from 'react';
import { View, Text, Pressable, Animated, Easing } from 'react-native';
import { Ionicons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { useBiometricAuth } from '../lib/use-biometric-auth';

export function LoginScreen() {
  const { biometricAvailable, biometricType, isLoading, authenticate } = useBiometricAuth();
  const [error, setError] = useState<string | null>(null);
  const [pulseAnim] = useState(() => new Animated.Value(1));
  const [fadeAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();
  }, []);

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  async function handleAuthenticate() {
    setError(null);
    const success = await authenticate();
    if (!success) {
      setError('Authentication failed. Please try again.');
    }
  }

  function getBiometricIcon() {
    if (biometricType === 'Face ID') {
      return <MaterialCommunityIcons name="face-recognition" size={32} color="#FFFFFF" />;
    }
    return <Ionicons name="finger-print" size={32} color="#FFFFFF" />;
  }

  function getBiometricLabel() {
    if (!biometricAvailable) return 'Sign in with Passcode';
    if (biometricType) return `Sign in with ${biometricType}`;
    return 'Sign in with Biometrics';
  }

  return (
    <View className="flex-1 bg-primary-600">
      <Animated.View
        className="flex-1 items-center justify-center px-8"
        style={{ opacity: fadeAnim }}
      >
        <View className="mb-12 items-center">
          <Animated.View
            className="mb-6 h-24 w-24 items-center justify-center rounded-3xl bg-white/20"
            style={{ transform: [{ scale: pulseAnim }] }}
          >
            <Ionicons name="globe-outline" size={48} color="#FFFFFF" />
          </Animated.View>

          <Text className="text-3xl font-bold text-white">Digital Travel</Text>
          <Text className="mt-2 text-base text-primary-200">
            Your personal news companion
          </Text>
        </View>

        <View className="w-full items-center">
          <Pressable
            onPress={handleAuthenticate}
            disabled={isLoading}
            className={`mb-4 w-full flex-row items-center justify-center rounded-2xl bg-white/20 px-6 py-4 active:bg-white/30 ${
              isLoading ? 'opacity-60' : ''
            }`}
          >
            {isLoading ? (
              <View className="h-8 w-8 items-center justify-center">
                <AntDesign name="loading" size={24} color="#FFFFFF" />
              </View>
            ) : (
              getBiometricIcon()
            )}
            <Text className="ml-3 text-base font-semibold text-white">
              {isLoading ? 'Authenticating...' : getBiometricLabel()}
            </Text>
          </Pressable>

          {error && (
            <View className="mt-2 flex-row items-center rounded-xl bg-red-500/20 px-4 py-3">
              <AntDesign name="exclamation-circle" size={16} color="#FCA5A5" />
              <Text className="ml-2 text-sm text-red-200">{error}</Text>
            </View>
          )}

          {!biometricAvailable && (
            <Text className="mt-4 text-center text-xs text-primary-300">
              Biometric authentication is not available on this device.{'\n'}
              Device passcode will be used instead.
            </Text>
          )}
        </View>
      </Animated.View>

      <View className="items-center pb-12">
        <Text className="text-xs text-primary-300">
          Secured with on-device authentication
        </Text>
      </View>
    </View>
  );
}
