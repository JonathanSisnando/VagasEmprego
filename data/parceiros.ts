export type Parceiro = {
  id: string;
  nome: string;
  tipo: "instagram" | "whatsapp";
  descricao: string;
  link: string;
};

export const parceiros: Parceiro[] = [];
