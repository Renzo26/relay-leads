import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";

export const Route = createFileRoute("/sobre")({
  component: SobrePage,
});

function SobrePage() {
  return (
    <AppLayout title="Sobre">
      <div className="max-w-2xl space-y-4">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold mb-2">4Improvements — Gestão de Leads</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Painel interno para acompanhar leads imobiliárias desde a entrada
            até ao encaminhamento para a área responsável.
          </p>
          <ul className="mt-4 text-sm space-y-1.5 text-muted-foreground list-disc list-inside">
            <li>Pipeline visual em quatro estados (Nova → Contactada → Qualificada → Encaminhada).</li>
            <li>Controlo de SLA de 30 minutos para o primeiro contacto.</li>
            <li>Qualificação por interesse e encaminhamento automático.</li>
            <li>Histórico completo de ações por lead.</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 text-sm">
          <h3 className="font-semibold mb-2">Arquitetura</h3>
          <p className="text-muted-foreground leading-relaxed">
            Todos os dados passam pela camada <code className="px-1.5 py-0.5 rounded bg-muted text-xs">src/services/leadsService.ts</code>,
            atualmente com implementação mock em memória. O contrato espelha endpoints REST
            (<code className="text-xs">/contacts/leads</code>, <code className="text-xs">/leads</code>, etc.)
            e é controlado por <code className="text-xs">VITE_API_BASE_URL</code>.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
