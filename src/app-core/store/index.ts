import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from '@/shared/api';
import { authReducer } from '@/features/auth';
import { favoritesReducer } from '@/features/manage-favorites';
import { filtersReducer } from '@/features/filter-news';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    favorites: favoritesReducer,
    filters: filtersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
