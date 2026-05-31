import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { SLA_MINUTES } from "@/types/lead";
import type { Lead } from "@/types/lead";

export function SlaBadge({ lead }: { lead: Lead }) {
  const [, force] = useState(0);
  useEffect(() => {
    if (lead.firstContactAt) return;
    const id = setInterval(() => force((n) => n + 1), 30_000);
    return () => clearInterval(id);
  }, [lead.firstContactAt]);

  if (lead.firstContactAt) {
    const ok = lead.slaStatus === "dentro_sla";
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
          ok
            ? "bg-success/10 text-success"
            : "bg-danger/10 text-danger",
        )}
      >
        <span className={cn("h-1.5 w-1.5 rounded-full", ok ? "bg-success" : "bg-danger")} />
        {ok ? "Dentro do SLA" : "Fora do SLA"}
      </span>
    );
  }

  const elapsedMs = Date.now() - new Date(lead.createdAt).getTime();
  const remainingMs = SLA_MINUTES * 60_000 - elapsedMs;
  if (remainingMs <= 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-danger/10 px-2 py-0.5 text-[11px] font-medium text-danger">
        <span className="h-1.5 w-1.5 rounded-full bg-danger" />
        Fora do SLA
      </span>
    );
  }
  const mins = Math.floor(remainingMs / 60_000);
  const secs = Math.floor((remainingMs % 60_000) / 1000);
  const expiring = remainingMs < 5 * 60_000;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium tabular-nums",
        expiring ? "bg-warning/15 text-warning-foreground" : "bg-success/10 text-success",
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", expiring ? "bg-warning" : "bg-success")} />
      {mins}:{secs.toString().padStart(2, "0")} restantes
    </span>
  );
}
