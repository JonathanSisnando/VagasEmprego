// Configuração central do site. Edite aqui número de WhatsApp e URLs oficiais.

// WhatsApp de contato do serviço de currículo / envio de vaga.
// Formato internacional sem símbolos (ex: 5592900000000).
export const WHATSAPP_NUMERO = "5592900000000";

export const SITE_NOME = "Vagas Manaus Hoje";
export const SITE_DESCRICAO =
  "Central independente de vagas de emprego em Manaus (AM). Vagas do Sine Manaus e SETEMP atualizadas todos os dias.";

export const PRECO_CURRICULO_MIN = 7;
export const PRECO_CURRICULO_MAX = 12;

export function whatsappLink(mensagem: string): string {
  const texto = encodeURIComponent(mensagem);
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${texto}`;
}

export const AVISO_ANTIFRAUDE =
  "Vagas são gratuitas. Nunca pague para se candidatar, fazer cadastro, treinamento ou garantir contratação.";