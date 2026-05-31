import { Globe, MessageCircle, Megaphone, Building2, Users, PenLine } from "lucide-react";
import type { LeadSource } from "@/types/lead";

const map = {
  site: Globe,
  meta_ads: Megaphone,
  whatsapp: MessageCircle,
  portal: Building2,
  indicacao: Users,
  manual: PenLine,
} as const;

export function SourceIcon({ source, className }: { source: LeadSource; className?: string }) {
  const Icon = map[source];
  return <Icon className={className ?? "h-3.5 w-3.5"} />;
}
