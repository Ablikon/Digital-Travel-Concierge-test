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
    <View
      className="flex-row items-center rounded-2xl bg-neutral-100 px-4"
      style={{
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
      }}
    >
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
        className="ml-3 flex-1 py-3.5 text-sm text-neutral-800"
      />
      {value.length > 0 && (
        <Pressable
          onPress={() => onChangeText('')}
          hitSlop={8}
          className="h-6 w-6 items-center justify-center rounded-full bg-neutral-300/50"
        >
          <AntDesign name="close" size={12} color="#64748B" />
        </Pressable>
      )}
    </View>
  );
}
