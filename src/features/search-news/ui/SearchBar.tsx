import { View } from 'react-native';
import { SearchInput } from '@/shared/ui';
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks';
import { setSearchQuery } from '@/features/filter-news/model';

interface SearchBarProps {
  onSubmit?: () => void;
}

export function SearchBar({ onSubmit }: SearchBarProps) {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector((state) => state.filters.searchQuery);

  return (
    <View className="px-4 py-3">
      <SearchInput
        value={searchQuery}
        onChangeText={(text) => dispatch(setSearchQuery(text))}
        placeholder="Search news articles..."
        onSubmit={onSubmit}
      />
    </View>
  );
}
