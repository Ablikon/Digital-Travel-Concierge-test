import { View, Text, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '@/app-core/store/hooks';
import { logout } from '@/features/auth';

interface SettingsRowProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
}

function SettingsRow({ icon, iconBg, label, value, onPress, danger = false }: SettingsRowProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between px-4 py-3.5 active:bg-neutral-50/50"
    >
      <View className="flex-row items-center">
        <View
          className="mr-3.5 h-9 w-9 items-center justify-center rounded-xl"
          style={{ backgroundColor: iconBg }}
        >
          {icon}
        </View>
        <Text
          className={`text-[14px] font-medium ${danger ? 'text-red-500' : 'text-neutral-700'}`}
        >
          {label}
        </Text>
      </View>
      <View className="flex-row items-center">
        {value && (
          <Text className="mr-2 text-[13px] text-neutral-400">{value}</Text>
        )}
        {onPress && <AntDesign name="right" size={13} color="#CBD5E1" />}
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
    <SafeAreaView className="flex-1 bg-neutral-50" edges={['top']}>
      <View className="bg-white px-5 pb-5 pt-4">
        <Text className="text-[26px] font-extrabold tracking-tight text-neutral-900">
          Profile
        </Text>
        <Text className="mt-0.5 text-[13px] text-neutral-400">
          Account settings & preferences
        </Text>
      </View>
      <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.04)' }} />

      <View className="mt-6 px-4">
        <Text className="mb-2 px-1 text-[11px] font-bold uppercase tracking-widest text-neutral-400">
          Account
        </Text>
        <View
          className="overflow-hidden rounded-2xl bg-white"
          style={{
            shadowColor: '#0F172A',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <SettingsRow
            icon={<Ionicons name="finger-print" size={18} color="#4F46E5" />}
            iconBg="#EEF2FF"
            label="Authentication"
            value={biometricType || 'Passcode'}
          />
          <View className="ml-16 h-px bg-neutral-100/80" />
          <SettingsRow
            icon={<AntDesign name="heart" size={16} color="#EF4444" />}
            iconBg="#FEF2F2"
            label="Saved Articles"
            value={`${favoritesCount} articles`}
          />
        </View>

        <Text className="mb-2 mt-6 px-1 text-[11px] font-bold uppercase tracking-widest text-neutral-400">
          App
        </Text>
        <View
          className="overflow-hidden rounded-2xl bg-white"
          style={{
            shadowColor: '#0F172A',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <SettingsRow
            icon={<Ionicons name="notifications-outline" size={18} color="#F59E0B" />}
            iconBg="#FFFBEB"
            label="Notifications"
            value="Enabled"
          />
          <View className="ml-16 h-px bg-neutral-100/80" />
          <SettingsRow
            icon={<MaterialCommunityIcons name="information-outline" size={18} color="#64748B" />}
            iconBg="#F1F5F9"
            label="App Version"
            value="1.0.0"
          />
        </View>

        <View
          className="mt-6 overflow-hidden rounded-2xl bg-white"
          style={{
            shadowColor: '#0F172A',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <SettingsRow
            icon={<AntDesign name="logout" size={16} color="#EF4444" />}
            iconBg="#FEF2F2"
            label="Sign Out"
            onPress={handleLogout}
            danger
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
