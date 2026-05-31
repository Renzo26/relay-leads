import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createLead,
  getLead,
  getLeadHistory,
  listLeads,
  qualifyLead,
  registerFirstContact,
  routeLead,
} from "@/services/leadsService";
import type {
  CreateLeadInput,
  FirstContactInput,
  LeadFilters,
  QualificationInput,
} from "@/types/lead";

export const leadKeys = {
  all: ["leads"] as const,
  list: (filters: LeadFilters) => ["leads", "list", filters] as const,
  detail: (id: string) => ["leads", "detail", id] as const,
  history: (id: string) => ["leads", "history", id] as const,
};

export function useLeadsList(filters: LeadFilters = {}) {
  return useQuery({
    queryKey: leadKeys.list(filters),
    queryFn: () => listLeads(filters),
  });
}

export function useLead(id: string) {
  return useQuery({
    queryKey: leadKeys.detail(id),
    queryFn: () => getLead(id),
    enabled: !!id,
  });
}

export function useLeadHistory(id: string) {
  return useQuery({
    queryKey: leadKeys.history(id),
    queryFn: () => getLeadHistory(id),
    enabled: !!id,
  });
}

export function useCreateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateLeadInput) => createLead(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: leadKeys.all }),
  });
}

export function useFirstContact(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: FirstContactInput) => registerFirstContact(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: leadKeys.all });
    },
  });
}

export function useQualify(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: QualificationInput) => qualifyLead(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: leadKeys.all }),
  });
}

export function useRoute(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => routeLead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: leadKeys.all }),
  });
}
