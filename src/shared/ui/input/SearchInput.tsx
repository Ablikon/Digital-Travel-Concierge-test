import { View, TextInput, Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  autoFocus?: boolean;
}

export function SearchInput({
  value,
  onChangeText,
  placeholder = 'Search articles...',
  onSubmit,
  autoFocus = false,
}: SearchInputProps) {
  return (
    <View className="flex-row items-center rounded-xl border border-neutral-200 bg-white px-3.5">
      <AntDesign name="search" size={18} color="#94A3B8" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        onSubmitEditing={onSubmit}
        autoFocus={autoFocus}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        className="ml-2.5 flex-1 py-3 text-sm text-neutral-800"
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText('')} hitSlop={8}>
          <AntDesign name="close-circle" size={16} color="#CBD5E1" />
        </Pressable>
      )}
    </View>
  );
}
