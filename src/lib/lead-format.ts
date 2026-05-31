import type {
  ActionType,
  Interest,
  LeadSource,
  LeadStatus,
  ResponsibleArea,
} from "@/types/lead";

export const SOURCE_LABEL: Record<LeadSource, string> = {
  site: "Site",
  meta_ads: "Meta Ads",
  whatsapp: "WhatsApp",
  portal: "Portal",
  indicacao: "Indicação",
  manual: "Manual",
};

export const STATUS_LABEL: Record<LeadStatus, string> = {
  nova: "Nova",
  contactada: "Contactada",
  qualificada: "Qualificada",
  encaminhada: "Encaminhada",
};

export const AREA_LABEL: Record<ResponsibleArea, string> = {
  inside_sales: "Inside Sales",
  buyer_advisory: "Buyer Advisory",
  sell_advisor_mediacao: "Sell Advisor / Mediação",
  credito_habitacao: "Crédito Habitação",
  spv_investimentos: "SPV Investimentos",
};

export const INTEREST_LABEL: Record<Interest, string> = {
  comprar_imovel: "Comprar imóvel",
  vender_imovel: "Vender imóvel",
  credito_habitacao: "Crédito habitação",
  investimento_spv: "Investimento SPV",
};

export const ACTION_LABEL: Record<ActionType, string> = {
  lead_criada: "Lead criada",
  primeiro_contacto: "1º contacto registado",
  qualificacao: "Qualificação",
  encaminhamento: "Encaminhamento",
};

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "agora";
  if (min < 60) return `há ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h} h`;
  const d = Math.floor(h / 24);
  return `há ${d} d`;
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
