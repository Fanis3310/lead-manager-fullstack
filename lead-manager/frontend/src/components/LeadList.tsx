"use client"

import { useEffect, useState } from "react"
import { fetchLeads, type Lead } from "@/lib/api"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default function LeadList() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function loadLeads() {
    setLoading(true)
    setError("")
    try {
      const data = await fetchLeads()
      setLeads(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load leads")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLeads()
  }, [])

  if (loading) {
    return <p className="text-sm text-muted-foreground py-8 text-center">Loading leads...</p>
  }

  if (error) {
    return <p className="text-sm text-destructive py-8 text-center">{error}</p>
  }

  if (leads.length === 0) {
    return <p className="text-sm text-muted-foreground py-8 text-center">No leads yet. Add one above!</p>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leads.map((lead) => (
          <TableRow key={lead._id}>
            <TableCell className="font-medium">{lead.name}</TableCell>
            <TableCell className="text-muted-foreground">{lead.email}</TableCell>
            <TableCell>{lead.status}</TableCell>
            <TableCell className="text-muted-foreground">{formatDate(lead.createdAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
