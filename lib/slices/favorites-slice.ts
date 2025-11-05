import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface FavoritesState {
  items: string[]
}

const initialState: FavoritesState = {
  items: [],
}

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<string>) => {
      if (!state.items.includes(action.payload)) {
        state.items.push(action.payload)
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((id) => id !== action.payload)
    },
  },
})

export const { addFavorite, removeFavorite } = favoritesSlice.actions
export default favoritesSlice.reducer
