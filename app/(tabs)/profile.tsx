import { View, Text, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { logout } from '@/features/auth';

interface SettingsRowProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
}

function SettingsRow({ icon, label, value, onPress, danger = false }: SettingsRowProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between px-5 py-4 active:bg-neutral-50"
    >
      <View className="flex-row items-center">
        <View className="mr-3.5">{icon}</View>
        <Text className={`text-sm font-medium ${danger ? 'text-red-500' : 'text-neutral-700'}`}>
          {label}
        </Text>
      </View>
      <View className="flex-row items-center">
        {value && <Text className="mr-2 text-sm text-neutral-400">{value}</Text>}
        {onPress && <AntDesign name="right" size={14} color="#CBD5E1" />}
      </View>
    </Pressable>
  );
}

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const { biometricType } = useAppSelector((state) => state.auth);
  const favoritesCount = useAppSelector((state) => state.favorites.articles.length);

  function handleLogout() {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out? You will need to authenticate again.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => dispatch(logout()),
        },
      ]
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface-secondary" edges={['top']}>
      <View className="border-b border-neutral-100 bg-white px-5 py-5">
        <Text className="text-2xl font-bold text-neutral-800">Profile</Text>
      </View>

      <View className="mt-6 px-4">
        <View className="overflow-hidden rounded-2xl bg-white">
          <View className="border-b border-neutral-50 px-5 py-3">
            <Text className="text-xs font-bold uppercase tracking-wide text-neutral-400">
              Account
            </Text>
          </View>
          <SettingsRow
            icon={<Ionicons name="finger-print" size={20} color="#4F46E5" />}
            label="Authentication"
            value={biometricType || 'Passcode'}
          />
          <View className="ml-14 h-px bg-neutral-50" />
          <SettingsRow
            icon={<AntDesign name="heart" size={20} color="#EF4444" />}
            label="Saved Articles"
            value={`${favoritesCount} articles`}
          />
        </View>

        <View className="mt-4 overflow-hidden rounded-2xl bg-white">
          <View className="border-b border-neutral-50 px-5 py-3">
            <Text className="text-xs font-bold uppercase tracking-wide text-neutral-400">
              App
            </Text>
          </View>
          <SettingsRow
            icon={<Ionicons name="notifications-outline" size={20} color="#F59E0B" />}
            label="Notifications"
            value="Enabled"
          />
          <View className="ml-14 h-px bg-neutral-50" />
          <SettingsRow
            icon={<MaterialCommunityIcons name="information-outline" size={20} color="#64748B" />}
            label="App Version"
            value="1.0.0"
          />
        </View>

        <View className="mt-4 overflow-hidden rounded-2xl bg-white">
          <SettingsRow
            icon={<AntDesign name="logout" size={20} color="#EF4444" />}
            label="Sign Out"
            onPress={handleLogout}
            danger
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
