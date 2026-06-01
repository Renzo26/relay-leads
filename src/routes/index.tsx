import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { LeadCard } from "@/components/LeadCard";
import { NewLeadDialog } from "@/components/NewLeadDialog";
import { useLeadsList } from "@/hooks/useLeads";
import { STATUS_LABEL } from "@/lib/lead-format";
import type { LeadStatus, LeadWithContact } from "@/types/lead";

const COLUMNS: LeadStatus[] = ["nova", "contactada", "encaminhada"];

const COLUMN_LABEL: Partial<Record<LeadStatus, string>> = {
  encaminhada: "Qualificada e Encaminhada",
};

export const Route = createFileRoute("/")({
  component: PipelinePage,
});

function PipelinePage() {
  const [open, setOpen] = useState(false);
  const { data: leads, isLoading } = useLeadsList();

  const byStatus: Record<LeadStatus, LeadWithContact[]> = {
    nova: [], contactada: [], qualificada: [], encaminhada: [],
  };
  leads?.forEach((l) => {
    const bucket = l.status === "qualificada" ? "encaminhada" : l.status;
    byStatus[bucket].push(l);
  });

  return (
    <AppLayout
      title="Pipeline"
      action={
        <Button onClick={() => setOpen(true)} className="gap-1.5">
          <Plus className="h-4 w-4" /> Nova Lead
        </Button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-4">
        {COLUMNS.map((col) => (
          <div key={col} className="flex flex-col rounded-2xl bg-muted/40 border border-border min-h-[60vh]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h2 className="text-sm font-semibold">{COLUMN_LABEL[col] ?? STATUS_LABEL[col]}</h2>
              <span className="text-xs text-muted-foreground rounded-full bg-card px-2 py-0.5 border border-border">
                {byStatus[col].length}
              </span>
            </div>
            <div className="flex-1 p-3 space-y-3 overflow-y-auto">
              {isLoading && (
                <div className="text-xs text-muted-foreground text-center py-8">A carregar...</div>
              )}
              {!isLoading && byStatus[col].length === 0 && (
                <div className="text-xs text-muted-foreground text-center py-8">Sem leads</div>
              )}
              {byStatus[col].map((lead) => (
                <LeadCard key={lead.id} lead={lead} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <NewLeadDialog open={open} onOpenChange={setOpen} />
    </AppLayout>
  );
}
