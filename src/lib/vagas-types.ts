export type VagaFonte =
  "Prefeitura de Manaus - Sine Manaus" | "SETEMP - Portal do Trabalhador do Amazonas" | string;

export type Vaga = {
  id: string;
  slug: string;
  titulo: string;
  empresa: string;
  cidade: string;
  estado: string;
  bairro: string;
  categoria: string;
  escolaridade: string;
  experiencia: string;
  salario: string;
  requisitos: string[];
  beneficios: string[];
  comoSeCandidatar: string;
  fonte: VagaFonte;
  linkFonte: string;
  dataPublicacao: string;
  status: string;
  descricao?: string;
  tipoContrato?: string;
  modalidade?: string;
  quantidadeVagas?: number;
  dataExpiracao?: string;
  emailCandidatura?: string;
  whatsappCandidatura?: string;
  pcd?: boolean;
};

export type FonteResumo = {
  fonte: string;
  totalCargos: number; // Posições/roles únicas
  totalVagas: number; // Total de vagas disponíveis (soma das quantitativeVagas)
  linkOficial: string;
  atualizadoEm: string; // ISO
};

export type FonteResposta = {
  vagas: Vaga[];
  resumo: FonteResumo;
};

export const CATEGORIAS = [
  "Administrativo",
  "Produção",
  "Comércio",
  "Logística",
  "Serviços Gerais",
  "Técnico",
  "Indústria",
  "Serviços",
  "Outros",
] as const;

export const FILTROS_RAPIDOS = [
  "Todas",
  "Administrativo",
  "Produção",
  "Atendimento",
  "Logística",
  "Comércio",
  "Serviços gerais",
  "PCD",
  "Ensino médio",
  "Ensino fundamental",
  "Sem experiência",
] as const;

export type FiltroRapido = (typeof FILTROS_RAPIDOS)[number];
