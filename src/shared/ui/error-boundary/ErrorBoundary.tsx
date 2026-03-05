import { Component, type ErrorInfo, type ReactNode } from 'react';
import { View, Text, Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View className="flex-1 items-center justify-center bg-white px-8">
          <View className="mb-5 h-20 w-20 items-center justify-center rounded-full bg-red-50">
            <AntDesign name="warning" size={36} color="#EF4444" />
          </View>
          <Text className="text-center text-xl font-bold text-neutral-800">
            Something went wrong
          </Text>
          <Text className="mt-3 text-center text-sm leading-5 text-neutral-500">
            The app encountered an unexpected error. Please try again.
          </Text>
          {this.state.error && (
            <Text className="mt-2 text-center text-xs text-neutral-400">
              {this.state.error.message}
            </Text>
          )}
          <Pressable
            onPress={this.handleReset}
            className="mt-8 rounded-xl bg-primary-600 px-8 py-3.5 active:bg-primary-700"
          >
            <Text className="text-sm font-semibold text-white">Try Again</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}
