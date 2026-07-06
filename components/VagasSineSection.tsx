"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Vaga } from "../data/vagas";
import { VagaCard } from "./VagaCard";

type RespostaSine = {
  fonte: string;
  total: number;
  totalImportado?: number;
  totalDeclaradoNoticia?: number | null;
  totalCargos?: number;
  diferenca?: number | null;
  vagas: Vaga[];
  post?: {
    id: number;
    slug: string;
    titulo: string;
    link: string;
    dataPublicacao: string;
  };
  erro?: string;
};

type DestaqueSine = {
  id: string;
  titulo: string;
  quantidadeVagas: number;
};



type ResumoSine = {
  totalCargos: number;
  totalOficial: number;
  carregando: boolean;
  erro: boolean;
  destaques: DestaqueSine[];
};

type DestaqueSelecionado = {
  id: string;
  titulo: string;
  acionadoEm: number;
};

type VagasSineSectionProps = {
  onResumoChange?: (resumo: ResumoSine) => void;
  destaqueSelecionado?: DestaqueSelecionado | null;
};

const filtrosSine = [
  "Todas",
  "Sem experiência",
  "Ensino médio",
  "Ensino fundamental",
  "PCD",
  "Administrativo",
  "Produção",
  "Atendimento",
  "Logística",
  "Comércio",
  "Serviços gerais",
];

export function VagasSineSection({
  onResumoChange,
  destaqueSelecionado,
}: VagasSineSectionProps) {
  const [vagasSine, setVagasSine] = useState<Vaga[]>([]);
  const [post, setPost] = useState<RespostaSine["post"]>();
  const [fonte, setFonte] = useState("");
  const [totalImportado, setTotalImportado] = useState(0);
  const [totalDeclaradoNoticia, setTotalDeclaradoNoticia] = useState<
    number | null
  >(null);
  const [totalCargos, setTotalCargos] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [quantidadeVisivel, setQuantidadeVisivel] = useState(12);

  const [busca, setBusca] = useState("");
  const [filtroSelecionado, setFiltroSelecionado] = useState("Todas");
  const areaCardsRef = useRef<HTMLDivElement | null>(null);
  const [rolarParaCards, setRolarParaCards] = useState(false);

  useEffect(() => {
    async function carregarVagasSine() {
      try {
        const resposta = await fetch("/api/vagas-sine");

        if (!resposta.ok) {
          throw new Error("Erro ao buscar vagas do Sine Manaus.");
        }

        const dados = (await resposta.json()) as RespostaSine;

        if (dados.erro) {
          throw new Error(dados.erro);
        }

        setVagasSine(dados.vagas ?? []);
        setPost(dados.post);
        setFonte(dados.fonte);

        setTotalImportado(dados.totalImportado ?? dados.total ?? 0);
        setTotalDeclaradoNoticia(dados.totalDeclaradoNoticia ?? null);
        setTotalCargos(dados.totalCargos ?? dados.vagas?.length ?? 0);
      } catch (error) {
        console.error(error);
        setErro(
          "Não foi possível carregar as vagas no momento. Tente novamente mais tarde ou acesse a notícia oficial."
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarVagasSine();
  }, []);

  const vagasFiltradas = useMemo(() => {
    const termoBusca = normalizar(busca.trim());

    return vagasSine.filter((vaga) => {
      const textoDaVaga = normalizar(`
        ${vaga.titulo}
        ${vaga.empresa}
        ${vaga.categoria}
        ${vaga.escolaridade}
        ${vaga.experiencia}
        ${vaga.requisitos.join(" ")}
      `);

      const correspondeBusca =
        termoBusca === "" || textoDaVaga.includes(termoBusca);

      const correspondeFiltro = filtrarPorTipo(vaga, filtroSelecionado);

      return correspondeBusca && correspondeFiltro;
    });
  }, [busca, filtroSelecionado, vagasSine]);

  const vagasVisiveis = vagasFiltradas.slice(0, quantidadeVisivel);
  const aindaTemMais = quantidadeVisivel < vagasFiltradas.length;
  useEffect(() => {
  if (!destaqueSelecionado) {
    return;
  }

  setBusca(destaqueSelecionado.titulo);
  setFiltroSelecionado("Todas");
  setQuantidadeVisivel(12);
  setRolarParaCards(true);
}, [destaqueSelecionado]);

useEffect(() => {
  if (!rolarParaCards) {
    return;
  }

  const timeoutId = window.setTimeout(() => {
    areaCardsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setRolarParaCards(false);
  }, 120);

  return () => window.clearTimeout(timeoutId);
}, [rolarParaCards, vagasFiltradas.length]);

  const totalOficial = totalDeclaradoNoticia ?? totalImportado;

  const vagasComMaisOportunidades = useMemo(() => {
    return [...vagasSine]
      .filter((vaga) => (vaga.quantidadeVagas ?? 0) > 1)
      .sort((a, b) => (b.quantidadeVagas ?? 0) - (a.quantidadeVagas ?? 0))
      .slice(0, 5);
  }, [vagasSine]);

  const destaquesResumo = useMemo(() => {
    return vagasComMaisOportunidades.slice(0, 3).map((vaga) => ({
      id: String(vaga.id),
      titulo: vaga.titulo,
      quantidadeVagas: vaga.quantidadeVagas ?? 1,
    }));
  }, [vagasComMaisOportunidades]);

  useEffect(() => {
    onResumoChange?.({
      totalCargos,
      totalOficial,
      carregando,
      erro: Boolean(erro),
      destaques: destaquesResumo,
    });
  }, [
    onResumoChange,
    totalCargos,
    totalOficial,
    carregando,
    erro,
    destaquesResumo,
  ]);

  function limparFiltros() {
    setBusca("");
    setFiltroSelecionado("Todas");
    setQuantidadeVisivel(12);
  }

  return (
    <section className="mt-8 border-t border-slate-200 pt-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-blue-700">
            Sine Manaus
          </p>

          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
            Vagas atualizadas do Sine Manaus
          </h2>

          <p className="mt-3 max-w-3xl leading-7 text-slate-600">
            Consulte as oportunidades antes de ir presencialmente ao atendimento.
          </p>
        </div>

        {post?.link && (
          <a
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center justify-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-blue-800"
          >
            Ver notícia oficial
          </a>
        )}
      </div>

      {post && (
        <div className="mt-5 flex flex-wrap gap-2 text-sm font-semibold text-slate-700">
          <span className="rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
            {totalOficial} vagas oficiais
          </span>

          <span className="rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
            {totalCargos} cargos organizados
          </span>

          <span className="rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
            Publicado em {formatarData(post.dataPublicacao)}
          </span>
        </div>
      )}

      {carregando && (
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="font-semibold text-slate-600">
            Carregando vagas do Sine Manaus...
          </p>
        </div>
      )}

      {erro && (
        <div className="mt-6 rounded-3xl border border-red-100 bg-red-50 p-8 text-center">
          <h3 className="text-xl font-black text-red-800">
            Erro ao carregar vagas
          </h3>

          <p className="mt-3 text-red-700">{erro}</p>

          {post?.link && (
            <a
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center justify-center rounded-xl bg-red-700 px-5 py-3 text-sm font-black text-white transition hover:bg-red-800"
            >
              Ver notícia oficial
            </a>
          )}
        </div>
      )}

      {!carregando && !erro && vagasSine.length > 0 && (
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div>
            <label
              htmlFor="busca-sine"
              className="mb-2 block text-sm font-bold text-slate-900"
            >
              Buscar nas vagas do Sine
            </label>

            <input
              id="busca-sine"
              type="text"
              value={busca}
              onChange={(event) => {
                setBusca(event.target.value);
                setQuantidadeVisivel(12);
              }}
              placeholder="Digite cargo, escolaridade, experiência ou requisito"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div className="mt-5">
            <p className="mb-3 text-sm font-bold text-slate-900">
              Filtrar vagas do Sine
            </p>

            <div className="flex flex-wrap gap-3">
              {filtrosSine.map((filtro) => {
                const selecionado = filtroSelecionado === filtro;

                return (
                  <button
                    key={filtro}
                    type="button"
                    onClick={() => {
                      setFiltroSelecionado(filtro);
                      setQuantidadeVisivel(12);
                    }}
                    className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                      selecionado
                        ? "border-blue-700 bg-blue-700 text-white shadow-sm"
                        : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                  >
                    {filtro}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-slate-600">
              {busca.trim() ? (
                <>
                  Exibindo{" "}
                  <span className="font-black text-slate-950">
                    {vagasFiltradas.length}
                  </span>{" "}
                  resultados para “{busca.trim()}”
                </>
              ) : (
                <>
                  Exibindo{" "}
                  <span className="font-black text-slate-950">
                    {vagasFiltradas.length}
                  </span>{" "}
                  cargos do Sine Manaus
                </>
              )}
            </p>

            {(busca || filtroSelecionado !== "Todas") && (
              <button
                type="button"
                onClick={limparFiltros}
                className="w-fit rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 hover:text-blue-700"
              >
                Limpar filtros
              </button>
            )}
          </div>
        </div>
      )}

      {!carregando && !erro && vagasSine.length === 0 && (
        <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <h3 className="text-xl font-black text-slate-950">
            Nenhuma vaga do Sine encontrada
          </h3>

          <p className="mt-3 text-slate-600">
            A notícia foi encontrada, mas nenhuma vaga foi extraída pelo parser.
          </p>
        </div>
      )}

      {!carregando &&
        !erro &&
        vagasSine.length > 0 &&
        vagasFiltradas.length === 0 && (
          <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <h3 className="text-xl font-black text-slate-950">
              Nenhuma vaga encontrada com esses filtros.
            </h3>

            <p className="mt-3 text-slate-600">
              Tente remover filtros ou buscar por outro cargo, escolaridade,
              experiência ou requisito.
            </p>

            <button
              type="button"
              onClick={limparFiltros}
              className="mt-6 rounded-xl bg-blue-700 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-800"
            >
              Limpar filtros
            </button>
          </div>
        )}

      {!carregando && !erro && vagasFiltradas.length > 0 && (
        <>
<div
  ref={areaCardsRef}
  className="mt-6 scroll-mt-24 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
>            {vagasVisiveis.map((vaga) => (
              <VagaCard key={vaga.id} vaga={vaga} />
            ))}
          </div>

          {aindaTemMais && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setQuantidadeVisivel((valor) => valor + 12)}
                className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-800 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                Mostrar mais vagas do Sine
              </button>
            </div>
          )}
        </>
      )}

      {!carregando && !erro && (
        <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5">
            <p className="text-sm leading-6 text-amber-900">
              <strong>Aviso importante:</strong> as vagas são gratuitas. Nunca
              pague para se candidatar, fazer cadastro, treinamento ou garantir
              contratação. Confirme sempre as orientações na notícia oficial da
              Prefeitura de Manaus.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-black uppercase tracking-wide text-blue-700">
              Resumo da fonte
            </p>

            <div className="mt-3 space-y-2 text-sm text-slate-700">
              <p>
                <span className="font-black text-slate-950">Fonte:</span>{" "}
                {fonte || "Prefeitura de Manaus - Sine Manaus"}
              </p>

              {post && (
                <p>
                  <span className="font-black text-slate-950">
                    Publicação:
                  </span>{" "}
                  {formatarData(post.dataPublicacao)}
                </p>
              )}

              <p>
                <span className="font-black text-slate-950">
                  Vagas oficiais:
                </span>{" "}
                {totalOficial}
              </p>

              <p>
                <span className="font-black text-slate-950">
                  Cargos organizados:
                </span>{" "}
                {totalCargos}
              </p>
            </div>

            {post?.link && (
              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex w-fit items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-800 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                Ver notícia oficial
              </a>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

function filtrarPorTipo(vaga: Vaga, filtro: string) {
  const escolaridade = normalizar(vaga.escolaridade);
  const experiencia = normalizar(vaga.experiencia);
  const categoria = normalizar(vaga.categoria);
  const titulo = normalizar(vaga.titulo);
  const requisitos = normalizar(vaga.requisitos.join(" "));

  if (filtro === "Todas") {
    return true;
  }

  if (filtro === "Sem experiência" || filtro === "Não é necessário") {
    return (
      experiencia.includes("sem experiencia") ||
      experiencia.includes("nao e necessario") ||
      experiencia.includes("nao necessario") ||
      experiencia.includes("nao necessita") ||
      experiencia.includes("nao exige") ||
      experiencia.includes("sem necessidade de experiencia") ||
      requisitos.includes("sem experiencia") ||
      requisitos.includes("nao e necessario") ||
      requisitos.includes("nao necessario") ||
      requisitos.includes("nao necessita") ||
      requisitos.includes("nao exige")
    );
  }

  if (filtro === "Ensino médio") {
    return escolaridade.includes("ensino medio");
  }

  if (filtro === "Ensino fundamental") {
    return escolaridade.includes("ensino fundamental");
  }

  if (filtro === "PCD") {
    return vaga.pcd === true;
  }

  if (filtro === "Administrativo") {
    return (
      categoria.includes("administrativo") || titulo.includes("administrativo")
    );
  }

  if (filtro === "Produção") {
    return categoria.includes("producao") || titulo.includes("producao");
  }

  if (filtro === "Atendimento") {
    return (
      categoria.includes("atendimento") ||
      titulo.includes("atendente") ||
      titulo.includes("recepcionista")
    );
  }

  if (filtro === "Logística") {
    return (
      categoria.includes("logistica") ||
      titulo.includes("logistico") ||
      titulo.includes("estoque") ||
      titulo.includes("almoxarife") ||
      titulo.includes("conferente")
    );
  }

  if (filtro === "Comércio") {
    return (
      categoria.includes("comercio") ||
      titulo.includes("vendedor") ||
      titulo.includes("loja") ||
      titulo.includes("caixa")
    );
  }

  if (filtro === "Serviços gerais") {
    return (
      categoria.includes("servicos gerais") ||
      categoria.includes("servicos") ||
      titulo.includes("limpeza") ||
      titulo.includes("servicos gerais")
    );
  }

  return true;
}

function normalizar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function formatarData(data: string) {
  const dataObj = new Date(`${data}T00:00:00`);

  return new Intl.DateTimeFormat("pt-BR").format(dataObj);
}