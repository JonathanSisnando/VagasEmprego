import type { Vaga } from "./vagas-types";

const REGEX_DIACRITICOS = /[\u0300-\u036f]/g;

export function limparHtmlParaTexto(html: string) {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/h[1-6]>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<li[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&#(\d+);/g, (_, c) => String.fromCharCode(Number(c)))
    .replace(/&#x([0-9a-f]+);/gi, (_, c) => String.fromCharCode(parseInt(c, 16)))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\r/g, "")
    .replace(/\xa0/g, " ")
    .replace(/[ \t]+/g, " ")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .join("\n");
}

export function gerarSlug(texto: string) {
  return texto
    .normalize("NFD")
    .replace(REGEX_DIACRITICOS, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizar(texto: string) {
  return texto.normalize("NFD").replace(REGEX_DIACRITICOS, "").toLowerCase();
}

export function limparTexto(texto: string) {
  return texto.replace(/\s+/g, " ").replace(/\s+;/g, ";").replace(/\s+\./g, ".").trim();
}

export function escaparRegex(texto: string) {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function normalizarParaComparacao(texto: string) {
  return gerarSlug(texto);
}

export function inferirCategoria(titulo: string, contexto = "") {
  const texto = (titulo + " " + contexto).toLowerCase();
  const ctx = contexto.toLowerCase();

  if (/logíst|estoque|conferente|almoxarife|motorista|entregador|carga|descarga/.test(texto))
    return "Logística";
  if (/produção|producao|indústria|industria|operador|linha de produção/.test(texto))
    return "Produção";
  if (/vendedor|atendente|caixa|loja|comércio|comercio|balconista/.test(texto)) return "Comércio";
  if (/administrativo|assistente|escritório|escritorio|gerente|analista/.test(texto))
    return "Administrativo";
  if (/limpeza|serviços gerais|servicos gerais|conservação|conservacao/.test(texto))
    return "Serviços Gerais";
  if (/técnico|tecnico|mecânico|mecanico|eletricista|manutenção|manutencao/.test(texto))
    return "Técnico";
  if (ctx.includes("comércio")) return "Comércio";
  if (ctx.includes("indústria")) return "Indústria";
  if (ctx.includes("serviço")) return "Serviços";
  return "Outros";
}

export type OrgaoExtraido = {
  nomeCompleto: string;
  sigla: string | null;
};

export function extrairOrgaoDoTexto(texto: string): OrgaoExtraido | null {
  const comSigla = texto.match(
    /Secretaria\s+(?:Municipal\s+)?(?:d(?:e|as?|os?)\s+)?([A-ZÀ-Ú][^.;()\n]{2,80}?)\s*\(([A-ZÀ-Ú][a-zà-ú]{2,9})\)/,
  );
  if (comSigla)
    return {
      nomeCompleto: limparTexto(`Secretaria Municipal de ${comSigla[1]}`),
      sigla: comSigla[2],
    };

  const semSigla = texto.match(
    /Secretaria\s+(?:Municipal\s+)?(?:d(?:e|as?|os?)\s+)?([A-ZÀ-Ú][^.;()\n]{2,80}?)(?:[.,;]|\s+e\s|\n)/,
  );
  if (semSigla)
    return { nomeCompleto: limparTexto(`Secretaria Municipal de ${semSigla[1]}`), sigla: null };

  return null;
}

export function detectarPcdEmTexto(texto: string) {
  const t = texto.toLowerCase();
  return /pcd|pessoa com deficiência|pessoas com deficiência|deficiente/.test(t);
}

export function removerVagasDuplicadas(vagas: Vaga[]) {
  const mapa = new Map<string, Vaga>();
  for (const vaga of vagas) {
    const chave = [
      normalizarParaComparacao(vaga.titulo),
      vaga.quantidadeVagas,
      normalizarParaComparacao(vaga.escolaridade),
      normalizarParaComparacao(vaga.experiencia),
      normalizarParaComparacao(vaga.requisitos.join(" ")),
      vaga.dataExpiracao ?? "",
    ].join("|");
    if (!mapa.has(chave)) mapa.set(chave, vaga);
  }
  return Array.from(mapa.values());
}

export function ajustarSlugsDuplicados(vagas: Vaga[]) {
  const contador = new Map<string, number>();
  return vagas.map((vaga) => {
    const q = contador.get(vaga.slug) ?? 0;
    contador.set(vaga.slug, q + 1);
    return q === 0 ? vaga : { ...vaga, slug: `${vaga.slug}-${q + 1}` };
  });
}
