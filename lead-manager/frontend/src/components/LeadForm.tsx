"use client"

import { useState } from "react"
import { createLead } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UserPlus, CheckCircle2, AlertCircle, Loader2, Dot } from "lucide-react"

const STATUSES = [
  { value: "New",          label: "New",           dot: "bg-blue-400" },
  { value: "Engaged",      label: "Engaged",       dot: "bg-purple-400" },
  { value: "Proposal Sent",label: "Proposal Sent",  dot: "bg-amber-400" },
  { value: "Closed-Won",   label: "Closed-Won",    dot: "bg-emerald-400" },
  { value: "Closed-Lost",  label: "Closed-Lost",   dot: "bg-red-400" },
]

interface LeadFormProps {
  onLeadCreated: () => void
}

export default function LeadForm({ onLeadCreated }: LeadFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState("New")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const emailValid = email.length > 0 && emailRegex.test(email.trim())
  const emailInvalid = email.length > 0 && !emailRegex.test(email.trim())

  function validate() {
    if (!name.trim()) return "Full name is required."
    if (!email.trim()) return "Email address is required."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Enter a valid email address."
    return null
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setSuccess(false)

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    try {
      await createLead({ name: name.trim(), email: email.trim(), status })
      setName("")
      setEmail("")
      setStatus("New")
      setSuccess(true)
      onLeadCreated()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6 pt-1">
      {/* Name */}
      <div>
        <label className="text-sm font-semibold text-foreground/80 mb-3 block">Full Name</label>
        <Input
          placeholder="e.g. Jane Smith"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-11 text-base pl-3"
          disabled={loading}
        />
      </div>

      {/* Email */}
      <div>
        <label className="text-sm font-semibold text-foreground/80 mb-3 block">Email Address</label>
        <Input
          type="text"
          inputMode="email"
          placeholder="e.g. jane@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          className={`h-11 text-base pl-3 transition-colors ${
            emailValid
              ? "border-emerald-400 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20"
              : emailInvalid
                ? "border-red-400 focus-visible:border-red-500 focus-visible:ring-red-500/20"
                : ""
          }`}
        />
        {emailInvalid && (
          <p className="text-xs text-red-500 font-medium">Enter a valid email address</p>
        )}
        {emailValid && (
          <p className="text-xs text-emerald-600 font-medium">Valid email format</p>
        )}
      </div>

      {/* Status */}
      <div>
        <label className="text-sm font-semibold text-foreground/80 mb-3 block">Lead Status</label>
        <Select value={status} onValueChange={setStatus} disabled={loading}>
          <SelectTrigger className="w-full h-11 text-base rounded-lg border-input bg-transparent px-3 font-normal">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start" className="min-w-[200px]">
            {STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value} className="py-2.5 pl-3 pr-8 text-base cursor-pointer">
                <span className="flex items-center gap-2.5">
                  <span className={`size-2 rounded-full shrink-0 ${s.dot}`} />
                  <span className="font-medium">{s.label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Feedback */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle2 className="size-4 shrink-0" />
          Lead added successfully!
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full h-11 text-base font-semibold gap-2 mt-2"
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Adding Lead…
          </>
        ) : (
          <>
            <UserPlus className="size-4" />
            Add Lead
          </>
        )}
      </Button>
    </form>
  )
}
