"use client"

import { useState, useEffect } from "react"
import { useFinnhubWebsocket } from "@/hooks/use-finnhub-websocket"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, FileWarningIcon, Wifi, WifiOff, Loader2, RefreshCw } from "lucide-react"

const FINNHUB_TOKEN = process.env.NEXT_PUBLIC_FINNHUB_TOKEN!;

console.log(FINNHUB_TOKEN)

export default function FinnhubFeed() {
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState("")
  const [history, setHistory] = useState<string[]>(["BINANCE:BTCUSDT","AAPL","IC MARKETS:1"])
  const [isChangingSymbol, setIsChangingSymbol] = useState(false)
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null)

  const { quote, connected, error, loading } = useFinnhubWebsocket(selectedSymbol, FINNHUB_TOKEN)


  useEffect(() => {
    if (quote?.timestamp) {
      setLastUpdateTime(new Date(quote.timestamp))
      setIsChangingSymbol(false)
    }
  }, [quote])

  const handleSelectSymbol = (symbol: string) => {
    const upperSymbol = symbol.toUpperCase()
    setSelectedSymbol(upperSymbol)
    setIsChangingSymbol(true)
    
    if (!history.includes(upperSymbol)) {
      setHistory([upperSymbol, ...history].slice(0, 10))
    }
    setInputValue("")
  }

  const handleInputSubmit = () => {
    if (inputValue.trim()) {
      handleSelectSymbol(inputValue.trim())
    }
  }

  const handleRefresh = () => {
    if (selectedSymbol) {
      setIsChangingSymbol(true)

      const currentSymbol = selectedSymbol
      setSelectedSymbol(null)
      setTimeout(() => setSelectedSymbol(currentSymbol), 100)
    }
  }


  const getTimeSinceLastUpdate = () => {
    if (!lastUpdateTime) return null
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - lastUpdateTime.getTime()) / 1000)
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    return `${Math.floor(diffInSeconds / 3600)}h ago`
  }

  const isDataStale = lastUpdateTime && 
    (new Date().getTime() - lastUpdateTime.getTime()) > 30000 // 30 seconds

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Input
          placeholder="Enter stock symbol (e.g., AAPL)"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && handleInputSubmit()}
          disabled={loading}
        />
        <Button onClick={handleInputSubmit} disabled={loading || !inputValue.trim()}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
        </Button>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">Recent symbols:</p>
        <div className="flex flex-wrap gap-2">
          {history.map((symbol) => (
            <Button
              key={symbol}
              variant={selectedSymbol === symbol ? "default" : "outline"}
              size="sm"
              onClick={() => handleSelectSymbol(symbol)}
              disabled={loading && selectedSymbol === symbol}
            >
              {symbol}
              {loading && selectedSymbol === symbol && (
                <Loader2 className="h-3 w-3 animate-spin ml-1" />
              )}
            </Button>
          ))}
        </div>
      </div>


      {(loading || isChangingSymbol) && selectedSymbol && (
        <Card className="border-2 border-blue-500/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              <p className="text-muted-foreground">
                Loading data for {selectedSymbol}...
              </p>
            </div>
          </CardContent>
        </Card>
      )}


      {error && !loading && (
        <Card className="border-2 border-destructive/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <p className="text-destructive font-medium">Connection Error</p>
                <p className="text-sm text-muted-foreground">{error}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefresh}
                  className="mt-2"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Retry Connection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

   
      {quote && !isChangingSymbol && !loading && (
        <Card className={`border-2 ${
          isDataStale ? 'border-amber-500/50' : 'border-primary/50'
        }`}>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                {quote.symbol}
                {isDataStale && (
                  <span className="text-xs bg-amber-500 text-white px-2 py-1 rounded-full">
                    Stale Data
                  </span>
                )}
              </CardTitle>
              <div className="flex items-center gap-3 mt-1">
                <p className={`text-sm flex items-center gap-1 ${
                  connected 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-muted-foreground'
                }`}>
                  {connected ? <Wifi size={14} /> : <WifiOff size={14} />}
                  {connected ? 'Live Feed' : 'Disconnected'}
                </p>
                
                {lastUpdateTime && (
                  <p className={`text-xs ${
                    isDataStale ? 'text-amber-600' : 'text-muted-foreground'
                  }`}>
                    Updated {getTimeSinceLastUpdate()}
                  </p>
                )}
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground text-sm">Last Price</p>
                <p className="text-3xl font-bold">${quote.price.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Bid / Ask</p>
                <p className="text-lg font-semibold">
                  ${quote.bid?.toFixed(2) || "N/A"} / ${quote.ask?.toFixed(2) || "N/A"}
                </p>
              </div>
            </div>

            {quote.timestamp && (
              <p className="text-xs text-muted-foreground">
                Last update: {new Date(quote.timestamp).toLocaleTimeString()}
              </p>
            )}

            {isDataStale && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
                    Data may be outdated
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    No updates received recently. The connection might be unstable.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

    
      {!selectedSymbol && !loading && (
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground space-y-2">
              <FileWarningIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Select or search for a stock symbol to view real-time data from Finnhub</p>
            </div>
          </CardContent>
        </Card>
      )}

    
      <Card className="border p-0">
        <CardContent className="p-4">
          <p className="text-center text-sm text-muted-foreground">
            Only real-time data is shown. Data may be delayed or unavailable for some symbols.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}