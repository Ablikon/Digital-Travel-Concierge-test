import { useState, useRef } from 'react';
import { Image, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ImageWithFallbackProps {
  uri: string | null;
  className?: string;
  style?: object;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
}

export function ImageWithFallback({
  uri,
  className = '',
  style,
  resizeMode = 'cover',
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);
  const didError = useRef(false);

  if (!uri || hasError) {
    return (
      <View className={`items-center justify-center bg-neutral-100 ${className}`} style={style}>
        <Ionicons name="image-outline" size={28} color="#CBD5E1" />
      </View>
    );
  }

  return (
    <View className={className} style={[{ overflow: 'hidden' }, style]}>
      <Image
        source={{ uri }}
        style={{ width: '100%', height: '100%' }}
        resizeMode={resizeMode}
        onError={() => {
          if (!didError.current) {
            didError.current = true;
            setHasError(true);
          }
        }}
      />
    </View>
  );
}
