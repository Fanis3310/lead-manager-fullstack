// Types
export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: "New" | "Engaged" | "Proposal Sent" | "Closed-Won" | "Closed-Lost";
  createdAt: string;
}

export interface CreateLeadData {
  name: string;
  email: string;
  status?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function fetchLeads(): Promise<Lead[]> {
  const res = await fetch(`${API_BASE}/leads`);
  if (!res.ok) throw new Error("Failed to fetch leads");
  return res.json();
}

export async function createLead(data: CreateLeadData): Promise<Lead> {
  const res = await fetch(`${API_BASE}/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to create lead");
  }
  return res.json();
}

export async function updateLead(id: string, data: CreateLeadData): Promise<Lead> {
  const res = await fetch(`${API_BASE}/leads/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to update lead");
  }
  return res.json();
}

export async function deleteLead(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/leads/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to delete lead");
  }
}
