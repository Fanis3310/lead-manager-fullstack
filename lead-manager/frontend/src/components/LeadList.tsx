"use client"

import { useEffect, useRef, useState } from "react"
import { fetchLeads, updateLead, deleteLead, type Lead } from "@/lib/api"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Trash2, Loader2, RefreshCw, Users, Pencil, Check, X, Search } from "lucide-react"

const STATUS_OPTIONS = ["New", "Engaged", "Proposal Sent", "Closed-Won", "Closed-Lost"]

// Status badge colours
const STATUS_STYLES: Record<string, string> = {
  "New":           "bg-blue-100 text-blue-700 border-blue-200",
  "Engaged":       "bg-purple-100 text-purple-700 border-purple-200",
  "Proposal Sent": "bg-amber-100 text-amber-700 border-amber-200",
  "Closed-Won":    "bg-green-100 text-green-700 border-green-200",
  "Closed-Lost":   "bg-red-100 text-red-700 border-red-200",
}

// Coloured dots for select dropdown
const STATUS_DOTS: Record<string, string> = {
  "New":           "bg-blue-400",
  "Engaged":       "bg-purple-400",
  "Proposal Sent": "bg-amber-400",
  "Closed-Won":    "bg-emerald-400",
  "Closed-Lost":   "bg-red-400",
}

function StatusBadge({ status }: { status: string }) {
  const cls = STATUS_STYLES[status] ?? "bg-zinc-100 text-zinc-600 border-zinc-200"
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
      {status}
    </span>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

interface LeadListProps {
  refreshKey?: number
}

export default function LeadList({ refreshKey }: LeadListProps) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState({ name: "", email: "", status: "New" })
  const [savingId, setSavingId] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [confirmText, setConfirmText] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const emailValid = editData.email.length > 0 && emailRegex.test(editData.email.trim())
  const emailInvalid = editData.email.length > 0 && !emailRegex.test(editData.email.trim())

  async function loadLeads() {
    setLoading(true)
    setError("")
    try {
      const data = await fetchLeads()
      setLeads(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load leads.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLeads()
  }, [refreshKey])

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100)
    }
  }, [searchOpen])

  function startEdit(lead: Lead) {
    setEditingId(lead._id)
    setEditData({ name: lead.name, email: lead.email, status: lead.status })
  }

  function cancelEdit() {
    setEditingId(null)
  }

  async function handleSave(id: string) {
    if (!editData.name.trim() || !editData.email.trim()) return
    setSavingId(id)
    try {
      const updated = await updateLead(id, editData)
      setLeads((prev) => prev.map((l) => (l._id === id ? updated : l)))
      setEditingId(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update lead.")
    } finally {
      setSavingId(null)
    }
  }

  function openDeleteConfirm(id: string) {
    setDeleteConfirmId(id)
    setConfirmText("")
  }

  function closeDeleteConfirm() {
    setDeleteConfirmId(null)
    setConfirmText("")
  }

  async function confirmDelete() {
    if (!deleteConfirmId) return
    setDeletingId(deleteConfirmId)
    try {
      await deleteLead(deleteConfirmId)
      setLeads((prev) => prev.filter((l) => l._id !== deleteConfirmId))
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete lead.")
    } finally {
      setDeletingId(null)
      closeDeleteConfirm()
    }
  }

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
        <Loader2 className="size-8 animate-spin" />
        <p className="text-sm">Loading leads…</p>
      </div>
    )
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-sm text-destructive">{error}</p>
        <Button variant="outline" size="sm" onClick={loadLeads} className="gap-2">
          <RefreshCw className="size-3.5" />
          Try again
        </Button>
      </div>
    )
  }

  // ── Empty state ────────────────────────────────────────────────────────────
  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
        <Users className="size-10 opacity-30" />
        <p className="text-sm font-medium">No leads yet</p>
        <p className="text-xs opacity-60">Add your first lead using the form on the left.</p>
      </div>
    )
  }

  const filteredLeads = leads.filter((lead) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      lead.name.toLowerCase().includes(q) ||
      lead.email.toLowerCase().includes(q) ||
      lead.status.toLowerCase().includes(q)
    )
  })

  // ── Table ──────────────────────────────────────────────────────────────────
  return (
    <div className="h-full flex flex-col min-h-0">
      {/* Header row with count + inline search */}
      <div className="flex items-center gap-2 px-1 mb-1">
        <p className="text-sm font-semibold text-foreground/70 shrink-0">
          {searchQuery ? `${filteredLeads.length} of ` : ""}{leads.length} lead{leads.length !== 1 ? "s" : ""}
        </p>

        <div className="relative ml-auto h-8">
          {/* Icon button — fades out when search opens */}
          <Button
            variant="ghost"
            size="icon"
            className={`absolute right-0 top-0 size-8 transition-all duration-300 ${
              searchOpen ? "opacity-0 scale-50 pointer-events-none" : "opacity-100 scale-100"
            }`}
            onClick={() => setSearchOpen(true)}
          >
            <Search className="size-4" />
          </Button>

          {/* Expanded search bar — grows from button position */}
          <div
            className={`absolute right-0 top-0 flex items-center bg-background rounded-lg border shadow-sm overflow-hidden transition-all duration-300 ease-in-out ${
              searchOpen ? "w-[280px] opacity-100" : "w-8 opacity-0 pointer-events-none"
            }`}
          >
            <Search className="size-4 text-muted-foreground ml-2 mr-1.5 shrink-0" />
            <input
              ref={searchInputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search…"
              className="flex-1 h-8 text-sm bg-transparent border-0 outline-none text-foreground placeholder:text-muted-foreground"
            />
            <Button
              variant="ghost"
              size="icon"
              className="size-7 shrink-0 hover:bg-muted"
              onClick={() => {
                setSearchOpen(false)
                setSearchQuery("")
              }}
            >
              <X className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-lg border flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full">
        <Table>
          <TableHeader className="sticky top-0 z-10">
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="font-semibold text-foreground/70 py-3 pl-4">Name</TableHead>
              <TableHead className="font-semibold text-foreground/70 py-3">Email</TableHead>
              <TableHead className="font-semibold text-foreground/70 py-3">Status</TableHead>
              <TableHead className="font-semibold text-foreground/70 py-3">Created</TableHead>
              <TableHead className="w-[72px] py-3 pr-4" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.map((lead) => {
              const isEditing = editingId === lead._id
              const isSaving = savingId === lead._id

              return (
                <TableRow
                  key={lead._id}
                  className="group transition-colors hover:bg-muted/30"
                >
                  {/* Name */}
                  <TableCell className="py-3 pl-4">
                    {isEditing ? (
                      <Input
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="h-8 text-sm"
                      />
                    ) : (
                      <span className="font-semibold text-base">{lead.name}</span>
                    )}
                  </TableCell>

                  {/* Email */}
                  <TableCell className="py-3">
                    {isEditing ? (
                      <div className="space-y-1">
                        <Input
                          value={editData.email}
                          onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                          className={`h-8 text-sm transition-colors ${
                            emailValid
                              ? "border-emerald-400 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20"
                              : emailInvalid
                                ? "border-red-400 focus-visible:border-red-500 focus-visible:ring-red-500/20"
                                : ""
                          }`}
                        />
                        {emailInvalid && (
                          <p className="text-[11px] text-red-500 font-medium">Enter a valid email</p>
                        )}
                        {emailValid && (
                          <p className="text-[11px] text-emerald-600 font-medium">Valid email format</p>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">{lead.email}</span>
                    )}
                  </TableCell>

                  {/* Status */}
                  <TableCell className="py-3">
                    {isEditing ? (
                      <Select
                        value={editData.status}
                        onValueChange={(v) => setEditData({ ...editData, status: v })}
                      >
                        <SelectTrigger className="h-8 text-sm w-[140px] rounded-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((s) => (
                            <SelectItem key={s} value={s} className="py-2 text-sm">
                              <span className="flex items-center gap-2.5">
                                <span className={`size-2 rounded-full shrink-0 ${STATUS_DOTS[s]}`} />
                                <span className="font-medium">{s}</span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <StatusBadge status={lead.status} />
                    )}
                  </TableCell>

                  {/* Created */}
                  <TableCell className="text-muted-foreground py-3 text-sm whitespace-nowrap">
                    {formatDate(lead.createdAt)}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="py-3 pr-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {isEditing ? (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                            disabled={isSaving}
                            onClick={() => handleSave(lead._id)}
                          >
                            {isSaving ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <Check className="size-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                            onClick={cancelEdit}
                            disabled={isSaving}
                          >
                            <X className="size-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-foreground hover:bg-muted transition-all"
                            onClick={() => startEdit(lead)}
                          >
                            <Pencil className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 transition-all"
                            disabled={deletingId === lead._id}
                            onClick={() => openDeleteConfirm(lead._id)}
                          >
                            {deletingId === lead._id ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <Trash2 className="size-4" />
                            )}
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* ── Delete confirmation modal ─────────────────────────────────────── */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeDeleteConfirm}
          />
          <div className="relative z-10 w-full max-w-sm mx-4 rounded-xl border bg-card p-6 shadow-lg animate-in fade-in-0 zoom-in-95">
            <h3 className="text-base font-semibold">Delete Lead</h3>
            <p className="text-sm text-muted-foreground mt-2">
              This action cannot be undone. Type <strong>yes</strong> to confirm.
            </p>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder='Type "yes" to confirm'
              className="h-9 mt-4 text-sm"
            />
            <div className="flex items-center justify-end gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={closeDeleteConfirm}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                disabled={confirmText.toLowerCase() !== "yes" || deletingId === deleteConfirmId}
                onClick={confirmDelete}
              >
                {deletingId === deleteConfirmId ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
