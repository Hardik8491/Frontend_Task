"use client"

import { useAppDispatch, useAppSelector } from "@/hooks"
import { setSearchQuery, setSortBy, setSortOrder } from "@/lib/slices/coins-slice"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SearchAndSort() {
  const dispatch = useAppDispatch()
  const { searchQuery, sortBy, sortOrder } = useAppSelector((state) => state.coins)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Input
        placeholder="Search by name or symbol..."
        value={searchQuery}
        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        className="col-span-1 md:col-span-2"
      />

      <Select value={sortBy} onValueChange={(value: any) => dispatch(setSortBy(value))}>
        <SelectTrigger>
          <SelectValue placeholder="Sort by..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="price">Price</SelectItem>
          <SelectItem value="market_cap">Market Cap</SelectItem>
          <SelectItem value="price_change_24h">24h Change</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        onClick={() => dispatch(setSortOrder(sortOrder === "asc" ? "desc" : "asc"))}
        className="w-full md:col-span-3 lg:col-span-1"
      >
        {sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
      </Button>
    </div>
  )
}
