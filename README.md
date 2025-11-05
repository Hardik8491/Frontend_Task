# Crypto Dashboard

A modern, real-time cryptocurrency dashboard built with Next.js, Redux Toolkit, and TypeScript. Track the top 50 cryptocurrencies with live market data, price charts, and Finnhub WebSocket integration for real-time stock feeds.

## Features

- **Real-time Crypto Data**: Display top 50 cryptocurrencies with live market prices, market cap, and 24-hour changes
- **Search & Filter**: Find cryptocurrencies by name or symbol with case-insensitive search
- **Sorting**: Sort coins by price, market cap, or 24-hour price change in ascending or descending order
- **Favorites System**: Save favorite cryptocurrencies using Redux state management
- **Detailed Coin Pages**: View comprehensive coin information including:
  - Current price and 24-hour change percentage
  - Market cap and trading volume
  - All-time high and low prices
  - 7-day price trend chart with interactive visualization
  - Coin description
- **Real-time Stock Feed**: WebSocket-powered Finnhub integration for live stock and crypto quotes
- **Responsive Design**: Mobile-first design that works seamlessly on all devices
- **Dark Mode Support**: Full dark mode support with semantic design tokens

## Tech Stack

- **Frontend Framework**: Next.js 14+ with App Router
- **State Management**: Redux Toolkit with TypeScript
- **UI Components**: shadcn/ui with Tailwind CSS
- **Data Visualization**: Recharts for interactive price charts
- **APIs**: 
  - CoinGecko API for cryptocurrency data
  - Finnhub WebSocket API for real-time market data
- **Styling**: Tailwind CSS v4 with semantic design tokens

## Project Structure

\`\`\`
├── app/
│   ├── page.tsx                 # Main dashboard page
│   ├── coin/[id]/page.tsx      # Coin detail page
│   ├── feed/page.tsx            # Real-time feed page
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles with design tokens
├── components/
│   ├── coin-table.tsx           # Cryptocurrency table component
│   ├── search-and-sort.tsx      # Search and sort controls
│   ├── coin-price-chart.tsx     # Price chart component
│   ├── finnhub-feed.tsx         # Real-time feed component
│   └── ui/                      # shadcn/ui components
├── hooks/
│   ├── use-app-dispatch.ts      # Redux dispatch hook
│   ├── use-app-selector.ts      # Redux selector hook
│   └── use-finnhub-websocket.ts # WebSocket hook for Finnhub
├── lib/
│   ├── store.ts                 # Redux store configuration
│   └── slices/
│       ├── coins-slice.ts       # Coins state and async thunks
│       └── favorites-slice.ts   # Favorites state management
└── public/                       # Static assets
\`\`\`

## Redux Architecture

### Coins Slice
Manages cryptocurrency data with the following state:
- `items`: Array of cryptocurrency objects
- `loading`: Loading state for API calls
- `error`: Error messages
- `searchQuery`: Current search filter
- `sortBy`: Sort criteria (price, market_cap, price_change_24h)
- `sortOrder`: Sort direction (asc, desc)

Actions:
- `fetchCoins`: Async thunk to fetch top 50 cryptocurrencies from CoinGecko
- `setSearchQuery`: Update search filter
- `setSortBy`: Change sort criteria
- `setSortOrder`: Toggle sort direction

### Favorites Slice
Manages favorite coins:
- `items`: Array of favorite coin IDs
- `addFavorite`: Add coin to favorites
- `removeFavorite`: Remove coin from favorites

## Getting Started

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   \`\`\`

#### Environment variables
.env 

NEXT_PUBLIC_FINNHUB_TOKEN=xxxxxxxxxxxxxxxxxxxxxxx

### Running the Development Server

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Usage

### Main Dashboard
- View the top 50 cryptocurrencies in a sortable table
- Search for cryptocurrencies by name or symbol
- Sort by price, market cap, or 24-hour change
- Toggle between ascending and descending order
- Click the star icon to add/remove coins from favorites
- Click on any coin to view detailed information

### Coin Details
- View comprehensive information about a specific cryptocurrency
- See a 7-day price trend chart
- Check all-time high and low prices
- View current market cap and trading volume
- Read the coin description
- Add/remove from favorites

### Real-time Feed
- Navigate to the Live Feed page from the dashboard
- Search for stock symbols (e.g., AAPL, GOOGL, MSFT)
- Subscribe to live price updates via WebSocket
- View bid/ask prices and last update time

## API Integration

### CoinGecko API
The dashboard uses the free CoinGecko API to fetch cryptocurrency data:
- Endpoint: `https://api.coingecko.com/api/v3`
- No authentication required
- Rate limited to 10-50 calls/minute depending on endpoint

### Finnhub WebSocket API
Real-time stock data is provided by Finnhub:
- Endpoint: `wss://ws.finnhub.io`
- Requires API token (demo token available for testing)
- Get a free API key at [https://finnhub.io](https://finnhub.io)

## Customization

### Design Tokens
Modify `app/globals.css` to customize colors, fonts, and spacing throughout the app.

### API Token Configuration
To use your own Finnhub API token:
1. Get a free API key from [https://finnhub.io](https://finnhub.io)
2. Update the `FINNHUB_TOKEN` in `components/finnhub-feed.tsx`

### Redux Store
Add new slices in `lib/slices/` to manage additional state or integrate more APIs.

## Performance Optimizations

- Redux selectors with `useAppSelector` for optimized re-renders
- `useMemo` for filtered and sorted coin data
- Lazy loading of coin detail pages
- Efficient WebSocket connection management with cleanup

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Contributing

Feel free to submit issues and enhancement requests!
