"use client"

import { useEffect, useState, useRef } from "react"

export interface FinnhubQuote {
  symbol: string
  price: number
  bid?: number
  ask?: number
  bidSize?: number
  askSize?: number
  lastUpdate?: number
  timestamp?: number
}

export const useFinnhubWebsocket = (symbol: string | null, apiToken: string) => {
  const [quote, setQuote] = useState<FinnhubQuote | null>(null)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (!symbol || !apiToken) return

    if (wsRef.current) {
      wsRef.current.close()
    }

    const ws = new WebSocket(`wss://ws.finnhub.io?token=${apiToken}`)
    wsRef.current = ws

    ws.onopen = () => {
      setConnected(true)
      setError(null)
      ws.send(JSON.stringify({ type: "subscribe", symbol }))
    }

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        if (message.type === "trade" && message.data?.length > 0) {
          const lastTrade = message.data[message.data.length - 1]
          setQuote({
            symbol,
            price: lastTrade.p,
            bid: lastTrade.b,
            ask: lastTrade.a,
            timestamp: lastTrade.t,
          })
        }
      } catch (err) {
        console.error("Error parsing websocket message:", err)
      }
    }

    ws.onerror = (err) => {
      console.error("Websocket error:", err)
      setError("Failed to connect to real-time feed")
      setConnected(false)
    }

    ws.onclose = () => {
      setConnected(false)
      wsRef.current = null
    }

    return () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "unsubscribe", symbol }))
        wsRef.current.close()
      }
    }
  }, [symbol, apiToken])

  return { quote, connected, error } as const
}
