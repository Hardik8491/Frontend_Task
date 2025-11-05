"use client"

import { Provider } from "react-redux"
import { store } from "@/lib/store"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import FinnhubFeed from "@/components/finnhub-feed"

export default function FeedPage() {
  return (
    <Provider store={store}>
      <main className="min-h-screen bg-background text-foreground">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <Link href="/">
            <Button variant="outline" className="mb-6 bg-transparent">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Real-time Stock & Crypto Feed</h1>
            <p className="text-muted-foreground">Subscribe to live market data from Finnhub</p>
          </div>

          <FinnhubFeed />
        </div>
      </main>
    </Provider>
  )
}
