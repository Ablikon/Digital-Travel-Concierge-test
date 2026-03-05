import { View, Text, Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import type { AntDesignIconName } from '@/shared/types';

type SortKey = 'publishedAt' | 'relevancy' | 'popularity';

interface SortOptionsProps {
  currentSort: SortKey;
  onSortChange: (sort: SortKey) => void;
}

const SORT_OPTIONS: { key: SortKey; label: string; icon: AntDesignIconName }[] = [
  { key: 'publishedAt', label: 'Latest', icon: 'clock-circle' },
  { key: 'relevancy', label: 'Relevant', icon: 'star' },
  { key: 'popularity', label: 'Popular', icon: 'fire' },
];

export function SortOptions({ currentSort, onSortChange }: SortOptionsProps) {
  return (
    <View className="flex-row px-4 pb-2">
      {SORT_OPTIONS.map((option) => (
        <Pressable
          key={option.key}
          onPress={() => onSortChange(option.key)}
          className={`mr-2 flex-row items-center rounded-lg px-3 py-1.5 ${
            currentSort === option.key
              ? 'bg-primary-600'
              : 'border border-neutral-200 bg-white'
          }`}
        >
          <AntDesign
            name={option.icon}
            size={12}
            color={currentSort === option.key ? '#FFFFFF' : '#64748B'}
          />
          <Text
            className={`ml-1.5 text-xs font-medium ${
              currentSort === option.key ? 'text-white' : 'text-neutral-600'
            }`}
          >
            {option.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
