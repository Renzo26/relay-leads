/**
 * Leads Service — single data-access layer.
 *
 * Components MUST NOT call data sources directly. Use this service (or the
 * hooks built on top of it in `src/hooks/useLeads.ts`).
 *
 * Currently backed by an in-memory mock (`./mock/store.ts`). When the real
 * backend is available, swap the implementations below for `fetch`/`axios`
 * calls. The function signatures match the REST contract 1:1:
 *
 *   createLead(input)            -> POST   /contacts/leads
 *   listLeads(filters)           -> GET    /leads
 *   getLead(id)                  -> GET    /leads/:id
 *   registerFirstContact(id, x)  -> POST   /leads/:id/first-contact
 *   qualifyLead(id, x)           -> POST   /leads/:id/qualification
 *   routeLead(id)                -> POST   /leads/:id/route
 *   getLeadHistory(id)           -> GET    /leads/:id/history
 *
 * Base URL is read from VITE_API_BASE_URL (with mock fallback when unset).
 */
import type {
  Contact,
  CreateLeadInput,
  FirstContactInput,
  Lead,
  LeadFilters,
  LeadHistory,
  LeadWithContact,
  QualificationInput,
} from "@/types/lead";
import { INTEREST_TO_AREA, SLA_MINUTES } from "@/types/lead";
import { nextId, store } from "./mock/store";

export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "mock";

const isMock = API_BASE_URL === "mock";

// Simulate network latency for realistic UX.
const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

function withContact(lead: Lead): LeadWithContact {
  const contact = store.contacts.find((c) => c.id === lead.contactId)!;
  return { ...lead, contact };
}

function computeSla(lead: Lead): Lead {
  if (lead.firstContactAt) {
    const created = new Date(lead.createdAt).getTime();
    const contacted = new Date(lead.firstContactAt).getTime();
    const diffMin = (contacted - created) / 60_000;
    return { ...lead, slaStatus: diffMin <= SLA_MINUTES ? "dentro_sla" : "fora_sla" };
  }
  return lead;
}

// POST /contacts/leads
export async function createLead(input: CreateLeadInput): Promise<LeadWithContact> {
  if (!isMock) {
    const res = await fetch(`${API_BASE_URL}/contacts/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error("Falha ao criar lead");
    return res.json();
  }
  await delay();

  // Reuse contact by email/phone if exists, else create.
  let contact: Contact | undefined = store.contacts.find(
    (c) =>
      (input.email && c.email === input.email) ||
      (input.phone && c.phone === input.phone),
  );
  if (!contact) {
    contact = {
      id: nextId("c"),
      name: input.name,
      email: input.email,
      phone: input.phone,
      createdAt: new Date().toISOString(),
    };
    store.contacts.push(contact);
  }

  const lead: Lead = {
    id: nextId("l"),
    contactId: contact.id,
    source: input.source,
    campaign: input.campaign,
    message: input.message,
    status: "nova",
    responsibleArea: "inside_sales",
    createdAt: new Date().toISOString(),
  };
  store.leads.unshift(lead);
  store.history.push({
    id: nextId("h"),
    leadId: lead.id,
    actionType: "lead_criada",
    timestamp: lead.createdAt,
    newStatus: "nova",
    newArea: "inside_sales",
  });
  return withContact(lead);
}

// GET /leads
export async function listLeads(filters: LeadFilters = {}): Promise<LeadWithContact[]> {
  if (!isMock) {
    const params = new URLSearchParams(filters as Record<string, string>);
    const res = await fetch(`${API_BASE_URL}/leads?${params}`);
    if (!res.ok) throw new Error("Falha ao listar leads");
    return res.json();
  }
  await delay(150);
  let leads = store.leads.map(computeSla);

  if (filters.status) leads = leads.filter((l) => l.status === filters.status);
  if (filters.source) leads = leads.filter((l) => l.source === filters.source);
  if (filters.area) leads = leads.filter((l) => l.responsibleArea === filters.area);
  if (filters.sla)
    leads = leads.filter((l) => {
      if (filters.sla === "dentro_sla") return l.slaStatus === "dentro_sla";
      if (filters.sla === "fora_sla") {
        if (l.slaStatus === "fora_sla") return true;
        // Pending lead past SLA window also counts
        if (!l.firstContactAt) {
          const elapsed = (Date.now() - new Date(l.createdAt).getTime()) / 60_000;
          return elapsed > SLA_MINUTES;
        }
        return false;
      }
      return true;
    });

  const withContacts = leads.map(withContact);
  if (filters.search) {
    const q = filters.search.toLowerCase();
    return withContacts.filter((l) => l.contact.name.toLowerCase().includes(q));
  }
  return withContacts;
}

// GET /leads/:id
export async function getLead(id: string): Promise<LeadWithContact> {
  if (!isMock) {
    const res = await fetch(`${API_BASE_URL}/leads/${id}`);
    if (!res.ok) throw new Error("Lead não encontrada");
    return res.json();
  }
  await delay(120);
  const lead = store.leads.find((l) => l.id === id);
  if (!lead) throw new Error("Lead não encontrada");
  return withContact(computeSla(lead));
}

// POST /leads/:id/first-contact
export async function registerFirstContact(
  id: string,
  input: FirstContactInput,
): Promise<LeadWithContact> {
  if (!isMock) {
    const res = await fetch(`${API_BASE_URL}/leads/${id}/first-contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error("Falha ao registar contacto");
    return res.json();
  }
  await delay();
  const idx = store.leads.findIndex((l) => l.id === id);
  if (idx === -1) throw new Error("Lead não encontrada");
  const now = new Date().toISOString();
  const prev = store.leads[idx];
  const updated = computeSla({ ...prev, status: "contactada", firstContactAt: now });
  store.leads[idx] = updated;
  store.interactions.push({
    id: nextId("i"),
    leadId: id,
    type: input.type,
    note: input.note,
    contactedAt: now,
  });
  store.history.push({
    id: nextId("h"),
    leadId: id,
    actionType: "primeiro_contacto",
    timestamp: now,
    previousStatus: prev.status,
    newStatus: "contactada",
    note: input.note ? `${input.type}: ${input.note}` : input.type,
  });
  return withContact(updated);
}

// POST /leads/:id/qualification
export async function qualifyLead(
  id: string,
  input: QualificationInput,
): Promise<LeadWithContact> {
  if (!isMock) {
    const res = await fetch(`${API_BASE_URL}/leads/${id}/qualification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error("Falha ao qualificar");
    return res.json();
  }
  await delay();
  const idx = store.leads.findIndex((l) => l.id === id);
  if (idx === -1) throw new Error("Lead não encontrada");
  const prev = store.leads[idx];
  const updated: Lead = { ...prev, status: "qualificada", interest: input.interest };
  store.leads[idx] = updated;
  store.history.push({
    id: nextId("h"),
    leadId: id,
    actionType: "qualificacao",
    timestamp: new Date().toISOString(),
    previousStatus: prev.status,
    newStatus: "qualificada",
    note: input.note,
  });
  return withContact(updated);
}

// POST /leads/:id/route
export async function routeLead(id: string): Promise<LeadWithContact> {
  if (!isMock) {
    const res = await fetch(`${API_BASE_URL}/leads/${id}/route`, { method: "POST" });
    if (!res.ok) throw new Error("Falha ao encaminhar");
    return res.json();
  }
  await delay();
  const idx = store.leads.findIndex((l) => l.id === id);
  if (idx === -1) throw new Error("Lead não encontrada");
  const prev = store.leads[idx];
  if (!prev.interest) throw new Error("Lead precisa ser qualificada antes do encaminhamento.");
  const newArea = INTEREST_TO_AREA[prev.interest];
  const now = new Date().toISOString();
  const updated: Lead = { ...prev, status: "encaminhada", responsibleArea: newArea, routedAt: now };
  store.leads[idx] = updated;
  store.history.push({
    id: nextId("h"),
    leadId: id,
    actionType: "encaminhamento",
    timestamp: now,
    previousStatus: prev.status,
    newStatus: "encaminhada",
    previousArea: prev.responsibleArea,
    newArea,
  });
  return withContact(updated);
}

// GET /leads/:id/history
export async function getLeadHistory(id: string): Promise<LeadHistory[]> {
  if (!isMock) {
    const res = await fetch(`${API_BASE_URL}/leads/${id}/history`);
    if (!res.ok) throw new Error("Falha ao carregar histórico");
    return res.json();
  }
  await delay(120);
  return store.history
    .filter((h) => h.leadId === id)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}
