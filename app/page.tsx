"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks"
import { fetchCoins } from "@/lib/slices/coins-slice"
import CoinTable from "@/components/coin-table"
import SearchAndSort from "@/components/search-and-sort"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Activity } from "lucide-react"
import { Provider } from "react-redux"
import { store } from "@/lib/store"

export default function Page() {
  return (
    <Provider store={store}>
      <MainContent />
    </Provider>
  )
}

function MainContent() {
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.coins)

  useEffect(() => {
    dispatch(fetchCoins())
  }, [dispatch])

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Cryptocurrency Dashboard</h1>
            <p className="text-muted-foreground">Track the top 50 cryptocurrencies in real-time</p>
          </div>
          <Link href="/feed">
            <Button className="gap-2">
              <Activity size={20} />
              Live Feed
            </Button>
          </Link>
        </div>

        <SearchAndSort />

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">Loading cryptocurrency data...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border border-destructive/50 rounded-lg p-4 mb-6">
            <p className="text-destructive">Error: {error}</p>
          </div>
        )}

        {!loading && !error && <CoinTable />}
      </div>
    </main>
  )
}
