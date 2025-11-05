"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface ChartData {
  date: string
  price: number
}

export default function CoinPriceChart({ coinId }: { coinId: string }) {
  const [data, setData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7`,
        )
        if (!response.ok) throw new Error("Failed to fetch chart data")
        const result = await response.json()

        const chartData: ChartData[] = result.prices.map((price: [number, number]) => ({
          date: new Date(price[0]).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          price: Number(price[1].toFixed(2)),
        }))

        setData(chartData)
      } catch (error) {
        console.error("Failed to fetch historical data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHistoricalData()
  }, [coinId])

  if (loading) {
    return <div className="h-80 flex items-center justify-center text-muted-foreground">Loading chart...</div>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="date" stroke="var(--muted-foreground)" />
        <YAxis stroke="var(--muted-foreground)" />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
          }}
          labelStyle={{ color: "var(--foreground)" }}
        />
        <Line type="monotone" dataKey="price" stroke="var(--primary)" dot={false} strokeWidth={2} name="Price (USD)" />
      </LineChart>
    </ResponsiveContainer>
  )
}
