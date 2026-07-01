"use client"

import { useState, useEffect } from "react"
import LeadForm from "@/components/LeadForm"
import LeadList from "@/components/LeadList"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { UserPlus, Users, BarChart3, Moon, Sun } from "lucide-react"

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [dark, setDark] = useState(false)

  function handleLeadCreated() {
    setRefreshKey((prev) => prev + 1)
  }

  function toggleDark() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle("dark", next)
  }

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    if (prefersDark) {
      setDark(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  return (
    <div className="min-h-dvh bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">

      {/* ── Top nav bar ───────────────────────────────────────────────────── */}
      <header className="border-b bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-3">
          <BarChart3 className="size-5 text-primary" />
          <span className="font-bold text-lg tracking-tight">LeadManager</span>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto"
            onClick={toggleDark}
          >
            {dark ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
          </Button>
        </div>
      </header>

      {/* ── Page content ──────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">

        {/* Hero line */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Leads</h1>
          <p className="text-muted-foreground mt-1 text-base">
            Track and manage all your sales prospects in one place.
          </p>
        </div>

        {/* ── Two-column layout ────────────────────────────────────────────── */}
        <div className="grid gap-6 lg:grid-cols-[380px_1fr] items-start">

          {/* Form card */}
          <Card className="shadow-sm border lg:min-h-[490px] flex flex-col">
            <CardHeader className="pb-4 shrink-0">
              <CardTitle className="flex items-center gap-2 text-lg">
                <UserPlus className="size-5 text-primary" />
                Add New Lead
              </CardTitle>
              <CardDescription>
                Fill in the details below to add a new lead to your pipeline.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LeadForm onLeadCreated={handleLeadCreated} />
            </CardContent>
          </Card>

          {/* List card */}
          <Card className="shadow-sm border h-full lg:h-[490px] flex flex-col">
            <CardHeader className="pb-4 shrink-0">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="size-5 text-primary" />
                All Leads
              </CardTitle>
              <CardDescription>
                Hover over a row and click the trash icon to remove a lead.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 overflow-hidden">
              <LeadList refreshKey={refreshKey} />
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  )
}
