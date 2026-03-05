import { Pressable, Text, ActivityIndicator, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

type AntDesignIconName = React.ComponentProps<typeof AntDesign>['name'];

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: AntDesignIconName;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, { container: string; text: string; iconColor: string }> =
  {
    primary: {
      container: 'bg-primary-600 active:bg-primary-700',
      text: 'text-white',
      iconColor: '#FFFFFF',
    },
    secondary: {
      container: 'bg-primary-50 active:bg-primary-100',
      text: 'text-primary-600',
      iconColor: '#4F46E5',
    },
    outline: {
      container: 'border border-neutral-200 bg-white active:bg-neutral-50',
      text: 'text-neutral-700',
      iconColor: '#334155',
    },
    ghost: {
      container: 'bg-transparent active:bg-neutral-100',
      text: 'text-neutral-600',
      iconColor: '#475569',
    },
    danger: {
      container: 'bg-red-500 active:bg-red-600',
      text: 'text-white',
      iconColor: '#FFFFFF',
    },
  };

const sizeStyles: Record<ButtonSize, { container: string; text: string; iconSize: number }> = {
  sm: { container: 'px-3 py-2 rounded-lg', text: 'text-xs', iconSize: 14 },
  md: { container: 'px-5 py-3 rounded-xl', text: 'text-sm', iconSize: 16 },
  lg: { container: 'px-6 py-3.5 rounded-xl', text: 'text-base', iconSize: 18 },
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  const vStyle = variantStyles[variant];
  const sStyle = sizeStyles[size];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`flex-row items-center justify-center ${sStyle.container} ${vStyle.container} ${
        fullWidth ? 'w-full' : ''
      } ${isDisabled ? 'opacity-50' : ''}`}
    >
      {loading ? (
        <ActivityIndicator size="small" color={vStyle.iconColor} />
      ) : (
        <View className="flex-row items-center">
          {icon && iconPosition === 'left' && (
            <AntDesign
              name={icon}
              size={sStyle.iconSize}
              color={vStyle.iconColor}
              style={{ marginRight: 6 }}
            />
          )}
          <Text className={`font-semibold ${sStyle.text} ${vStyle.text}`}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <AntDesign
              name={icon}
              size={sStyle.iconSize}
              color={vStyle.iconColor}
              style={{ marginLeft: 6 }}
            />
          )}
        </View>
      )}
    </Pressable>
  );
}
