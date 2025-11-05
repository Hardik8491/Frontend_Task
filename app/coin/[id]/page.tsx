"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { useAppDispatch, useAppSelector } from "@/hooks"
import { addFavorite, removeFavorite } from "@/lib/slices/favorites-slice"
import { Star, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import CoinPriceChart from "@/components/coin-price-chart"
import { Provider } from "react-redux"
import { store } from "@/lib/store"

export default function Page() {
  return (
    <Provider store={store}>
      <CoinDetailContent />
    </Provider>
  )
}

function CoinDetailContent() {
  const params = useParams()
  const coinId = params.id as string
  const dispatch = useAppDispatch()
  const [coinDetails, setCoinDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const favorites = useAppSelector((state) => state.favorites.items)
  const isFavorite = favorites.includes(coinId)

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&market_data=true&sparkline=true`,
        )
        if (!response.ok) throw new Error("Failed to fetch coin details")
        const data = await response.json()
        setCoinDetails(data)
        setError(null)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchDetails()
  }, [coinId])

  const toggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavorite(coinId))
    } else {
      dispatch(addFavorite(coinId))
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">Loading coin details...</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (error || !coinDetails) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link href="/">
            <Button variant="outline" className="mb-6 bg-transparent">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to List
            </Button>
          </Link>
          <div className="bg-destructive/10 border border-destructive/50 rounded-lg p-4">
            <p className="text-destructive">Error: {error}</p>
          </div>
        </div>
      </main>
    )
  }

  const price = coinDetails.market_data?.current_price?.usd || 0
  const priceChange24h = coinDetails.market_data?.price_change_percentage_24h || 0
  const marketCap = coinDetails.market_data?.market_cap?.usd || 0
  const volume24h = coinDetails.market_data?.total_volume?.usd || 0
  const ath = coinDetails.market_data?.ath?.usd || 0
  const atl = coinDetails.market_data?.atl?.usd || 0

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="outline" className="mb-6 bg-transparent">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to List
          </Button>
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <img
              src={coinDetails.image?.large || "/placeholder.svg"}
              alt={coinDetails.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h1 className="text-4xl font-bold">{coinDetails.name}</h1>
              <p className="text-muted-foreground uppercase">{coinDetails.symbol}</p>
            </div>
          </div>
          <Button variant={isFavorite ? "default" : "outline"} onClick={toggleFavorite} className="gap-2">
            <Star size={20} fill={isFavorite ? "currentColor" : "none"} />
            {isFavorite ? "Favorited" : "Add to Favorites"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground text-sm mb-2">Current Price</p>
            <p className="text-3xl font-bold">
              ${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground text-sm mb-2">24h Change</p>
            <p
              className={`text-3xl font-bold ${priceChange24h >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
            >
              {priceChange24h >= 0 ? "+" : ""}
              {priceChange24h.toFixed(2)}%
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground text-sm mb-2">Market Cap</p>
            <p className="text-3xl font-bold">
              ${(marketCap / 1e9).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}B
            </p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">7-Day Price Trend</h2>
          <CoinPriceChart coinId={coinId} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground text-sm mb-2">24h Volume</p>
            <p className="text-2xl font-bold">
              ${(volume24h / 1e9).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}B
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground text-sm mb-2">All-Time High</p>
            <p className="text-2xl font-bold">
              ${ath.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground text-sm mb-2">All-Time Low</p>
            <p className="text-2xl font-bold">
              ${atl.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground text-sm mb-2">Circulating Supply</p>
            <p className="text-2xl font-bold">
              {(coinDetails.market_data?.circulating_supply || 0).toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </p>
          </div>
        </div>

        {coinDetails.description?.en && (
          <div className="bg-card border border-border rounded-lg p-6 mt-8">
            <h2 className="text-xl font-bold mb-4">About {coinDetails.name}</h2>
            <p className="text-muted-foreground line-clamp-3">{coinDetails.description.en.replace(/<[^>]*>/g, "")}</p>
          </div>
        )}
      </div>
    </main>
  )
}
