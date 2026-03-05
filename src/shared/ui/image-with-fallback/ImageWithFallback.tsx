import { useState } from 'react';
import { Image, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ImageWithFallbackProps {
  uri: string | null;
  className?: string;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
}

export function ImageWithFallback({
  uri,
  className = '',
  resizeMode = 'cover',
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);

  if (!uri || hasError) {
    return (
      <View className={`items-center justify-center bg-neutral-100 ${className}`}>
        <Ionicons name="image-outline" size={32} color="#CBD5E1" />
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      className={className}
      resizeMode={resizeMode}
      onError={() => setHasError(true)}
    />
  );
}
