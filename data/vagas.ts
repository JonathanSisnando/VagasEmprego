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
  fonte: string;
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

export const vagas: Vaga[] = [
  {
    id: "1",
    slug: "auxiliar-administrativo-manaus",
    titulo: "Auxiliar Administrativo",
    empresa: "Empresa não informada",
    cidade: "Manaus",
    estado: "AM",
    bairro: "Centro",
    categoria: "Administrativo",
    escolaridade: "Ensino Médio completo",
    experiencia: "Não necessita experiência",
    salario: "Não informado",
    requisitos: [
      "Ensino médio completo",
      "Conhecimento básico em informática",
      "Boa comunicação",
      "Organização"
    ],
    beneficios: [
      "Vale transporte",
      "Vale alimentação"
    ],
    comoSeCandidatar: "Verifique a forma de candidatura na fonte oficial da vaga.",
    fonte: "SINE Manaus",
    linkFonte: "https://www.manaus.am.gov.br/",
    dataPublicacao: "2026-06-12",
    status: "ativa",
    tipoContrato: "CLT",
    modalidade: "Presencial",
    quantidadeVagas: 1,
    dataExpiracao: "2026-06-30",
    emailCandidatura: "",
    whatsappCandidatura: "",
    pcd: false
  },
  {
    id: "2",
    slug: "auxiliar-de-producao-manaus",
    titulo: "Auxiliar de Produção",
    empresa: "Empresa não informada",
    cidade: "Manaus",
    estado: "AM",
    bairro: "Distrito Industrial",
    categoria: "Produção",
    escolaridade: "Ensino Médio completo",
    experiencia: "Desejável experiência",
    salario: "Não informado",
    requisitos: [
      "Ensino médio completo",
      "Disponibilidade de horário",
      "Experiência em produção será diferencial"
    ],
    beneficios: [
      "Não informado"
    ],
    comoSeCandidatar: "Verifique a forma de candidatura na fonte oficial da vaga.",
    fonte: "Divulgação pública",
    linkFonte: "#",
    dataPublicacao: "2026-06-12",
    status: "ativa"
  },
    {
    id: "3",
    slug: "operador-de-caixa-manaus",
    titulo: "Operador de Caixa",
    empresa: "Empresa não informada",
    cidade: "Manaus",
    estado: "AM",
    bairro: "Não informado",
    categoria: "Atendimento",
    escolaridade: "Ensino Médio completo",
    experiencia: "Desejável experiência",
    salario: "Não informado",
    requisitos: [
      "Ensino médio completo",
      "Boa comunicação",
      "Disponibilidade de horário",
      "Experiência com atendimento será diferencial"
    ],
    beneficios: [
      "Não informado"
    ],
    comoSeCandidatar: "Verifique a forma de candidatura na fonte oficial da vaga.",
    fonte: "Divulgação pública",
    linkFonte: "#",
    dataPublicacao: "2026-06-12",
    status: "ativa",

    tipoContrato: "CLT",
    modalidade: "Presencial",
    quantidadeVagas: 1,
    dataExpiracao: "2026-06-30",
    emailCandidatura: "",
    whatsappCandidatura: "",
    pcd: false
  }
,
  {
    "id": "4",
    "slug": "auxiliar-administrativo-manaus-2",
    "titulo": "Auxiliar Administrativo",
    "empresa": "Empresa não informada",
    "cidade": "Manaus",
    "estado": "AM",
    "bairro": "Não informado",
    "categoria": "Administrativo",
    "escolaridade": "Ensino Médio completo",
    "experiencia": "Desejável experiência",
    "salario": "Não informado",
    "requisitos": [
      "Ensino médio completo",
      "Conhecimento básico em informática",
      "Boa comunicação",
      "Organização e atenção aos detalhes"
    ],
    "beneficios": [
      "Não informado"
    ],
    "comoSeCandidatar": "Verifique a forma de candidatura na fonte oficial da vaga.",
    "fonte": "Divulgação pública",
    "linkFonte": "#",
    "dataPublicacao": "2026-06-13",
    "status": "ativa",
    "tipoContrato": "CLT",
    "modalidade": "Presencial",
    "quantidadeVagas": 1,
    "dataExpiracao": "2026-06-30",
    "emailCandidatura": "",
    "whatsappCandidatura": "",
    "pcd": false
  },
  {
    "id": "5",
    "slug": "auxiliar-de-logistica-manaus",
    "titulo": "Auxiliar de Logística",
    "empresa": "Empresa não informada",
    "cidade": "Manaus",
    "estado": "AM",
    "bairro": "Não informado",
    "categoria": "Logística",
    "escolaridade": "Ensino Médio completo",
    "experiencia": "Desejável experiência",
    "salario": "Não informado",
    "requisitos": [
      "Ensino médio completo",
      "Disponibilidade de horário",
      "Conhecimento em separação e conferência de mercadorias",
      "Experiência na área logística será diferencial"
    ],
    "beneficios": [
      "Não informado"
    ],
    "comoSeCandidatar": "Verifique a forma de candidatura na fonte oficial da vaga.",
    "fonte": "Divulgação pública",
    "linkFonte": "#",
    "dataPublicacao": "2026-06-13",
    "status": "ativa",
    "tipoContrato": "CLT",
    "modalidade": "Presencial",
    "quantidadeVagas": 1,
    "dataExpiracao": "2026-06-30",
    "emailCandidatura": "",
    "whatsappCandidatura": "",
    "pcd": false
  },
  {
    "id": "7",
    "slug": "auxiliar-de-producao-manaus-2",
    "titulo": "Auxiliar de Produção",
    "empresa": "Empresa não informada",
    "cidade": "Manaus",
    "estado": "AM",
    "bairro": "Distrito Industrial",
    "categoria": "Produção",
    "escolaridade": "Ensino Médio completo",
    "experiencia": "Desejável experiência",
    "salario": "Não informado",
    "requisitos": [
      "Ensino médio completo",
      "Disponibilidade para turnos",
      "Atenção às normas de segurança",
      "Experiência em produção será diferencial"
    ],
    "beneficios": [
      "Não informado"
    ],
    "comoSeCandidatar": "Verifique a forma de candidatura na fonte oficial da vaga.",
    "fonte": "Divulgação pública",
    "linkFonte": "#",
    "dataPublicacao": "2026-06-13",
    "status": "ativa",
    "tipoContrato": "CLT",
    "modalidade": "Presencial",
    "quantidadeVagas": 1,
    "dataExpiracao": "2026-06-30",
    "emailCandidatura": "",
    "whatsappCandidatura": "",
    "pcd": false
  },
  {
    "id": "8",
    "slug": "recepcionista-manaus",
    "titulo": "Recepcionista",
    "empresa": "Empresa não informada",
    "cidade": "Manaus",
    "estado": "AM",
    "bairro": "Não informado",
    "categoria": "Atendimento",
    "escolaridade": "Ensino Médio completo",
    "experiencia": "Desejável experiência",
    "salario": "Não informado",
    "requisitos": [
      "Ensino médio completo",
      "Boa comunicação verbal e escrita",
      "Conhecimento básico em informática",
      "Organização e cordialidade no atendimento"
    ],
    "beneficios": [
      "Não informado"
    ],
    "comoSeCandidatar": "Verifique a forma de candidatura na fonte oficial da vaga.",
    "fonte": "Divulgação pública",
    "linkFonte": "#",
    "dataPublicacao": "2026-06-13",
    "status": "ativa",
    "tipoContrato": "CLT",
    "modalidade": "Presencial",
    "quantidadeVagas": 1,
    "dataExpiracao": "2026-06-30",
    "emailCandidatura": "",
    "whatsappCandidatura": "",
    "pcd": false
  }
];