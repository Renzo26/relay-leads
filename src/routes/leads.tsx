import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NewLeadDialog } from "@/components/NewLeadDialog";
import { SlaBadge } from "@/components/SlaBadge";
import { SourceIcon } from "@/components/SourceIcon";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useLeadsList } from "@/hooks/useLeads";
import {
  AREA_LABEL, SOURCE_LABEL, STATUS_LABEL, timeAgo,
} from "@/lib/lead-format";
import type {
  LeadFilters, LeadSource, LeadStatus, ResponsibleArea, SlaStatus,
} from "@/types/lead";

export const Route = createFileRoute("/leads")({
  component: LeadsListPage,
});

const ALL = "__all__";

function LeadsListPage() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>(ALL);
  const [source, setSource] = useState<string>(ALL);
  const [area, setArea] = useState<string>(ALL);
  const [sla, setSla] = useState<string>(ALL);

  const filters: LeadFilters = useMemo(() => ({
    status: status === ALL ? undefined : (status as LeadStatus),
    source: source === ALL ? undefined : (source as LeadSource),
    area: area === ALL ? undefined : (area as ResponsibleArea),
    sla: sla === ALL ? undefined : (sla as SlaStatus),
    search: search || undefined,
  }), [status, source, area, sla, search]);

  const { data: leads = [], isLoading } = useLeadsList(filters);

  return (
    <AppLayout
      title="Leads"
      action={
        <Button onClick={() => setOpen(true)} className="gap-1.5">
          <Plus className="h-4 w-4" /> Nova Lead
        </Button>
      }
    >
      <div className="rounded-2xl border border-border bg-card">
        <div className="p-4 flex flex-col lg:flex-row gap-3 lg:items-center border-b border-border">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar por nome..."
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <FilterSelect value={status} onChange={setStatus} placeholder="Estado"
              options={Object.entries(STATUS_LABEL)} />
            <FilterSelect value={source} onChange={setSource} placeholder="Origem"
              options={Object.entries(SOURCE_LABEL)} />
            <FilterSelect value={area} onChange={setArea} placeholder="Área"
              options={Object.entries(AREA_LABEL)} />
            <FilterSelect value={sla} onChange={setSla} placeholder="SLA"
              options={[["dentro_sla", "Dentro do SLA"], ["fora_sla", "Fora do SLA"]]} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground bg-muted/40">
              <tr>
                <th className="text-left font-medium px-4 py-3">Contacto</th>
                <th className="text-left font-medium px-4 py-3">Origem</th>
                <th className="text-left font-medium px-4 py-3">Estado</th>
                <th className="text-left font-medium px-4 py-3">Área</th>
                <th className="text-left font-medium px-4 py-3">SLA</th>
                <th className="text-left font-medium px-4 py-3">Criada</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={6} className="text-center py-10 text-muted-foreground">A carregar...</td></tr>
              )}
              {!isLoading && leads.length === 0 && (
                <tr><td colSpan={6} className="text-center py-10 text-muted-foreground">Sem resultados</td></tr>
              )}
              {leads.map((lead) => (
                <tr key={lead.id} className="border-t border-border hover:bg-muted/40 transition-colors">
                  <td className="px-4 py-3">
                    <Link to="/leads/$id" params={{ id: lead.id }} className="font-medium hover:text-primary">
                      {lead.contact.name}
                    </Link>
                    <div className="text-xs text-muted-foreground">{lead.contact.email ?? lead.contact.phone}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs">
                      <SourceIcon source={lead.source} />
                      {SOURCE_LABEL[lead.source]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs rounded-md bg-muted px-2 py-0.5">{STATUS_LABEL[lead.status]}</span>
                  </td>
                  <td className="px-4 py-3 text-xs">{AREA_LABEL[lead.responsibleArea]}</td>
                  <td className="px-4 py-3"><SlaBadge lead={lead} /></td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{timeAgo(lead.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <NewLeadDialog open={open} onOpenChange={setOpen} />
    </AppLayout>
  );
}

function FilterSelect({
  value, onChange, placeholder, options,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: [string, string][];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[160px]"><SelectValue placeholder={placeholder} /></SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>Todos ({placeholder})</SelectItem>
        {options.map(([v, label]) => (
          <SelectItem key={v} value={v}>{label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
