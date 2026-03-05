import { View, Text, Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks';
import { setSortBy } from '@/features/filter-news/model';

const SORT_OPTIONS = [
  { key: 'publishedAt' as const, label: 'Latest', icon: 'clock-circle' as const },
  { key: 'relevancy' as const, label: 'Relevant', icon: 'star' as const },
  { key: 'popularity' as const, label: 'Popular', icon: 'fire' as const },
];

export function SortOptions() {
  const dispatch = useAppDispatch();
  const currentSort = useAppSelector((state) => state.filters.sortBy);

  return (
    <View className="flex-row px-4 pb-2">
      {SORT_OPTIONS.map((option) => (
        <Pressable
          key={option.key}
          onPress={() => dispatch(setSortBy(option.key))}
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
