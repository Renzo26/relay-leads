import type {
  Contact,
  Interaction,
  Lead,
  LeadHistory,
} from "@/types/lead";

// In-memory mock store. Replace with real API calls when backend is ready.
interface Store {
  contacts: Contact[];
  leads: Lead[];
  interactions: Interaction[];
  history: LeadHistory[];
}

const now = Date.now();
const minutesAgo = (m: number) => new Date(now - m * 60_000).toISOString();

const contacts: Contact[] = [
  { id: "c1", name: "Ana Ferreira", email: "ana.ferreira@example.com", phone: "+351 912 345 678", createdAt: minutesAgo(60 * 24 * 5) },
  { id: "c2", name: "Bruno Costa", email: "bruno@example.com", phone: "+351 911 222 333", createdAt: minutesAgo(180) },
  { id: "c3", name: "Carla Mendes", email: "carla.mendes@example.com", phone: "+351 933 444 555", createdAt: minutesAgo(45) },
  { id: "c4", name: "Diogo Pinto", email: "diogo.pinto@example.com", phone: "+351 966 777 888", createdAt: minutesAgo(20) },
  { id: "c5", name: "Eduarda Sousa", phone: "+351 962 100 200", createdAt: minutesAgo(8) },
  { id: "c6", name: "Filipe Almeida", email: "filipe@example.com", createdAt: minutesAgo(15) },
  { id: "c7", name: "Gabriela Lopes", email: "gabi@example.com", phone: "+351 919 191 919", createdAt: minutesAgo(60 * 24 * 2) },
  { id: "c8", name: "Hugo Ribeiro", email: "hugo.ribeiro@example.com", phone: "+351 925 252 525", createdAt: minutesAgo(60 * 6) },
  { id: "c9", name: "Inês Carvalho", email: "ines@example.com", phone: "+351 913 131 313", createdAt: minutesAgo(60 * 24) },
  { id: "c10", name: "João Tavares", email: "joao.t@example.com", phone: "+351 917 171 717", createdAt: minutesAgo(35) },
];

const leads: Lead[] = [
  // Lead com histórico completo
  {
    id: "l1", contactId: "c1", source: "site", campaign: "Casa Lisboa Q2",
    utmSource: "google", utmMedium: "cpc", utmCampaign: "casa-lisboa",
    message: "Procuro T3 em Lisboa, zona Parque das Nações.",
    status: "encaminhada", responsibleArea: "buyer_advisory",
    interest: "comprar_imovel", slaStatus: "dentro_sla",
    createdAt: minutesAgo(60 * 24 * 5),
    firstContactAt: minutesAgo(60 * 24 * 5 - 18),
    routedAt: minutesAgo(60 * 24 * 4),
  },
  {
    id: "l2", contactId: "c2", source: "meta_ads", campaign: "Crédito Habitação",
    message: "Quero simular crédito.",
    status: "qualificada", responsibleArea: "inside_sales",
    interest: "credito_habitacao", slaStatus: "dentro_sla",
    createdAt: minutesAgo(180),
    firstContactAt: minutesAgo(180 - 22),
  },
  {
    id: "l3", contactId: "c3", source: "whatsapp",
    message: "Tenho um apartamento para vender no Porto.",
    status: "contactada", responsibleArea: "inside_sales",
    slaStatus: "fora_sla",
    createdAt: minutesAgo(120),
    firstContactAt: minutesAgo(40),
  },
  {
    id: "l4", contactId: "c4", source: "portal",
    message: "Interessado em investimento.",
    status: "nova", responsibleArea: "inside_sales",
    createdAt: minutesAgo(20),
  },
  {
    id: "l5", contactId: "c5", source: "site",
    message: "Procuro T2 em Cascais.",
    status: "nova", responsibleArea: "inside_sales",
    createdAt: minutesAgo(8),
  },
  {
    id: "l6", contactId: "c6", source: "indicacao",
    message: "Indicação do João.",
    status: "nova", responsibleArea: "inside_sales",
    createdAt: minutesAgo(45), // fora do SLA já (>30min sem contacto)
  },
  {
    id: "l7", contactId: "c7", source: "meta_ads", campaign: "SPV Invest",
    status: "encaminhada", responsibleArea: "spv_investimentos",
    interest: "investimento_spv", slaStatus: "dentro_sla",
    createdAt: minutesAgo(60 * 24 * 2),
    firstContactAt: minutesAgo(60 * 24 * 2 - 10),
    routedAt: minutesAgo(60 * 24),
  },
  {
    id: "l8", contactId: "c8", source: "manual",
    message: "Cliente referenciado pela equipa.",
    status: "qualificada", responsibleArea: "inside_sales",
    interest: "vender_imovel", slaStatus: "dentro_sla",
    createdAt: minutesAgo(60 * 6),
    firstContactAt: minutesAgo(60 * 6 - 15),
  },
  {
    id: "l9", contactId: "c9", source: "site",
    status: "contactada", responsibleArea: "inside_sales",
    slaStatus: "dentro_sla",
    createdAt: minutesAgo(60 * 24),
    firstContactAt: minutesAgo(60 * 24 - 12),
  },
  {
    id: "l10", contactId: "c10", source: "portal",
    message: "Pedido de avaliação.",
    status: "nova", responsibleArea: "inside_sales",
    createdAt: minutesAgo(35), // fora SLA contador
  },
];

const interactions: Interaction[] = [
  { id: "i1", leadId: "l1", type: "chamada", note: "Apresentação inicial, boa receptividade.", contactedAt: minutesAgo(60 * 24 * 5 - 18) },
  { id: "i2", leadId: "l2", type: "whatsapp", contactedAt: minutesAgo(180 - 22) },
  { id: "i3", leadId: "l3", type: "whatsapp", note: "Pediu visita ao imóvel.", contactedAt: minutesAgo(40) },
];

const history: LeadHistory[] = [
  { id: "h1", leadId: "l1", actionType: "lead_criada", timestamp: minutesAgo(60 * 24 * 5), newStatus: "nova", newArea: "inside_sales" },
  { id: "h2", leadId: "l1", actionType: "primeiro_contacto", timestamp: minutesAgo(60 * 24 * 5 - 18), previousStatus: "nova", newStatus: "contactada", note: "Chamada: apresentação inicial." },
  { id: "h3", leadId: "l1", actionType: "qualificacao", timestamp: minutesAgo(60 * 24 * 5 - 60), previousStatus: "contactada", newStatus: "qualificada", note: "Interesse: comprar imóvel T3." },
  { id: "h4", leadId: "l1", actionType: "encaminhamento", timestamp: minutesAgo(60 * 24 * 4), previousStatus: "qualificada", newStatus: "encaminhada", previousArea: "inside_sales", newArea: "buyer_advisory" },

  { id: "h5", leadId: "l2", actionType: "lead_criada", timestamp: minutesAgo(180), newStatus: "nova", newArea: "inside_sales" },
  { id: "h6", leadId: "l2", actionType: "primeiro_contacto", timestamp: minutesAgo(180 - 22), previousStatus: "nova", newStatus: "contactada", note: "WhatsApp respondido." },
  { id: "h7", leadId: "l2", actionType: "qualificacao", timestamp: minutesAgo(60), previousStatus: "contactada", newStatus: "qualificada", note: "Interesse: crédito habitação." },

  { id: "h8", leadId: "l3", actionType: "lead_criada", timestamp: minutesAgo(120), newStatus: "nova", newArea: "inside_sales" },
  { id: "h9", leadId: "l3", actionType: "primeiro_contacto", timestamp: minutesAgo(40), previousStatus: "nova", newStatus: "contactada", note: "Contacto tardio." },

  { id: "h10", leadId: "l4", actionType: "lead_criada", timestamp: minutesAgo(20), newStatus: "nova", newArea: "inside_sales" },
  { id: "h11", leadId: "l5", actionType: "lead_criada", timestamp: minutesAgo(8), newStatus: "nova", newArea: "inside_sales" },
  { id: "h12", leadId: "l6", actionType: "lead_criada", timestamp: minutesAgo(45), newStatus: "nova", newArea: "inside_sales" },

  { id: "h13", leadId: "l7", actionType: "lead_criada", timestamp: minutesAgo(60 * 24 * 2), newStatus: "nova", newArea: "inside_sales" },
  { id: "h14", leadId: "l7", actionType: "primeiro_contacto", timestamp: minutesAgo(60 * 24 * 2 - 10), previousStatus: "nova", newStatus: "contactada" },
  { id: "h15", leadId: "l7", actionType: "qualificacao", timestamp: minutesAgo(60 * 24 * 2 - 30), previousStatus: "contactada", newStatus: "qualificada", note: "Interesse: investimento SPV." },
  { id: "h16", leadId: "l7", actionType: "encaminhamento", timestamp: minutesAgo(60 * 24), previousStatus: "qualificada", newStatus: "encaminhada", previousArea: "inside_sales", newArea: "spv_investimentos" },

  { id: "h17", leadId: "l8", actionType: "lead_criada", timestamp: minutesAgo(60 * 6), newStatus: "nova", newArea: "inside_sales" },
  { id: "h18", leadId: "l8", actionType: "primeiro_contacto", timestamp: minutesAgo(60 * 6 - 15), previousStatus: "nova", newStatus: "contactada" },
  { id: "h19", leadId: "l8", actionType: "qualificacao", timestamp: minutesAgo(60 * 5), previousStatus: "contactada", newStatus: "qualificada", note: "Interesse: vender imóvel." },

  { id: "h20", leadId: "l9", actionType: "lead_criada", timestamp: minutesAgo(60 * 24), newStatus: "nova", newArea: "inside_sales" },
  { id: "h21", leadId: "l9", actionType: "primeiro_contacto", timestamp: minutesAgo(60 * 24 - 12), previousStatus: "nova", newStatus: "contactada" },

  { id: "h22", leadId: "l10", actionType: "lead_criada", timestamp: minutesAgo(35), newStatus: "nova", newArea: "inside_sales" },
];

export const store: Store = { contacts, leads, interactions, history };

let idCounter = 1000;
export const nextId = (prefix: string) => `${prefix}${++idCounter}`;
