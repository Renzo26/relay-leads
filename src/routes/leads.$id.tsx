import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft, Mail, Phone, Calendar, CheckCircle2, MessageCircle, UserCheck, Send, PlusCircle,
} from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { SlaBadge } from "@/components/SlaBadge";
import { SourceIcon } from "@/components/SourceIcon";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  useFirstContact, useLead, useLeadHistory, useQualify, useRoute,
} from "@/hooks/useLeads";
import {
  ACTION_LABEL, AREA_LABEL, INTEREST_LABEL, SOURCE_LABEL, STATUS_LABEL, formatDateTime,
} from "@/lib/lead-format";
import type { ActionType, Interest, InteractionType } from "@/types/lead";
import { INTEREST_TO_AREA } from "@/types/lead";

export const Route = createFileRoute("/leads/$id")({
  component: LeadDetailPage,
});

function LeadDetailPage() {
  const { id } = Route.useParams();
  const { data: lead, isLoading } = useLead(id);
  const { data: history = [] } = useLeadHistory(id);

  const [contactOpen, setContactOpen] = useState(false);
  const [qualifyOpen, setQualifyOpen] = useState(false);

  if (isLoading || !lead) {
    return (
      <AppLayout title="Lead">
        <div className="text-sm text-muted-foreground">A carregar...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title={lead.contact.name}
      action={
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Voltar ao Pipeline
        </Link>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Lead #{lead.id}
              </span>
              <span className="text-xs rounded-md bg-primary/10 text-primary px-2 py-0.5 font-medium">
                {STATUS_LABEL[lead.status]}
              </span>
            </div>
            <h3 className="text-lg font-semibold">{lead.contact.name}</h3>
            <div className="mt-3 space-y-2 text-sm">
              {lead.contact.email && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${lead.contact.email}`} className="hover:text-foreground">
                    {lead.contact.email}
                  </a>
                </div>
              )}
              {lead.contact.phone && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{lead.contact.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formatDateTime(lead.createdAt)}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border space-y-2 text-xs">
              <Row label="Origem">
                <span className="inline-flex items-center gap-1.5">
                  <SourceIcon source={lead.source} /> {SOURCE_LABEL[lead.source]}
                </span>
              </Row>
              {lead.campaign && <Row label="Campanha">{lead.campaign}</Row>}
              <Row label="Área responsável">{AREA_LABEL[lead.responsibleArea]}</Row>
              {lead.interest && <Row label="Interesse">{INTEREST_LABEL[lead.interest]}</Row>}
              <Row label="SLA"><SlaBadge lead={lead} /></Row>
            </div>
            {lead.message && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="text-xs font-medium text-muted-foreground mb-1">Mensagem</div>
                <p className="text-sm leading-relaxed">{lead.message}</p>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 space-y-2">
            <h4 className="text-sm font-semibold mb-2">Ações</h4>
            <Button
              variant={lead.status === "nova" ? "default" : "outline"}
              className="w-full justify-start gap-2"
              disabled={lead.status !== "nova"}
              onClick={() => setContactOpen(true)}
            >
              <MessageCircle className="h-4 w-4" /> Registar 1º contacto
            </Button>
            <Button
              variant={lead.status === "contactada" ? "default" : "outline"}
              className="w-full justify-start gap-2"
              disabled={lead.status !== "contactada"}
              onClick={() => setQualifyOpen(true)}
            >
              <UserCheck className="h-4 w-4" /> Qualificar
            </Button>
            <RouteButton id={id} disabled={lead.status !== "qualificada"} interest={lead.interest} />
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h4 className="text-sm font-semibold mb-5">Histórico</h4>
            <ol className="relative border-l border-border ml-3 space-y-6">
              {history.length === 0 && (
                <li className="text-sm text-muted-foreground ml-4">Sem eventos.</li>
              )}
              {history.map((h) => (
                <li key={h.id} className="ml-6">
                  <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 ring-4 ring-card">
                    <ActionIcon type={h.actionType} />
                  </span>
                  <div className="flex items-baseline justify-between gap-2">
                    <h5 className="text-sm font-medium">{ACTION_LABEL[h.actionType]}</h5>
                    <time className="text-xs text-muted-foreground">{formatDateTime(h.timestamp)}</time>
                  </div>
                  {(h.previousStatus || h.newStatus) && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {h.previousStatus ? STATUS_LABEL[h.previousStatus] : "—"} → {h.newStatus ? STATUS_LABEL[h.newStatus] : "—"}
                    </p>
                  )}
                  {h.newArea && h.previousArea && h.newArea !== h.previousArea && (
                    <p className="text-xs text-muted-foreground">
                      Área: {AREA_LABEL[h.previousArea]} → {AREA_LABEL[h.newArea]}
                    </p>
                  )}
                  {h.note && <p className="text-sm mt-1 text-foreground/80">{h.note}</p>}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <FirstContactDialog id={id} open={contactOpen} onOpenChange={setContactOpen} />
      <QualifyDialog id={id} open={qualifyOpen} onOpenChange={setQualifyOpen} />
    </AppLayout>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground text-right">{children}</span>
    </div>
  );
}

function ActionIcon({ type }: { type: ActionType }) {
  const cls = "h-3 w-3 text-primary";
  if (type === "lead_criada") return <PlusCircle className={cls} />;
  if (type === "primeiro_contacto") return <MessageCircle className={cls} />;
  if (type === "qualificacao") return <UserCheck className={cls} />;
  return <Send className={cls} />;
}

function FirstContactDialog({
  id, open, onOpenChange,
}: { id: string; open: boolean; onOpenChange: (v: boolean) => void }) {
  const mut = useFirstContact(id);
  const [type, setType] = useState<InteractionType>("chamada");
  const [note, setNote] = useState("");

  const submit = () => {
    mut.mutate({ type, note: note || undefined }, {
      onSuccess: () => {
        toast.success("1º contacto registado.");
        setNote("");
        onOpenChange(false);
      },
      onError: (e: Error) => toast.error(e.message),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Registar 1º contacto</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Tipo de contacto</Label>
            <Select value={type} onValueChange={(v) => setType(v as InteractionType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="chamada">Chamada</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Observação</Label>
            <Textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Opcional" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={submit} disabled={mut.isPending}>
            {mut.isPending ? "A registar..." : "Registar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function QualifyDialog({
  id, open, onOpenChange,
}: { id: string; open: boolean; onOpenChange: (v: boolean) => void }) {
  const mut = useQualify(id);
  const [interest, setInterest] = useState<Interest>("comprar_imovel");
  const [note, setNote] = useState("");

  const submit = () => {
    mut.mutate({ interest, note: note || undefined }, {
      onSuccess: () => {
        toast.success("Lead qualificada.");
        setNote("");
        onOpenChange(false);
      },
      onError: (e: Error) => toast.error(e.message),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Qualificar lead</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Interesse</Label>
            <Select value={interest} onValueChange={(v) => setInterest(v as Interest)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.keys(INTEREST_LABEL) as Interest[]).map((i) => (
                  <SelectItem key={i} value={i}>{INTEREST_LABEL[i]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Encaminhamento para: <strong>{AREA_LABEL[INTEREST_TO_AREA[interest]]}</strong>
            </p>
          </div>
          <div className="space-y-1.5">
            <Label>Observação</Label>
            <Textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Opcional" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={submit} disabled={mut.isPending}>
            {mut.isPending ? "A qualificar..." : "Qualificar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RouteButton({
  id, disabled, interest,
}: { id: string; disabled: boolean; interest?: Interest }) {
  const mut = useRoute(id);
  const onClick = () => {
    mut.mutate(undefined, {
      onSuccess: (l) => toast.success(`Encaminhada para ${AREA_LABEL[l.responsibleArea]}.`),
      onError: (e: Error) => toast.error(e.message),
    });
  };
  return (
    <Button
      variant={!disabled ? "default" : "outline"}
      className="w-full justify-start gap-2"
      disabled={disabled || mut.isPending}
      onClick={onClick}
    >
      <CheckCircle2 className="h-4 w-4" />
      {disabled
        ? "Encaminhar"
        : `Encaminhar → ${interest ? AREA_LABEL[INTEREST_TO_AREA[interest]] : ""}`}
    </Button>
  );
}
