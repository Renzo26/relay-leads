import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle, Users, TrendingUp } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { useLeadsList } from "@/hooks/useLeads";
import { AREA_LABEL, SOURCE_LABEL } from "@/lib/lead-format";
import type { LeadSource, ResponsibleArea } from "@/types/lead";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { data: leads = [], isLoading } = useLeadsList();

  const total = leads.length;
  const novas = leads.filter((l) => l.status === "nova").length;
  const encaminhadas = leads.filter((l) => l.status === "encaminhada").length;
  const foraSla = leads.filter((l) => l.slaStatus === "fora_sla").length;
  const dentroSla = leads.filter((l) => l.slaStatus === "dentro_sla").length;
  const semContacto = leads.filter((l) => !l.firstContactAt).length;

  const taxaSla = dentroSla + foraSla > 0
    ? Math.round((dentroSla / (dentroSla + foraSla)) * 100)
    : null;

  const bySource = leads.reduce<Record<string, number>>((acc, l) => {
    acc[l.source] = (acc[l.source] ?? 0) + 1;
    return acc;
  }, {});

  const byArea = leads
    .filter((l) => l.responsibleArea && l.responsibleArea !== "inside_sales")
    .reduce<Record<string, number>>((acc, l) => {
      acc[l.responsibleArea] = (acc[l.responsibleArea] ?? 0) + 1;
      return acc;
    }, {});

  const topSources = Object.entries(bySource)
    .sort((a, b) => b[1] - a[1]);

  const topAreas = Object.entries(byArea)
    .sort((a, b) => b[1] - a[1]);

  const maxSource = topSources[0]?.[1] ?? 1;
  const maxArea = topAreas[0]?.[1] ?? 1;

  if (isLoading) {
    return (
      <AppLayout title="Dashboard">
        <div className="text-sm text-muted-foreground">A carregar...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Dashboard">
      <div className="space-y-8">

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Total de Leads"
            value={total}
            icon={<Users className="h-4 w-4" />}
            color="blue"
          />
          <KpiCard
            label="Sem 1º Contacto"
            value={semContacto}
            icon={<TrendingUp className="h-4 w-4" />}
            color="yellow"
            sub={total > 0 ? `${Math.round((semContacto / total) * 100)}% do total` : undefined}
          />
          <KpiCard
            label="Fora do SLA"
            value={foraSla}
            icon={<AlertTriangle className="h-4 w-4" />}
            color="red"
            sub={taxaSla !== null ? `${100 - taxaSla}% das contactadas` : undefined}
          />
          <KpiCard
            label="Encaminhadas"
            value={encaminhadas}
            icon={<CheckCircle className="h-4 w-4" />}
            color="green"
            sub={total > 0 ? `${Math.round((encaminhadas / total) * 100)}% do total` : undefined}
          />
        </div>

        {/* SLA Summary */}
        {(dentroSla + foraSla) > 0 && (
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold mb-4">SLA do 1º Contacto (30 min)</h2>
            <div className="flex items-center gap-4 mb-3">
              <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-success transition-all"
                  style={{ width: `${taxaSla}%` }}
                />
              </div>
              <span className="text-sm font-semibold tabular-nums w-12 text-right">
                {taxaSla}%
              </span>
            </div>
            <div className="flex gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-success inline-block" />
                Dentro do SLA: <strong className="text-foreground">{dentroSla}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-danger inline-block" />
                Fora do SLA: <strong className="text-foreground">{foraSla}</strong>
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Por Origem */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold mb-4">Leads por Origem</h2>
            {topSources.length === 0 ? (
              <p className="text-xs text-muted-foreground">Sem dados</p>
            ) : (
              <div className="space-y-3">
                {topSources.map(([source, count]) => (
                  <div key={source}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">
                        {SOURCE_LABEL[source as LeadSource] ?? source}
                      </span>
                      <span className="font-medium tabular-nums">{count}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${(count / maxSource) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Por Área */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold mb-4">Leads Encaminhadas por Área</h2>
            {topAreas.length === 0 ? (
              <p className="text-xs text-muted-foreground">Nenhuma lead encaminhada ainda</p>
            ) : (
              <div className="space-y-3">
                {topAreas.map(([area, count]) => (
                  <div key={area}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">
                        {AREA_LABEL[area as ResponsibleArea] ?? area}
                      </span>
                      <span className="font-medium tabular-nums">{count}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${(count / maxArea) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Funil */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold mb-4">Funil de Leads</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Novas", value: novas, color: "bg-blue-500" },
              { label: "Contactadas", value: leads.filter((l) => l.status === "contactada").length, color: "bg-yellow-500" },
              { label: "Encaminhadas", value: encaminhadas, color: "bg-green-500" },
              { label: "Fora do SLA", value: foraSla, color: "bg-red-500" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-border p-4 text-center">
                <div className={cn("h-1 rounded-full mb-3", item.color)} />
                <div className="text-2xl font-bold tabular-nums">{item.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppLayout>
  );
}

function KpiCard({
  label,
  value,
  icon,
  color,
  sub,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: "blue" | "yellow" | "red" | "green";
  sub?: string;
}) {
  const colors = {
    blue: "bg-blue-500/10 text-blue-600",
    yellow: "bg-yellow-500/10 text-yellow-600",
    red: "bg-red-500/10 text-red-600",
    green: "bg-green-500/10 text-green-600",
  };
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-muted-foreground font-medium">{label}</span>
        <span className={cn("p-1.5 rounded-lg", colors[color])}>{icon}</span>
      </div>
      <div className="text-3xl font-bold tabular-nums">{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
    </div>
  );
}
