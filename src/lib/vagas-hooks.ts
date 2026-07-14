import { useQuery } from "@tanstack/react-query";

import type { FonteResposta, Vaga } from "./vagas-types";

const WORDPRESS_API = "https://www.manaus.am.gov.br/wp-json/wp/v2/posts";
const SETEMP_API = "https://www.portaldotrabalhador.am.gov.br";
const PROXY_API = "/api/proxy?url=";

// ==================== UTILS ====================

function limparHtmlParaTexto(html: string) {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/h[1-6]>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<li[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&#(\d+);/g, (_, c: string) => String.fromCharCode(Number(c)))
    .replace(/&#x([0-9a-f]+);/gi, (_, c: string) => String.fromCharCode(parseInt(c, 16)))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/\r/g, "")
    .replace(/\xa0/g, " ")
    .replace(/[ \t]+/g, " ")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .join("\n");
}

function limparTexto(texto: string) {
  return texto.replace(/\s+/g, " ").replace(/\s+;/g, ";").replace(/\s+\./g, ".").trim();
}

function escaparRegex(texto: string) {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const REGEX_DIACRITICOS = /[\u0300-\u036f]/g;

function gerarSlug(texto: string) {
  return texto
    .normalize("NFD")
    .replace(REGEX_DIACRITICOS, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizarParaComparacao(texto: string) {
  return gerarSlug(texto);
}

function inferirCategoria(titulo: string, contexto = "") {
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

function detectarPcdEmTexto(texto: string) {
  const t = texto.toLowerCase();
  return /pcd|pessoa com deficiência|pessoas com deficiência|deficiente/.test(t);
}

function removerVagasDuplicadas(vagas: Vaga[]) {
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

function ajustarSlugsDuplicados(vagas: Vaga[]) {
  const contador = new Map<string, number>();
  return vagas.map((vaga) => {
    const q = contador.get(vaga.slug) ?? 0;
    contador.set(vaga.slug, q + 1);
    return q === 0 ? vaga : { ...vaga, slug: `${vaga.slug}-${q + 1}` };
  });
}

function extrairOrgaoDoTexto(texto: string) {
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

// ==================== SINE ====================

type WordpressPost = {
  id: number;
  date: string;
  slug: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string };
};

type BlocoVaga = { secao: string; cabecalho: string; linhas: string[] };

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

type ContextoFonte = {
  idPrefixo: string;
  fonte: string;
  comoSeCandidatar: string;
  descricaoOrigem: string;
};

async function buscarNoticiaSineMaisRecente(): Promise<WordpressPost | null> {
  const url = new URL(WORDPRESS_API);
  url.searchParams.set("search", "sine");
  url.searchParams.set("per_page", "20");
  url.searchParams.set("orderby", "date");
  url.searchParams.set("order", "desc");
  url.searchParams.set("_fields", "id,date,slug,link,title,content");

  const resposta = await fetch(url.toString(), { signal: AbortSignal.timeout(10000) });
  if (!resposta.ok) throw new Error("Erro ao buscar notícias do Sine Manaus");

  const posts = (await resposta.json()) as WordpressPost[];

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

  return postSine ?? null;
}

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

function ehInicioDeVaga(linha: string) {
  return /^\d+\s+vaga(?:s)?\s*[-–—]\s*.+$/i.test(linha);
}

function ehSecaoDeVagas(linha: string) {
  return /^VAGAS\b.+[-–—]\s*\d+/i.test(linha);
}

function limparNomeDaSecao(linha: string) {
  return limparTexto(linha.replace(/\s*[-–—]\s*\d+.*$/, ""));
}

function separarBlocosDeVagas(texto: string): BlocoVaga[] {
  const linhas = texto.split("\n").map((l) => l.trim()).filter(Boolean);
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

  return { secao: bloco.secao, quantidadeVagas, titulo, escolaridade, experiencia, requisitosObrigatorios, atividades, dataExpiracao, categoria };
}

function converterParaVagaFinal({ dados, post, index, contextoFonte }: {
  dados: DadosVagaExtraida;
  post: WordpressPost;
  index: number;
  contextoFonte: ContextoFonte;
}): Vaga {
  const requisitos: string[] = [];
  if (dados.requisitosObrigatorios !== "Não informado") requisitos.push(dados.requisitosObrigatorios);
  if (dados.atividades !== "Não informado") requisitos.push(`Atividades: ${dados.atividades}`);
  const textoParaPcd = [dados.titulo, dados.secao, dados.requisitosObrigatorios, dados.atividades].join(" ");

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

async function fetchSine(): Promise<FonteResposta> {
  const post = await buscarNoticiaSineMaisRecente();

  if (!post) {
    return {
      vagas: [],
      resumo: { fonte: "Prefeitura de Manaus - Sine Manaus", totalCargos: 0, totalVagas: 0, linkOficial: "https://www.manaus.am.gov.br/", atualizadoEm: new Date().toISOString() },
    };
  }

  const textoLimpo = limparHtmlParaTexto(post.content.rendered);
  const blocos = separarBlocosDeVagas(textoLimpo);
  const contextoFonte = determinarContextoFonte(textoLimpo, post);

  const vagasExtraidas = blocos.map((bloco, index) => {
    const dados = extrairDadosDaVaga(bloco);
    return converterParaVagaFinal({ dados, post, index, contextoFonte });
  });

  const vagasSemDuplicidade = removerVagasDuplicadas(vagasExtraidas);
  const vagas = ajustarSlugsDuplicados(vagasSemDuplicidade);

  const tituloPost = limparHtmlParaTexto(post.title.rendered);
  const totalOficialTitulo = extrairTotalVagasDoTitulo(tituloPost);

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
}

// ==================== SETEMP ====================

type VagaSetempResumo = { slugOdoo: string; id: string; tituloOriginal: string; quantidadeVagas: number };

async function buscarListaDeVagasSetemp(): Promise<VagaSetempResumo[]> {
  const resposta = await fetch(`${PROXY_API}${encodeURIComponent(`${SETEMP_API}/jobs`)}`, {
    signal: AbortSignal.timeout(10000),
  });
  if (!resposta.ok) throw new Error("Erro ao buscar lista de vagas do SETEMP");

  const html = await resposta.text();
  const regexItem = /<h3>\s*<a href="\/jobs\/detail\/([a-z0-9-]+)">\s*<span>([^<]+)<\/span>\s*<\/a>([\s\S]*?)<\/h3>/gi;
  const resultado: VagaSetempResumo[] = [];
  let match: RegExpExecArray | null;

  while ((match = regexItem.exec(html))) {
    const slugOdoo = match[1];
    const idMatch = slugOdoo.match(/-(\d+)$/);
    const matchQuantidade = match[3].match(/(\d+)\s+Vagas?\s+Abertas/i);
    resultado.push({
      slugOdoo,
      id: idMatch ? idMatch[1] : slugOdoo,
      tituloOriginal: limparTexto(match[2]),
      quantidadeVagas: matchQuantidade ? Number(matchQuantidade[1]) : 1,
    });
  }

  return resultado;
}

const OUTROS_MUNICIPIOS_AM = [
  "Alvarães", "Amaturá", "Anamã", "Anori", "Apuí", "Atalaia do Norte", "Autazes",
  "Barcelos", "Barreirinha", "Benjamin Constant", "Beruri", "Boa Vista do Ramos",
  "Boca do Acre", "Borba", "Caapiranga", "Canutama", "Carauari", "Careiro",
  "Careiro da Várzea", "Coari", "Codajás", "Eirunepé", "Envira", "Fonte Boa",
  "Guajará", "Humaitá", "Ipixuna", "Iranduba", "Itacoatiara", "Itamarati",
  "Itapiranga", "Japurá", "Juruá", "Jutaí", "Lábrea", "Manacapuru", "Manaquiri",
  "Manicoré", "Maraã", "Maués", "Nhamundá", "Nova Olinda do Norte", "Novo Airão",
  "Novo Aripuanã", "Parintins", "Pauini", "Presidente Figueiredo", "Rio Preto da Eva",
  "Santa Isabel do Rio Negro", "Santo Antônio do Içá", "São Gabriel da Cachoeira",
  "São Paulo de Olivença", "São Sebastião do Uatumã", "Silves", "Tabatinga",
  "Tapauá", "Tefé", "Tonantins", "Uarini", "Urucará", "Urucurituba",
];

function inferirMunicipio(tituloOriginal: string, residirEm: string | null) {
  if (residirEm) {
    const encontrado = OUTROS_MUNICIPIOS_AM.find((m) => gerarSlug(m) === gerarSlug(residirEm));
    if (encontrado) return { municipio: encontrado, tituloSemSufixo: tituloOriginal };
  }
  const matchSufixo = tituloOriginal.match(/^(.*?)\s*(?:[-–—]\s*|\()([A-ZÀ-Úa-zà-ú\s]+?)\)?\s*$/);
  if (matchSufixo) {
    const candidato = matchSufixo[2].trim();
    const encontrado = OUTROS_MUNICIPIOS_AM.find((m) => gerarSlug(m) === gerarSlug(candidato));
    if (encontrado) return { municipio: encontrado, tituloSemSufixo: limparTexto(matchSufixo[1]) };
  }
  return { municipio: "Manaus", tituloSemSufixo: tituloOriginal };
}

const CONECTIVOS_MINUSCULOS = new Set(["de", "da", "do", "das", "dos", "e", "em", "a", "o", "para", "com", "no", "na", "nos", "nas"]);

function tituloCase(texto: string) {
  return texto
    .toLowerCase()
    .split(" ")
    .map((palavra, indice) => {
      if (palavra.length === 0) return palavra;
      if (indice > 0 && CONECTIVOS_MINUSCULOS.has(palavra)) return palavra;
      return palavra[0].toUpperCase() + palavra.slice(1);
    })
    .join(" ");
}

async function buscarDetalheDeVagaSetemp(slugOdoo: string) {
  const resposta = await fetch(`${PROXY_API}${encodeURIComponent(`${SETEMP_API}/jobs/detail/${slugOdoo}`)}`, {
    signal: AbortSignal.timeout(10000),
  });
  if (!resposta.ok) return null;
  const html = await resposta.text();

  const matchTitulo = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  const titulo = matchTitulo ? limparTexto(limparHtmlParaTexto(matchTitulo[1])) : "";
  const inicioSecao = html.indexOf('<section class="mb32">');
  if (inicioSecao === -1 || !titulo) return null;
  const fimSecao = html.indexOf("</section>", inicioSecao);
  const trechoHtml = fimSecao === -1 ? html.slice(inicioSecao) : html.slice(inicioSecao, fimSecao);
  const linhas = limparHtmlParaTexto(trechoHtml).split("\n").map((l) => limparTexto(l)).filter(Boolean);

  let escolaridade = "Não informado";
  let salario = "Não informado";
  const beneficios: string[] = [];
  let experiencia = "Não informado";
  const atividadesLinhas: string[] = [];
  const requisitosAdicionais: string[] = [];
  let residirEm: string | null = null;

  for (const linha of linhas) {
    const mEsc = linha.match(/^Escolaridade\s*:?\s*(.+)$/i);
    if (mEsc) { escolaridade = limparTexto(mEsc[1]); continue; }
    const mSal = linha.match(/^Sal[aá]rio\s*:?\s*(.+)$/i);
    if (mSal) { salario = limparTexto(mSal[1]); continue; }
    const mBen = linha.match(/^Benef[ií]cios?\s*:?\s*(.+)$/i);
    if (mBen) { beneficios.push(limparTexto(mBen[1])); continue; }
    if (/inscri[cç][oõ]es?\s+pelo\s+portal/i.test(linha)) continue;
    const mRes = linha.match(/^Residir\s+em\s+(.+?)\.?$/i);
    if (mRes) { residirEm = limparTexto(mRes[1]); requisitosAdicionais.push(linha); continue; }
    if (/experi[eê]ncia/i.test(linha)) { experiencia = linha; continue; }
    if (linha.split(/\s+/).filter(Boolean).length <= 8) {
      requisitosAdicionais.push(linha);
    } else {
      atividadesLinhas.push(linha);
    }
  }

  return { titulo, escolaridade, experiencia, atividades: atividadesLinhas.join(" "), requisitosAdicionais, salario, beneficios, residirEm };
}

async function fetchSetemp(): Promise<FonteResposta> {
  const lista = await buscarListaDeVagasSetemp();
  const vagas: Vaga[] = [];

  for (let i = 0; i < lista.length; i += 6) {
    const lote = lista.slice(i, i + 6);
    const resultadosLote = await Promise.all(
      lote.map(async (resumo) => {
        try {
          const conteudo = await buscarDetalheDeVagaSetemp(resumo.slugOdoo);
          return { resumo, conteudo };
        } catch {
          return { resumo, conteudo: null };
        }
      }),
    );

    for (const { resumo, conteudo } of resultadosLote) {
      if (!conteudo) continue;
      const { municipio, tituloSemSufixo } = inferirMunicipio(resumo.tituloOriginal, conteudo.residirEm);
      if (gerarSlug(municipio) !== gerarSlug("Manaus")) continue;

      const titulo = tituloCase(tituloSemSufixo || conteudo.titulo);
      const requisitos = conteudo.requisitosAdicionais.length > 0 ? conteudo.requisitosAdicionais : ["Não informado"];
      const textoParaPcd = [titulo, conteudo.requisitosAdicionais.join(" "), conteudo.atividades].join(" ");

      vagas.push({
        id: `setemp-${resumo.id}`,
        slug: gerarSlug(`${titulo}-manaus`),
        titulo,
        empresa: "Não informado",
        cidade: "Manaus",
        estado: "AM",
        bairro: "Não informado",
        categoria: inferirCategoria(titulo),
        escolaridade: conteudo.escolaridade,
        experiencia: conteudo.experiencia,
        salario: conteudo.salario,
        requisitos,
        beneficios: conteudo.beneficios.length > 0 ? conteudo.beneficios : ["Não informado"],
        comoSeCandidatar: "Candidate-se diretamente pela página da vaga no Portal do Trabalhador (SETEMP).",
        fonte: "SETEMP - Portal do Trabalhador do Amazonas",
        linkFonte: `${SETEMP_API}/jobs/detail/${resumo.slugOdoo}`,
        dataPublicacao: new Date().toISOString().slice(0, 10),
        status: "aberta",
        descricao: conteudo.atividades
          ? `Vaga de ${titulo} divulgada pelo Portal do Trabalhador (SETEMP). ${conteudo.atividades}`
          : `Vaga de ${titulo} divulgada pelo Portal do Trabalhador (SETEMP).`,
        tipoContrato: "Não informado",
        modalidade: "Presencial",
        quantidadeVagas: resumo.quantidadeVagas,
        pcd: detectarPcdEmTexto(textoParaPcd),
      });
    }
  }

  const vagasSemDuplicidade = removerVagasDuplicadas(vagas);
  const vagasFinais = ajustarSlugsDuplicados(vagasSemDuplicidade);

  return {
    vagas: vagasFinais,
    resumo: {
      fonte: "SETEMP - Portal do Trabalhador do Amazonas",
      totalCargos: vagasFinais.length,
      totalVagas: vagasFinais.reduce((acc, v) => acc + (v.quantidadeVagas ?? 1), 0),
      linkOficial: `${SETEMP_API}/jobs`,
      atualizadoEm: new Date().toISOString(),
    },
  };
}

// ==================== HOOKS ====================

export function useVagasSine() {
  return useQuery<FonteResposta>({
    queryKey: ["vagas", "sine"],
    queryFn: fetchSine,
    staleTime: 5 * 60 * 1000,
  });
}

export function useVagasSetemp() {
  return useQuery<FonteResposta>({
    queryKey: ["vagas", "setemp"],
    queryFn: fetchSetemp,
    staleTime: 5 * 60 * 1000,
  });
}

export function useVagasUnificadas() {
  const sine = useVagasSine();
  const setemp = useVagasSetemp();

  const vagas: Vaga[] = [...(sine.data?.vagas ?? []), ...(setemp.data?.vagas ?? [])];

  return {
    vagas,
    sine,
    setemp,
    isLoading: sine.isLoading || setemp.isLoading,
    algumaFalhou: sine.isError || setemp.isError,
  };
}

export function findVagaBySlug(vagas: Vaga[], slug: string): Vaga | undefined {
  return vagas.find((v) => v.slug === slug);
}
