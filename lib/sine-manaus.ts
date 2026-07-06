import type { Vaga } from "../data/vagas";

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

export function extrairVagasDoPost(post: WordpressPost): Vaga[] {
  const textoLimpo = limparHtmlParaTexto(post.content.rendered);
  const blocos = separarBlocosDeVagas(textoLimpo);

  const vagasExtraidas = blocos.map((bloco, index) => {
    const dados = extrairDadosDaVaga(bloco);

    return converterParaVagaFinal({
      dados,
      post,
      index,
    });
  });

  const vagasSemDuplicidade = removerDuplicadas(vagasExtraidas);

  return ajustarSlugsDuplicados(vagasSemDuplicidade);
}

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
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .split("\n")
    .map((linha) => linha.trim())
    .filter(Boolean)
    .join("\n");
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
}: {
  dados: DadosVagaExtraida;
  post: WordpressPost;
  index: number;
}): Vaga {
  const requisitos: string[] = [];

  if (dados.requisitosObrigatorios !== "Não informado") {
    requisitos.push(dados.requisitosObrigatorios);
  }

  if (dados.atividades !== "Não informado") {
    requisitos.push(`Atividades: ${dados.atividades}`);
  }

  return {
    id: `sine-${post.id}-${index + 1}`,
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
    comoSeCandidatar:
      "Os candidatos devem comparecer a um dos postos do Sine Manaus com documentos pessoais, currículo, comprovante de escolaridade e residência.",
    fonte: "Prefeitura de Manaus - Sine Manaus",
    linkFonte: post.link,
    dataPublicacao: post.date.slice(0, 10),
    status: "ativa",
    descricao: `Vaga de ${dados.titulo} divulgada pelo Sine Manaus.`,
    tipoContrato: "Não informado",
    modalidade: "Presencial",
    quantidadeVagas: dados.quantidadeVagas,
    dataExpiracao: dados.dataExpiracao,
    emailCandidatura: "",
    whatsappCandidatura: "",
    pcd: detectarPcd(dados),
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

function inferirCategoria(titulo: string, secao: string) {
  const texto = `${titulo} ${secao}`.toLowerCase();

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
    texto.includes("escritorio")
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

  if (secao.toLowerCase().includes("comércio")) {
    return "Comércio";
  }

  if (secao.toLowerCase().includes("indústria")) {
    return "Indústria";
  }

  if (secao.toLowerCase().includes("serviço")) {
    return "Serviços";
  }

  return "Outros";
}

function detectarPcd(dados: DadosVagaExtraida) {
  const texto = `
    ${dados.titulo}
    ${dados.secao}
    ${dados.requisitosObrigatorios}
    ${dados.atividades}
  `.toLowerCase();

  return (
    texto.includes("pcd") ||
    texto.includes("pessoa com deficiência") ||
    texto.includes("pessoas com deficiência") ||
    texto.includes("deficiente")
  );
}

function removerDuplicadas(vagas: Vaga[]) {
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

function ajustarSlugsDuplicados(vagas: Vaga[]) {
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

function gerarSlug(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function limparTexto(texto: string) {
  return texto
    .replace(/\s+/g, " ")
    .replace(/\s+;/g, ";")
    .replace(/\s+\./g, ".")
    .trim();
}

function normalizarParaComparacao(texto: string) {
  return gerarSlug(texto);
}

function escaparRegex(texto: string) {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}