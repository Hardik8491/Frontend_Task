import { configureStore } from "@reduxjs/toolkit"
import coinsReducer from "@/lib/slices/coins-slice"
import favoritesReducer from "@/lib/slices/favorites-slice"

export const store = configureStore({
  reducer: {
    coins: coinsReducer,
    favorites: favoritesReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
