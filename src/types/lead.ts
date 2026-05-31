export type LeadSource =
  | "site"
  | "meta_ads"
  | "whatsapp"
  | "portal"
  | "indicacao"
  | "manual";

export type LeadStatus = "nova" | "contactada" | "qualificada" | "encaminhada";

export type ResponsibleArea =
  | "inside_sales"
  | "buyer_advisory"
  | "sell_advisor_mediacao"
  | "credito_habitacao"
  | "spv_investimentos";

export type Interest =
  | "comprar_imovel"
  | "vender_imovel"
  | "credito_habitacao"
  | "investimento_spv";

export type SlaStatus = "dentro_sla" | "fora_sla";

export type InteractionType = "chamada" | "whatsapp" | "email";

export type ActionType =
  | "lead_criada"
  | "primeiro_contacto"
  | "qualificacao"
  | "encaminhamento";

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  contactId: string;
  source: LeadSource;
  campaign?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  message?: string;
  status: LeadStatus;
  responsibleArea: ResponsibleArea;
  interest?: Interest;
  slaStatus?: SlaStatus;
  createdAt: string;
  firstContactAt?: string;
  routedAt?: string;
}

export interface Interaction {
  id: string;
  leadId: string;
  type: InteractionType;
  note?: string;
  contactedAt: string;
}

export interface LeadHistory {
  id: string;
  leadId: string;
  actionType: ActionType;
  timestamp: string;
  previousStatus?: LeadStatus;
  newStatus?: LeadStatus;
  previousArea?: ResponsibleArea;
  newArea?: ResponsibleArea;
  note?: string;
}

export interface LeadWithContact extends Lead {
  contact: Contact;
}

export interface LeadFilters {
  status?: LeadStatus;
  source?: LeadSource;
  area?: ResponsibleArea;
  sla?: SlaStatus;
  search?: string;
}

export interface CreateLeadInput {
  name: string;
  email?: string;
  phone?: string;
  source: LeadSource;
  campaign?: string;
  message?: string;
}

export interface FirstContactInput {
  type: InteractionType;
  note?: string;
}

export interface QualificationInput {
  interest: Interest;
  note?: string;
}

export const INTEREST_TO_AREA: Record<Interest, ResponsibleArea> = {
  comprar_imovel: "buyer_advisory",
  vender_imovel: "sell_advisor_mediacao",
  credito_habitacao: "credito_habitacao",
  investimento_spv: "spv_investimentos",
};

export const SLA_MINUTES = 30;
