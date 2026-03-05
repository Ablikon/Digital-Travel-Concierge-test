import { View } from 'react-native';
import { SearchInput } from '@/shared/ui';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
}

export function SearchBar({ value, onChangeText, onSubmit }: SearchBarProps) {
  return (
    <View className="px-4 py-3">
      <SearchInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search news articles..."
        onSubmit={onSubmit}
        autoFocus
      />
    </View>
  );
}
