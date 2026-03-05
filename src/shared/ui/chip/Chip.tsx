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
      className={`mr-2 rounded-lg px-4 py-2 ${
        selected ? 'bg-primary-600' : 'border border-neutral-200 bg-white'
      }`}
    >
      <Text
        className={`text-xs font-semibold capitalize ${
          selected ? 'text-white' : 'text-neutral-600'
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
