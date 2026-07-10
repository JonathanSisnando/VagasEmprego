import type { Vaga } from "../data/vagas";
import {
  ajustarSlugsDuplicados,
  detectarPcdEmTexto,
  escaparRegex,
  extrairOrgaoDoTexto,
  gerarSlug,
  inferirCategoria,
  limparHtmlParaTexto,
  limparTexto,
  removerVagasDuplicadas,
} from "./vaga-utils";

export { limparHtmlParaTexto };

export type WordpressPost = {
  id: number;
  date: string;
  slug: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
};

type BlocoVaga = {
  secao: string;
  cabecalho: string;
  linhas: string[];
};

type DadosVagaExtraida = {
  secao: string;
  quantidadeVagas: number;
  titulo: string;
  escolaridade: string;
  experiencia: string;
  requisitosObrigatorios: string;
  atividades: string;
  dataExpiracao?: string;
  categoria: string;
};

export async function buscarNoticiaSine(slug: string): Promise<WordpressPost | null> {

  const url = new URL("https://www.manaus.am.gov.br/wp-json/wp/v2/posts");

  url.searchParams.set("slug", slug);
  url.searchParams.set("_fields", "id,date,slug,link,title,content");

  const resposta = await fetch(url.toString(), {
    next: {
      revalidate: 60 * 60,
    },
    signal: AbortSignal.timeout(8000),
  });

  if (!resposta.ok) {
    throw new Error("Erro ao buscar notícia da Prefeitura de Manaus");
  }

  const posts = (await resposta.json()) as WordpressPost[];

  return posts[0] ?? null;
}
export async function buscarNoticiaSineMaisRecente(): Promise<WordpressPost | null> {
  const url = new URL("https://www.manaus.am.gov.br/wp-json/wp/v2/posts");

  url.searchParams.set("search", "sine");
  url.searchParams.set("per_page", "20");
  url.searchParams.set("orderby", "date");
  url.searchParams.set("order", "desc");
  url.searchParams.set("_fields", "id,date,slug,link,title,content");

  const resposta = await fetch(url.toString(), {
    next: {
      revalidate: 60 * 60,
    },
    signal: AbortSignal.timeout(8000),
  });

  if (!resposta.ok) {
    throw new Error("Erro ao buscar notícia mais recente do Sine Manaus");
  }

  const posts = (await resposta.json()) as WordpressPost[];

  const postSine = posts.find((post) => {
    const titulo = limparHtmlParaTexto(post.title.rendered).toLowerCase();
    const slug = post.slug.toLowerCase();

    const pareceSerSine =
      titulo.includes("sine") || slug.includes("sine");

    const pareceSerVaga =
      titulo.includes("vaga") ||
      titulo.includes("vagas") ||
      titulo.includes("emprego") ||
      slug.includes("vaga") ||
      slug.includes("vagas") ||
      slug.includes("emprego");

    const pareceSerManaus =
      titulo.includes("manaus") || slug.includes("manaus");

    return pareceSerSine && pareceSerVaga && pareceSerManaus;
  });

  return postSine ?? null;
}

type ContextoFonte = {
  idPrefixo: string;
  fonte: string;
  comoSeCandidatar: string;
  descricaoOrigem: string;
};

/**
 * O parser foi criado pro boletim diário "Sine Manaus oferta X vagas", mas o
 * mesmo padrão de blocos ("N vaga(s) - Cargo" + Escolaridade/Experiência/
 * Requisitos/Atividades) pode aparecer em notícias de PSS de outras
 * secretarias. Essa função identifica o órgão responsável a partir do texto
 * da notícia, sem depender de uma lista fixa de secretarias.
 */
function determinarContextoFonte(
  textoLimpo: string,
  post: WordpressPost
): ContextoFonte {
  const tituloLimpo = limparHtmlParaTexto(post.title.rendered).toLowerCase();
  const pareceSerSine =
    tituloLimpo.includes("sine") || textoLimpo.toLowerCase().includes("sine manaus");

  if (pareceSerSine) {
    return {
      idPrefixo: "sine",
      fonte: "Prefeitura de Manaus - Sine Manaus",
      comoSeCandidatar:
        "Os candidatos devem comparecer a um dos postos do Sine Manaus com documentos pessoais, currículo, comprovante de escolaridade e residência.",
      descricaoOrigem: "pelo Sine Manaus",
    };
  }

  const orgao = extrairOrgaoDoTexto(textoLimpo);

  if (orgao) {
    const nomeComSigla = orgao.sigla
      ? `${orgao.nomeCompleto} (${orgao.sigla})`
      : orgao.nomeCompleto;

    return {
      idPrefixo: "noticia",
      fonte: `Prefeitura de Manaus - ${nomeComSigla}`,
      comoSeCandidatar: `Consulte a notícia oficial da Prefeitura de Manaus para saber como se candidatar a esta vaga divulgada pela ${nomeComSigla}.`,
      descricaoOrigem: `pela ${nomeComSigla}`,
    };
  }

  return {
    idPrefixo: "noticia",
    fonte: "Prefeitura de Manaus",
    comoSeCandidatar:
      "Consulte a notícia oficial da Prefeitura de Manaus para saber como se candidatar a esta vaga.",
    descricaoOrigem: "pela Prefeitura de Manaus",
  };
}

export function extrairVagasDoPost(post: WordpressPost): Vaga[] {
  const textoLimpo = limparHtmlParaTexto(post.content.rendered);
  const blocos = separarBlocosDeVagas(textoLimpo);
  const contextoFonte = determinarContextoFonte(textoLimpo, post);

  const vagasExtraidas = blocos.map((bloco, index) => {
    const dados = extrairDadosDaVaga(bloco);

    return converterParaVagaFinal({
      dados,
      post,
      index,
      contextoFonte,
    });
  });

  const vagasSemDuplicidade = removerVagasDuplicadas(vagasExtraidas);

  return ajustarSlugsDuplicados(vagasSemDuplicidade);
}

function separarBlocosDeVagas(texto: string): BlocoVaga[] {
  const linhas = texto
    .split("\n")
    .map((linha) => linha.trim())
    .filter(Boolean);

  const blocos: BlocoVaga[] = [];

  let secaoAtual = "Vagas";
  let blocoAtual: BlocoVaga | null = null;

  for (const linha of linhas) {
    if (ehSecaoDeVagas(linha)) {
      secaoAtual = limparNomeDaSecao(linha);
      continue;
    }

    if (ehInicioDeVaga(linha)) {
      if (blocoAtual) {
        blocos.push(blocoAtual);
      }

      blocoAtual = {
        secao: secaoAtual,
        cabecalho: linha,
        linhas: [],
      };

      continue;
    }

    if (blocoAtual) {
      blocoAtual.linhas.push(linha);
    }
  }

  if (blocoAtual) {
    blocos.push(blocoAtual);
  }

  return blocos;
}

function extrairDadosDaVaga(bloco: BlocoVaga): DadosVagaExtraida {
  const matchCabecalho = bloco.cabecalho.match(
    /^(\d+)\s+vaga(?:s)?\s*[-–—]\s*(.+)$/i
  );

  const quantidadeVagas = matchCabecalho ? Number(matchCabecalho[1]) : 0;

  const titulo = matchCabecalho
    ? limparTexto(matchCabecalho[2])
    : limparTexto(bloco.cabecalho);

  const escolaridade =
    extrairValorPorRotulo(bloco.linhas, ["Escolaridade"]) ?? "Não informado";

  const experiencia =
    extrairValorPorRotulo(bloco.linhas, ["Experiência", "Experiencia"]) ??
    "Não informado";

  const requisitosObrigatorios =
    extrairValorPorRotulo(bloco.linhas, [
      "Requisitos Obrigatórios",
      "Requisitos Obrigatorios",
      "Requisitos",
    ]) ?? "Não informado";

  const atividades =
    extrairValorPorRotulo(bloco.linhas, ["Atividades", "Atividade"]) ??
    "Não informado";

  const dataExpiracao = extrairDataExpiracao(bloco.linhas);

  const categoria = inferirCategoria(titulo, bloco.secao);

  return {
    secao: bloco.secao,
    quantidadeVagas,
    titulo,
    escolaridade,
    experiencia,
    requisitosObrigatorios,
    atividades,
    dataExpiracao,
    categoria,
  };
}

function converterParaVagaFinal({
  dados,
  post,
  index,
  contextoFonte,
}: {
  dados: DadosVagaExtraida;
  post: WordpressPost;
  index: number;
  contextoFonte: ContextoFonte;
}): Vaga {
  const requisitos: string[] = [];

  if (dados.requisitosObrigatorios !== "Não informado") {
    requisitos.push(dados.requisitosObrigatorios);
  }

  if (dados.atividades !== "Não informado") {
    requisitos.push(`Atividades: ${dados.atividades}`);
  }

  const textoParaPcd = [
    dados.titulo,
    dados.secao,
    dados.requisitosObrigatorios,
    dados.atividades,
  ].join(" ");

  return {
    id: `${contextoFonte.idPrefixo}-${post.id}-${index + 1}`,
    slug: gerarSlug(`${dados.titulo}-manaus`),
    titulo: dados.titulo,
    empresa: "Empresa não informada",
    cidade: "Manaus",
    estado: "AM",
    bairro: "Não informado",
    categoria: dados.categoria,
    escolaridade: dados.escolaridade,
    experiencia: dados.experiencia,
    salario: "Não informado",
    requisitos: requisitos.length > 0 ? requisitos : ["Não informado"],
    beneficios: ["Não informado"],
    comoSeCandidatar: contextoFonte.comoSeCandidatar,
    fonte: contextoFonte.fonte,
    linkFonte: post.link,
    dataPublicacao: post.date.slice(0, 10),
    status: "ativa",
    descricao: `Vaga de ${dados.titulo} divulgada ${contextoFonte.descricaoOrigem}.`,
    tipoContrato: "Não informado",
    modalidade: "Presencial",
    quantidadeVagas: dados.quantidadeVagas,
    dataExpiracao: dados.dataExpiracao,
    emailCandidatura: "",
    whatsappCandidatura: "",
    pcd: detectarPcdEmTexto(textoParaPcd),
  };
}

function extrairValorPorRotulo(linhas: string[], rotulos: string[]) {
  const rotulosRegex = rotulos.map(escaparRegex).join("|");
  const regex = new RegExp(`^(${rotulosRegex})\\s*[-–—:]?\\s*(.+)$`, "i");

  for (const linha of linhas) {
    const match = linha.match(regex);

    if (match?.[2]) {
      return limparTexto(match[2]);
    }
  }

  return null;
}

function extrairDataExpiracao(linhas: string[]) {
  const texto = linhas.join(" ");

  const match = texto.match(
    /Disponível\s+até\s+(\d{1,2})\/(\d{1,2})\/(\d{4})/i
  );

  if (!match) {
    return undefined;
  }

  const dia = match[1].padStart(2, "0");
  const mes = match[2].padStart(2, "0");
  const ano = match[3];

  return `${ano}-${mes}-${dia}`;
}

function ehInicioDeVaga(linha: string) {
  return /^\d+\s+vaga(?:s)?\s*[-–—]\s*.+$/i.test(linha);
}

function ehSecaoDeVagas(linha: string) {
  return /^VAGAS\b.+[-–—]\s*\d+/i.test(linha);
}

function limparNomeDaSecao(linha: string) {
  return limparTexto(linha.replace(/\s*[-–—]\s*\d+.*$/, ""));
}
