import type { Vaga } from "../data/vagas";
import {
  ajustarSlugsDuplicados,
  detectarPcdEmTexto,
  gerarSlug,
  inferirCategoria,
  limparHtmlParaTexto,
  limparTexto,
  removerVagasDuplicadas,
} from "./vaga-utils";

const BASE_URL = "https://www.portaldotrabalhador.am.gov.br";
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) VagasManausHoje/1.0";
const CONCORRENCIA_MAXIMA = 6;

// Municípios do Amazonas (fora Manaus) que podem aparecer no título da vaga,
// já que o Portal do Trabalhador é estadual e cobre o Amazonas inteiro.
const OUTROS_MUNICIPIOS_AM = [
  "Alvarães",
  "Amaturá",
  "Anamã",
  "Anori",
  "Apuí",
  "Atalaia do Norte",
  "Autazes",
  "Barcelos",
  "Barreirinha",
  "Benjamin Constant",
  "Beruri",
  "Boa Vista do Ramos",
  "Boca do Acre",
  "Borba",
  "Caapiranga",
  "Canutama",
  "Carauari",
  "Careiro",
  "Careiro da Várzea",
  "Coari",
  "Codajás",
  "Eirunepé",
  "Envira",
  "Fonte Boa",
  "Guajará",
  "Humaitá",
  "Ipixuna",
  "Iranduba",
  "Itacoatiara",
  "Itamarati",
  "Itapiranga",
  "Japurá",
  "Juruá",
  "Jutaí",
  "Lábrea",
  "Manacapuru",
  "Manaquiri",
  "Manicoré",
  "Maraã",
  "Maués",
  "Nhamundá",
  "Nova Olinda do Norte",
  "Novo Airão",
  "Novo Aripuanã",
  "Parintins",
  "Pauini",
  "Presidente Figueiredo",
  "Rio Preto da Eva",
  "Santa Isabel do Rio Negro",
  "Santo Antônio do Içá",
  "São Gabriel da Cachoeira",
  "São Paulo de Olivença",
  "São Sebastião do Uatumã",
  "Silves",
  "Tabatinga",
  "Tapauá",
  "Tefé",
  "Tonantins",
  "Uarini",
  "Urucará",
  "Urucurituba",
];

export type VagaSetempResumo = {
  slugOdoo: string;
  id: string;
  tituloOriginal: string;
  quantidadeVagas: number;
};

export async function buscarListaDeVagasSetemp(): Promise<VagaSetempResumo[]> {
  const resposta = await fetch(`${BASE_URL}/jobs`, {
    headers: { "User-Agent": USER_AGENT },
    next: { revalidate: 60 * 60 },
  });

  if (!resposta.ok) {
    throw new Error("Erro ao buscar lista de vagas do Portal do Trabalhador");
  }

  const html = await resposta.text();

  return extrairListaDeVagas(html);
}

export function extrairListaDeVagas(html: string): VagaSetempResumo[] {
  const regexItem =
    /<h3>\s*<a href="\/jobs\/detail\/([a-z0-9-]+)">\s*<span>([^<]+)<\/span>\s*<\/a>([\s\S]*?)<\/h3>/gi;

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

export async function buscarDetalheDeVagaSetemp(slugOdoo: string) {
  const resposta = await fetch(`${BASE_URL}/jobs/detail/${slugOdoo}`, {
    headers: { "User-Agent": USER_AGENT },
    next: { revalidate: 60 * 60 },
  });

  if (!resposta.ok) {
    return null;
  }

  const html = await resposta.text();

  return extrairConteudoDaVaga(html);
}

type ConteudoVagaSetemp = {
  titulo: string;
  escolaridade: string;
  experiencia: string;
  atividades: string;
  requisitosAdicionais: string[];
  salario: string;
  beneficios: string[];
  residirEm: string | null;
};

export function extrairConteudoDaVaga(html: string): ConteudoVagaSetemp | null {
  const matchTitulo = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  const titulo = matchTitulo ? limparTexto(limparHtmlParaTexto(matchTitulo[1])) : "";

  const inicioSecao = html.indexOf('<section class="mb32">');

  if (inicioSecao === -1 || !titulo) {
    return null;
  }

  const fimSecao = html.indexOf("</section>", inicioSecao);
  const trechoHtml =
    fimSecao === -1
      ? html.slice(inicioSecao)
      : html.slice(inicioSecao, fimSecao);

  const linhas = limparHtmlParaTexto(trechoHtml)
    .split("\n")
    .map((linha) => limparTexto(linha))
    .filter(Boolean);

  let escolaridade = "Não informado";
  let salario = "Não informado";
  const beneficios: string[] = [];
  let experiencia = "Não informado";
  const atividadesLinhas: string[] = [];
  const requisitosAdicionais: string[] = [];
  let residirEm: string | null = null;

  for (const linha of linhas) {
    const matchEscolaridade = linha.match(/^Escolaridade\s*:?\s*(.+)$/i);
    if (matchEscolaridade) {
      escolaridade = limparTexto(matchEscolaridade[1]);
      continue;
    }

    const matchSalario = linha.match(/^Sal[aá]rio\s*:?\s*(.+)$/i);
    if (matchSalario) {
      salario = limparTexto(matchSalario[1]);
      continue;
    }

    const matchBeneficios = linha.match(/^Benef[ií]cios?\s*:?\s*(.+)$/i);
    if (matchBeneficios) {
      beneficios.push(limparTexto(matchBeneficios[1]));
      continue;
    }

    if (/inscri[cç][oõ]es?\s+pelo\s+portal/i.test(linha)) {
      continue;
    }

    const matchResidir = linha.match(/^Residir\s+em\s+(.+?)\.?$/i);
    if (matchResidir) {
      residirEm = limparTexto(matchResidir[1]);
      requisitosAdicionais.push(linha);
      continue;
    }

    if (/experi[eê]ncia/i.test(linha)) {
      experiencia = linha;
      continue;
    }

    const quantidadePalavras = linha.split(/\s+/).filter(Boolean).length;

    if (quantidadePalavras <= 8) {
      requisitosAdicionais.push(linha);
    } else {
      atividadesLinhas.push(linha);
    }
  }

  return {
    titulo,
    escolaridade,
    experiencia,
    atividades: atividadesLinhas.join(" "),
    requisitosAdicionais,
    salario,
    beneficios,
    residirEm,
  };
}

function inferirMunicipio(tituloOriginal: string, residirEm: string | null) {
  if (residirEm) {
    const encontrado = OUTROS_MUNICIPIOS_AM.find(
      (municipio) => gerarSlug(municipio) === gerarSlug(residirEm)
    );

    if (encontrado) {
      return { municipio: encontrado, tituloSemSufixo: tituloOriginal };
    }
  }

  const matchSufixo = tituloOriginal.match(
    /^(.*?)\s*(?:[-–—]\s*|\()([A-ZÀ-Úa-zà-ú\s]+?)\)?\s*$/
  );

  if (matchSufixo) {
    const candidato = matchSufixo[2].trim();
    const encontrado = OUTROS_MUNICIPIOS_AM.find(
      (municipio) => gerarSlug(municipio) === gerarSlug(candidato)
    );

    if (encontrado) {
      return {
        municipio: encontrado,
        tituloSemSufixo: limparTexto(matchSufixo[1]),
      };
    }
  }

  return { municipio: "Manaus", tituloSemSufixo: tituloOriginal };
}

const CONECTIVOS_MINUSCULOS = new Set([
  "de",
  "da",
  "do",
  "das",
  "dos",
  "e",
  "em",
  "a",
  "o",
  "para",
  "com",
  "no",
  "na",
  "nos",
  "nas",
]);

function tituloCase(texto: string) {
  return texto
    .toLowerCase()
    .split(" ")
    .map((palavra, indice) => {
      if (palavra.length === 0) {
        return palavra;
      }

      if (indice > 0 && CONECTIVOS_MINUSCULOS.has(palavra)) {
        return palavra;
      }

      return palavra[0].toUpperCase() + palavra.slice(1);
    })
    .join(" ");
}

export async function buscarVagasSetemp(): Promise<Vaga[]> {
  const lista = await buscarListaDeVagasSetemp();

  const vagas: Vaga[] = [];

  for (let i = 0; i < lista.length; i += CONCORRENCIA_MAXIMA) {
    const lote = lista.slice(i, i + CONCORRENCIA_MAXIMA);

    const resultadosLote = await Promise.all(
      lote.map(async (resumo) => {
        try {
          const conteudo = await buscarDetalheDeVagaSetemp(resumo.slugOdoo);
          return { resumo, conteudo };
        } catch (error) {
          console.error(
            `Erro ao buscar detalhe da vaga SETEMP ${resumo.slugOdoo}`,
            error
          );
          return { resumo, conteudo: null };
        }
      })
    );

    for (const { resumo, conteudo } of resultadosLote) {
      if (!conteudo) {
        continue;
      }

      const { municipio, tituloSemSufixo } = inferirMunicipio(
        resumo.tituloOriginal,
        conteudo.residirEm
      );

      if (gerarSlug(municipio) !== gerarSlug("Manaus")) {
        continue;
      }

      const titulo = tituloCase(tituloSemSufixo || conteudo.titulo);

      const requisitos =
        conteudo.requisitosAdicionais.length > 0
          ? conteudo.requisitosAdicionais
          : ["Não informado"];

      const textoParaPcd = [
        titulo,
        conteudo.requisitosAdicionais.join(" "),
        conteudo.atividades,
      ].join(" ");

      vagas.push({
        id: `setemp-${resumo.id}`,
        slug: gerarSlug(`${titulo}-manaus`),
        titulo,
        empresa: "Empresa não informada",
        cidade: "Manaus",
        estado: "AM",
        bairro: "Não informado",
        categoria: inferirCategoria(titulo),
        escolaridade: conteudo.escolaridade,
        experiencia: conteudo.experiencia,
        salario: conteudo.salario,
        requisitos,
        beneficios: conteudo.beneficios.length > 0 ? conteudo.beneficios : ["Não informado"],
        comoSeCandidatar:
          "Candidate-se diretamente pela página da vaga no Portal do Trabalhador (SETEMP).",
        fonte: "SETEMP / Portal do Trabalhador",
        linkFonte: `${BASE_URL}/jobs/detail/${resumo.slugOdoo}`,
        dataPublicacao: new Date().toISOString().slice(0, 10),
        status: "ativa",
        descricao: conteudo.atividades
          ? `Vaga de ${titulo} divulgada pelo Portal do Trabalhador (SETEMP). ${conteudo.atividades}`
          : `Vaga de ${titulo} divulgada pelo Portal do Trabalhador (SETEMP).`,
        tipoContrato: "Não informado",
        modalidade: "Presencial",
        quantidadeVagas: resumo.quantidadeVagas,
        emailCandidatura: "",
        whatsappCandidatura: "",
        pcd: detectarPcdEmTexto(textoParaPcd),
      });
    }
  }

  const vagasSemDuplicidade = removerVagasDuplicadas(vagas);

  return ajustarSlugsDuplicados(vagasSemDuplicidade);
}
