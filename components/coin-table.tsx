"use client"

import { useMemo } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks"
import { addFavorite, removeFavorite } from "@/lib/slices/favorites-slice"
import Link from "next/link"
import { Star } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function CoinTable() {
  const dispatch = useAppDispatch()
  const { items, searchQuery, sortBy, sortOrder } = useAppSelector((state) => state.coins)
  const favorites = useAppSelector((state) => state.favorites.items)

  const filteredAndSortedCoins = useMemo(() => {
    const filtered = items.filter(
      (coin) =>
        coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    return filtered.sort((a, b) => {
      let aValue = 0
      let bValue = 0

      if (sortBy === "price") {
        aValue = a.current_price
        bValue = b.current_price
      } else if (sortBy === "market_cap") {
        aValue = a.market_cap || 0
        bValue = b.market_cap || 0
      } else if (sortBy === "price_change_24h") {
        aValue = a.price_change_percentage_24h
        bValue = b.price_change_percentage_24h
      }

      return sortOrder === "asc" ? aValue - bValue : bValue - aValue
    })
  }, [items, searchQuery, sortBy, sortOrder])

  const toggleFavorite = (coinId: string) => {
    if (favorites.includes(coinId)) {
      dispatch(removeFavorite(coinId))
    } else {
      dispatch(addFavorite(coinId))
    }
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">★</TableHead>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">24h Change</TableHead>
              <TableHead className="text-right">Market Cap</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedCoins.length > 0 ? (
              filteredAndSortedCoins.map((coin) => (
                <TableRow key={coin?.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell>
                    <button onClick={() => toggleFavorite(coin?.id)} className="transition-colors hover:text-primary">
                      <Star
                        size={20}
                        fill={favorites.includes(coin?.id) ? "currentColor" : "none"}
                        className={favorites.includes(coin?.id) ? "text-primary" : ""}
                      />
                    </button>
                  </TableCell>

                  <TableCell className="text-muted-foreground">{coin.market_cap_rank}</TableCell>

                  <TableCell>
                    <Link
                      href={`/coin/${coin.id}`}
                      className="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      <img src={coin.image || "/placeholder.svg"} alt={coin.name} className="w-6 h-6 rounded-full" />
                      <span className="font-medium">{coin.name}</span>
                    </Link>
                  </TableCell>

                  <TableCell className="text-muted-foreground uppercase">{coin.symbol}</TableCell>

                  <TableCell className="text-right font-medium">${coin.current_price.toFixed(2)}</TableCell>

                  <TableCell className="text-right">
                    <span
                      className={
                        coin.price_change_percentage_24h >= 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }
                    >
                      {coin?.price_change_percentage_24h >= 0 ? "+" : ""}
                      {coin?.price_change_percentage_24h?.toFixed(2)}%
                    </span>
                  </TableCell>

                  <TableCell className="text-right text-muted-foreground">
                    ${(coin?.market_cap / 1e9)?.toFixed(2)}B
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No coins found matching your search
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
