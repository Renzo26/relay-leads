import { Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { SlaBadge } from "@/components/SlaBadge";
import { SourceIcon } from "@/components/SourceIcon";
import { AREA_LABEL, SOURCE_LABEL, timeAgo } from "@/lib/lead-format";
import type { LeadWithContact } from "@/types/lead";

export function LeadCard({ lead }: { lead: LeadWithContact }) {
  return (
    <Link
      to="/leads/$id"
      params={{ id: lead.id }}
      className="block rounded-xl border border-border bg-card p-4 shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="font-medium text-sm truncate">{lead.contact.name}</div>
        <SlaBadge lead={lead} />
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
        <SourceIcon source={lead.source} />
        <span>{SOURCE_LABEL[lead.source]}</span>
        {lead.campaign && <span className="truncate">· {lead.campaign}</span>}
      </div>
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="rounded-md bg-muted px-2 py-0.5 truncate max-w-[60%]">
          {AREA_LABEL[lead.responsibleArea]}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {timeAgo(lead.createdAt)}
        </span>
      </div>
    </Link>
  );
}
