import { Pressable, Text } from 'react-native';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
}

export function Chip({ label, selected = false, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`mr-2 rounded-full px-4 py-2 ${
        selected
          ? 'bg-primary-600'
          : 'border border-neutral-200/80 bg-white'
      }`}
      style={
        selected
          ? {
              shadowColor: '#4F46E5',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 3,
            }
          : undefined
      }
    >
      <Text
        className={`text-xs font-semibold capitalize ${
          selected ? 'text-white' : 'text-neutral-500'
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
