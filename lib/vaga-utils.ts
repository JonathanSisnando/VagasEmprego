import type { Vaga } from "../data/vagas";

const REGEX_DIACRITICOS = new RegExp(
  "[" + String.fromCharCode(0x0300) + "-" + String.fromCharCode(0x036f) + "]",
  "g"
);
const REGEX_NBSP = new RegExp(String.fromCharCode(0x00a0), "g");

export function limparHtmlParaTexto(html: string) {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/h[1-6]>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<li[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&#(\d+);/g, (_, codigo) => String.fromCharCode(Number(codigo)))
    .replace(/&#x([0-9a-f]+);/gi, (_, codigo) =>
      String.fromCharCode(parseInt(codigo, 16))
    )
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\r/g, "")
    .replace(REGEX_NBSP, " ")
    .replace(/[ \t]+/g, " ")
    .split("\n")
    .map((linha) => linha.trim())
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

export function limparTexto(texto: string) {
  return texto
    .replace(/\s+/g, " ")
    .replace(/\s+;/g, ";")
    .replace(/\s+\./g, ".")
    .trim();
}

export function escaparRegex(texto: string) {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function normalizarParaComparacao(texto: string) {
  return gerarSlug(texto);
}

export function inferirCategoria(titulo: string, contexto = "") {
  const texto = (titulo + " " + contexto).toLowerCase();
  const contextoLower = contexto.toLowerCase();

  if (
    texto.includes("logíst") ||
    texto.includes("estoque") ||
    texto.includes("conferente") ||
    texto.includes("almoxarife") ||
    texto.includes("motorista") ||
    texto.includes("entregador") ||
    texto.includes("carga") ||
    texto.includes("descarga")
  ) {
    return "Logística";
  }

  if (
    texto.includes("produção") ||
    texto.includes("producao") ||
    texto.includes("indústria") ||
    texto.includes("industria") ||
    texto.includes("operador") ||
    texto.includes("linha de produção")
  ) {
    return "Produção";
  }

  if (
    texto.includes("vendedor") ||
    texto.includes("atendente") ||
    texto.includes("caixa") ||
    texto.includes("loja") ||
    texto.includes("comércio") ||
    texto.includes("comercio") ||
    texto.includes("balconista")
  ) {
    return "Comércio";
  }

  if (
    texto.includes("administrativo") ||
    texto.includes("assistente") ||
    texto.includes("escritório") ||
    texto.includes("escritorio") ||
    texto.includes("gerente") ||
    texto.includes("analista")
  ) {
    return "Administrativo";
  }

  if (
    texto.includes("limpeza") ||
    texto.includes("serviços gerais") ||
    texto.includes("servicos gerais") ||
    texto.includes("conservação") ||
    texto.includes("conservacao")
  ) {
    return "Serviços Gerais";
  }

  if (
    texto.includes("técnico") ||
    texto.includes("tecnico") ||
    texto.includes("mecânico") ||
    texto.includes("mecanico") ||
    texto.includes("eletricista") ||
    texto.includes("manutenção") ||
    texto.includes("manutencao")
  ) {
    return "Técnico";
  }

  if (contextoLower.includes("comércio")) {
    return "Comércio";
  }

  if (contextoLower.includes("indústria")) {
    return "Indústria";
  }

  if (contextoLower.includes("serviço")) {
    return "Serviços";
  }

  return "Outros";
}

export type OrgaoExtraido = {
  nomeCompleto: string;
  sigla: string | null;
};

export function extrairOrgaoDoTexto(texto: string): OrgaoExtraido | null {
  const matchComSigla = texto.match(
    /Secretaria\s+(?:Municipal\s+)?(?:d(?:e|as?|os?)\s+)?([A-ZÀ-Ú][^.;()\n]{2,80}?)\s*\(([A-ZÀ-Ú][a-zà-ú]{2,9})\)/
  );

  if (matchComSigla) {
    return {
      nomeCompleto: limparTexto(`Secretaria Municipal de ${matchComSigla[1]}`),
      sigla: matchComSigla[2],
    };
  }

  const matchSemSigla = texto.match(
    /Secretaria\s+(?:Municipal\s+)?(?:d(?:e|as?|os?)\s+)?([A-ZÀ-Ú][^.;()\n]{2,80}?)(?:[.,;]|\s+e\s|\n)/
  );

  if (matchSemSigla) {
    return {
      nomeCompleto: limparTexto(`Secretaria Municipal de ${matchSemSigla[1]}`),
      sigla: null,
    };
  }

  return null;
}

export function detectarPcdEmTexto(texto: string) {
  const textoNormalizado = texto.toLowerCase();

  return (
    textoNormalizado.includes("pcd") ||
    textoNormalizado.includes("pessoa com deficiência") ||
    textoNormalizado.includes("pessoas com deficiência") ||
    textoNormalizado.includes("deficiente")
  );
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

    if (!mapa.has(chave)) {
      mapa.set(chave, vaga);
    }
  }

  return Array.from(mapa.values());
}

export function ajustarSlugsDuplicados(vagas: Vaga[]) {
  const contador = new Map<string, number>();

  return vagas.map((vaga) => {
    const quantidade = contador.get(vaga.slug) ?? 0;
    contador.set(vaga.slug, quantidade + 1);

    if (quantidade === 0) {
      return vaga;
    }

    return {
      ...vaga,
      slug: `${vaga.slug}-${quantidade + 1}`,
    };
  });
}
