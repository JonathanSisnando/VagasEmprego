import type { FonteResposta, Vaga } from "./vagas-types";
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

export type WordpressPost = {
  id: number;
  date: string;
  slug: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string };
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

async function buscarNoticiaSineMaisRecente(): Promise<WordpressPost | null> {
  // Tenta a API WordPress primeiro
  const url = new URL("https://www.manaus.am.gov.br/wp-json/wp/v2/posts");
  url.searchParams.set("search", "sine");
  url.searchParams.set("per_page", "20");
  url.searchParams.set("orderby", "date");
  url.searchParams.set("order", "desc");
  url.searchParams.set("_fields", "id,date,slug,link,title,content");

  console.log("[Sine] Buscando notícias em:", url.toString());

  try {
    const resposta = await fetch(url.toString(), {
      signal: AbortSignal.timeout(20000),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
        "Cache-Control": "no-cache",
      },
    });

    console.log("[Sine] Status da resposta:", resposta.status);

    if (!resposta.ok) {
      console.error("[Sine] Erro na resposta:", resposta.status);
      throw new Error(`Erro HTTP: ${resposta.status}`);
    }

    const textoResposta = await resposta.text();
    console.log("[Sine] Tamanho da resposta:", textoResposta.length, "bytes");

    let posts: WordpressPost[];
    try {
      posts = JSON.parse(textoResposta) as WordpressPost[];
    } catch (e) {
      console.error("[Sine] Resposta não é JSON:", textoResposta.substring(0, 200));
      throw new Error("Resposta não é JSON válido");
    }

    console.log("[Sine] Total de posts:", posts.length);

    const postSine = posts.find((post) => {
      const titulo = limparHtmlParaTexto(post.title.rendered).toLowerCase();
      const slug = post.slug.toLowerCase();
      const pareceSerSine = titulo.includes("sine") || slug.includes("sine");
      const pareceSerVaga =
        titulo.includes("vaga") ||
        titulo.includes("vagas") ||
        titulo.includes("emprego") ||
        slug.includes("vaga") ||
        slug.includes("vagas") ||
        slug.includes("emprego");
      const pareceSerManaus = titulo.includes("manaus") || slug.includes("manaus");
      return pareceSerSine && pareceSerVaga && pareceSerManaus;
    });

    console.log("[Sine] Post encontrado:", postSine ? postSine.title.rendered : "NENHUM");
    return postSine ?? null;
  } catch (error) {
    console.error("[Sine] Erro ao buscar notícias:", error);
    // Fallback: tenta buscar a página HTML do Sine
    return await buscarPaginaHtmlSine();
  }
}

async function buscarPaginaHtmlSine(): Promise<WordpressPost | null> {
  console.log("[Sine] Tentando fallback via página HTML...");
  try {
    const resposta = await fetch("https://www.manaus.am.gov.br/noticia/oportunidade/", {
      signal: AbortSignal.timeout(20000),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "pt-BR,pt;q=0.9",
      },
    });

    if (!resposta.ok) return null;

    const html = await resposta.text();

    // Extrai o link da notícia mais recente do Sine
    const matchLink = html.match(
      /href="(\/noticia\/[^"]*sine[^"]*vagas[^"]*)"/i,
    );
    if (!matchLink) return null;

    const linkNoticia = `https://www.manaus.am.gov.br${matchLink[1]}`;
    console.log("[Sine] Link encontrado:", linkNoticia);

    // Busca o conteúdo da notícia
    const resNoticia = await fetch(linkNoticia, {
      signal: AbortSignal.timeout(15000),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!resNoticia.ok) return null;

    const htmlNoticia = await resNoticia.text();

    // Extrai título
    const matchTitulo = htmlNoticia.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    const titulo = matchTitulo ? matchTitulo[1] : "Vagas Sine Manaus";

    // Extrai conteúdo principal
    const matchConteudo = htmlNoticia.match(
      /<div[^>]*class="[^"]*conteudo[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    ) || htmlNoticia.match(/<article[^>]*>([\s\S]*?)<\/article>/i);

    const conteudo = matchConteudo ? matchConteudo[1] : "";

    // Extrai data de publicação
    const matchData = htmlNoticia.match(
      /(\d{1,2})\s+de\s+(\w+)\s+de\s+(\d{4})/i,
    );
    let dataStr = new Date().toISOString().slice(0, 10);
    if (matchData) {
      const meses: Record<string, string> = {
        janeiro: "01", fevereiro: "02", março: "03", abril: "04",
        maio: "05", junho: "06", julho: "07", agosto: "08",
        setembro: "09", outubro: "10", novembro: "11", dezembro: "12",
      };
      const dia = matchData[1].padStart(2, "0");
      const mes = meses[matchData[2].toLowerCase()] || "01";
      const ano = matchData[3];
      dataStr = `${ano}-${mes}-${dia}`;
    }

    const slug = linkNoticia.split("/").filter(Boolean).pop() || "sine-vagas";

    return {
      id: Date.now(),
      date: dataStr,
      slug,
      link: linkNoticia,
      title: { rendered: titulo },
      content: { rendered: conteudo },
    };
  } catch (error) {
    console.error("[Sine] Erro no fallback HTML:", error);
    return null;
  }
}

type ContextoFonte = {
  idPrefixo: string;
  fonte: string;
  comoSeCandidatar: string;
  descricaoOrigem: string;
};

function determinarContextoFonte(textoLimpo: string, post: WordpressPost): ContextoFonte {
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
      comoSeCandidatar: `Consulte a notícia oficial para saber como se candidatar a esta vaga divulgada pela ${nomeComSigla}.`,
      descricaoOrigem: `pela ${nomeComSigla}`,
    };
  }

  return {
    idPrefixo: "noticia",
    fonte: "Prefeitura de Manaus",
    comoSeCandidatar:
      "Consulte a notícia oficial da Prefeitura de Manaus para saber como se candidatar.",
    descricaoOrigem: "pela Prefeitura de Manaus",
  };
}

function extrairVagasDoPost(post: WordpressPost): Vaga[] {
  const textoLimpo = limparHtmlParaTexto(post.content.rendered);
  const blocos = separarBlocosDeVagas(textoLimpo);
  const contextoFonte = determinarContextoFonte(textoLimpo, post);

  const vagasExtraidas = blocos.map((bloco, index) => {
    const dados = extrairDadosDaVaga(bloco);
    return converterParaVagaFinal({ dados, post, index, contextoFonte });
  });

  const vagasSemDuplicidade = removerVagasDuplicadas(vagasExtraidas);
  return ajustarSlugsDuplicados(vagasSemDuplicidade);
}

function separarBlocosDeVagas(texto: string): BlocoVaga[] {
  const linhas = texto
    .split("\n")
    .map((l) => l.trim())
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
      if (blocoAtual) blocos.push(blocoAtual);
      blocoAtual = { secao: secaoAtual, cabecalho: linha, linhas: [] };
      continue;
    }
    if (blocoAtual) blocoAtual.linhas.push(linha);
  }
  if (blocoAtual) blocos.push(blocoAtual);
  return blocos;
}

function extrairDadosDaVaga(bloco: BlocoVaga): DadosVagaExtraida {
  const matchCabecalho = bloco.cabecalho.match(/^(\d+)\s+vaga(?:s)?\s*[-–—]\s*(.+)$/i);
  const quantidadeVagas = matchCabecalho ? Number(matchCabecalho[1]) : 1;
  const titulo = matchCabecalho ? limparTexto(matchCabecalho[2]) : limparTexto(bloco.cabecalho);
  const escolaridade = extrairValorPorRotulo(bloco.linhas, ["Escolaridade"]) ?? "Não informado";
  const experiencia =
    extrairValorPorRotulo(bloco.linhas, ["Experiência", "Experiencia"]) ?? "Não informado";
  const requisitosObrigatorios =
    extrairValorPorRotulo(bloco.linhas, [
      "Requisitos Obrigatórios",
      "Requisitos Obrigatorios",
      "Requisitos",
    ]) ?? "Não informado";
  const atividades =
    extrairValorPorRotulo(bloco.linhas, ["Atividades", "Atividade"]) ?? "Não informado";
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
  if (dados.requisitosObrigatorios !== "Não informado")
    requisitos.push(dados.requisitosObrigatorios);
  if (dados.atividades !== "Não informado") requisitos.push(`Atividades: ${dados.atividades}`);

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
    empresa: "Não informado",
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
    status: "aberta",
    descricao: `Vaga de ${dados.titulo} divulgada ${contextoFonte.descricaoOrigem}.`,
    tipoContrato: "Não informado",
    modalidade: "Presencial",
    quantidadeVagas: dados.quantidadeVagas,
    dataExpiracao: dados.dataExpiracao,
    pcd: detectarPcdEmTexto(textoParaPcd),
  };
}

function extrairValorPorRotulo(linhas: string[], rotulos: string[]) {
  const regex = new RegExp(`^(${rotulos.map(escaparRegex).join("|")})\\s*[-–—:]?\\s*(.+)$`, "i");
  for (const linha of linhas) {
    const match = linha.match(regex);
    if (match?.[2]) return limparTexto(match[2]);
  }
  return null;
}

function extrairDataExpiracao(linhas: string[]) {
  const match = linhas.join(" ").match(/Disponível\s+até\s+(\d{1,2})\/(\d{1,2})\/(\d{4})/i);
  if (!match) return undefined;
  return `${match[3]}-${match[2].padStart(2, "0")}-${match[1].padStart(2, "0")}`;
}

function extrairTotalVagasDoTitulo(titulo: string): number | null {
  const match = titulo.match(/(\d[\d.]*)\s+vagas?/i);
  if (!match) return null;
  return Number(match[1].replace(/\./g, ""));
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

export async function getVagasSine(): Promise<FonteResposta> {
  try {
    console.log("[Sine] Iniciando busca de vagas...");
    const post = await buscarNoticiaSineMaisRecente();

    if (!post) {
      console.log("[Sine] Nenhum post encontrado");
      return {
        vagas: [],
        resumo: {
          fonte: "Prefeitura de Manaus - Sine Manaus",
          totalCargos: 0,
          totalVagas: 0,
          linkOficial: "https://www.manaus.am.gov.br/",
          atualizadoEm: new Date().toISOString(),
        },
      };
    }

    console.log("[Sine] Post encontrado:", post.title.rendered);
    const vagas = extrairVagasDoPost(post);
    console.log("[Sine] Vagas extraídas:", vagas.length);
    const tituloPost = limparHtmlParaTexto(post.title.rendered);
    const totalOficialTitulo = extrairTotalVagasDoTitulo(tituloPost);
    console.log("[Sine] Total oficial do título:", totalOficialTitulo);

    return {
      vagas,
      resumo: {
        fonte: "Prefeitura de Manaus - Sine Manaus",
        totalCargos: vagas.length,
        totalVagas: totalOficialTitulo ?? vagas.reduce((acc, v) => acc + (v.quantidadeVagas ?? 1), 0),
        linkOficial: post.link,
        atualizadoEm: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error("[Sine] Erro em getVagasSine:", error);
    throw error;
  }
}
