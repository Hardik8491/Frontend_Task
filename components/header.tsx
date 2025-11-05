"use client"

import { Activity } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Crypto Dashboard
        </Link>
        <nav className="flex gap-4">
          <Link href="/">
            <Button variant="ghost">Coins</Button>
          </Link>
          <Link href="/feed">
            <Button variant="ghost" className="gap-2">
              <Activity size={18} />
              Live Feed
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
