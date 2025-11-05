import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

export interface Coin {
  id: string
  name: string
  symbol: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  price_change_percentage_24h: number
  circulating_supply: number
}

export interface CoinsState {
  items: Coin[]
  loading: boolean
  error: string | null
  searchQuery: string
  sortBy: "price" | "market_cap" | "price_change_24h"
  sortOrder: "asc" | "desc"
}

const initialState: CoinsState = {
  items: [],
  loading: false,
  error: null,
  searchQuery: "",
  sortBy: "market_cap",
  sortOrder: "desc",
}

export const fetchCoins = createAsyncThunk("coins/fetchCoins", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false",
    )
    if (!response.ok) throw new Error("Failed to fetch coins")
    return await response.json()
  } catch (error) {
    return rejectWithValue((error as Error).message)
  }
})

export const fetchCoinDetails = createAsyncThunk(
  "coins/fetchCoinDetails",
  async (coinId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&market_data=true&sparkline=true`,
      )
      if (!response.ok) throw new Error("Failed to fetch coin details")
      return await response.json()
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  },
)

const coinsSlice = createSlice({
  name: "coins",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    setSortBy: (state, action: PayloadAction<"price" | "market_cap" | "price_change_24h">) => {
      state.sortBy = action.payload
    },
    setSortOrder: (state, action: PayloadAction<"asc" | "desc">) => {
      state.sortOrder = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoins.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCoins.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchCoins.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { setSearchQuery, setSortBy, setSortOrder } = coinsSlice.actions
export default coinsSlice.reducer
