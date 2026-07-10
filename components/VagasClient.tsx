"use client";

import { useMemo, useRef, useState } from "react";
import { AlertTriangle, Search } from "lucide-react";
import { VagaCard } from "./VagaCard";
import { VagaCardSkeleton } from "./VagaCardSkeleton";
import { CurriculoCta } from "./CurriculoCta";
import { normalizar, filtrarPorTipo, formatarData } from "../lib/vaga-utils";
import { useVagasUnificadas } from "../hooks/useVagasUnificadas";

type Destaque = {
  id: string;
  titulo: string;
  quantidadeVagas: number;
};

const filtrosRapidos = [
  "Todas",
  "Sem experiência",
  "Ensino médio",
  "Ensino fundamental",
  "PCD",
];

const TODOS_BAIRROS = "Todos os bairros";

export function VagasClient() {
  const {
    vagas: todasVagas,
    carregando,
    erroSine,
    erroSetemp,
    sine,
    setemp,
  } = useVagasUnificadas();

  const [filtroSelecionado, setFiltroSelecionado] = useState("Todas");
  const [bairroSelecionado, setBairroSelecionado] = useState(TODOS_BAIRROS);
  const [busca, setBusca] = useState("");
  const [quantidadeVisivel, setQuantidadeVisivel] = useState(12);
  const gridRef = useRef<HTMLDivElement | null>(null);

  const categorias = useMemo(() => {
    return Array.from(new Set(todasVagas.map((vaga) => vaga.categoria))).sort();
  }, [todasVagas]);

  const filtros = useMemo(() => {
    const categoriasSemRepeticao = categorias.filter(
      (categoria) => !filtrosRapidos.includes(categoria)
    );

    return [...filtrosRapidos, ...categoriasSemRepeticao];
  }, [categorias]);

  const bairros = useMemo(() => {
    const bairrosInformados = todasVagas
      .map((vaga) => vaga.bairro)
      .filter((bairro) => bairro && normalizar(bairro) !== "nao informado");

    return [TODOS_BAIRROS, ...Array.from(new Set(bairrosInformados)).sort()];
  }, [todasVagas]);

  const vagasFiltradas = useMemo(() => {
    const termoBusca = normalizar(busca.trim());

    return todasVagas.filter((vaga) => {
      const correspondeFiltro = filtrarPorTipo(vaga, filtroSelecionado);

      const correspondeBairro =
        bairroSelecionado === TODOS_BAIRROS || vaga.bairro === bairroSelecionado;

      const textoDaVaga = normalizar(`
        ${vaga.titulo}
        ${vaga.empresa}
        ${vaga.categoria}
        ${vaga.escolaridade}
        ${vaga.experiencia}
        ${vaga.salario}
        ${vaga.status}
        ${vaga.fonte}
        ${vaga.comoSeCandidatar}
        ${vaga.descricao ?? ""}
        ${vaga.requisitos.join(" ")}
        ${vaga.beneficios.join(" ")}
        ${vaga.modalidade ?? ""}
        ${vaga.tipoContrato ?? ""}
      `);

      const correspondeBusca =
        termoBusca === "" || textoDaVaga.includes(termoBusca);

      return correspondeFiltro && correspondeBairro && correspondeBusca;
    });
  }, [todasVagas, busca, filtroSelecionado, bairroSelecionado]);

  const vagasVisiveis = vagasFiltradas.slice(0, quantidadeVisivel);
  const aindaTemMais = quantidadeVisivel < vagasFiltradas.length;

  const destaques = useMemo<Destaque[]>(() => {
    return [...todasVagas]
      .filter((vaga) => (vaga.quantidadeVagas ?? 0) > 1)
      .sort((a, b) => (b.quantidadeVagas ?? 0) - (a.quantidadeVagas ?? 0))
      .slice(0, 3)
      .map((vaga) => ({
        id: String(vaga.id),
        titulo: vaga.titulo,
        quantidadeVagas: vaga.quantidadeVagas ?? 1,
      }));
  }, [todasVagas]);

  const filtrosAtivos =
    filtroSelecionado !== "Todas" ||
    bairroSelecionado !== TODOS_BAIRROS ||
    busca.trim().length > 0;

  function limparFiltros() {
    setFiltroSelecionado("Todas");
    setBairroSelecionado(TODOS_BAIRROS);
    setBusca("");
    setQuantidadeVisivel(12);
  }

  function selecionarDestaque(destaque: Destaque) {
    setBusca(destaque.titulo);
    setFiltroSelecionado("Todas");
    setQuantidadeVisivel(12);

    window.setTimeout(() => {
      gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <p className="text-sm font-black uppercase tracking-wide text-blue-700">
            Oportunidades em Manaus
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
            Encontre vagas disponíveis em Manaus
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            Consulte oportunidades divulgadas publicamente pelo Sine Manaus,
            pelo Portal do Trabalhador (SETEMP) e cadastradas na plataforma —
            tudo numa busca só.
          </p>

          <div className="mt-5">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-5 py-2.5">
              <span className="text-2xl font-black text-blue-700">
                {carregando ? "…" : todasVagas.length}
              </span>
              <span className="text-sm font-bold text-blue-700">
                vagas disponíveis agora
              </span>
            </span>
          </div>

          <div className="mt-4">
            <CurriculoCta variant="inline" />
          </div>
        </div>
      </section>

      {!carregando && (
        <section className="mx-auto max-w-6xl px-4 pt-8">
          <div className="flex gap-3 rounded-xl border-l-4 border-amber-500 bg-amber-50 px-4 py-4">
            <AlertTriangle
              className="mt-0.5 size-5 shrink-0 text-amber-600"
              aria-hidden="true"
            />
            <p className="text-sm leading-6 text-amber-900">
              <strong className="font-black">Vagas são gratuitas.</strong>{" "}
              Nunca pague para se candidatar, fazer cadastro, treinamento ou
              garantir contratação. Confirme sempre a fonte oficial de cada
              vaga.
            </p>
          </div>

          <p className="mt-4 text-xs font-semibold text-slate-500">
            Fontes:{" "}
            {!erroSine && `Sine Manaus (${sine.totalOficial} vagas oficiais)`}
            {!erroSine && !erroSetemp && " · "}
            {!erroSetemp && `SETEMP (${setemp.totalOficial} vagas)`}
            {sine.post &&
              ` · atualizado em ${formatarData(sine.post.dataPublicacao)}`}
            {sine.post?.link && (
              <>
                {" "}
                ·{" "}
                <a
                  href={sine.post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-blue-700 hover:underline"
                >
                  Ver notícia oficial
                </a>
              </>
            )}
          </p>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-8">
        {(carregando || destaques.length > 0) && (
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-black uppercase tracking-wide text-blue-700">
              Vagas em destaque
            </p>

            <h2 className="mt-1 text-2xl font-black text-slate-950">
              Cargos com mais oportunidades abertas
            </h2>

            {carregando ? (
              <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <p className="text-sm font-semibold text-slate-600">
                  Carregando vagas em destaque...
                </p>
              </div>
            ) : (
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {destaques.map((destaque) => (
                  <button
                    key={destaque.id}
                    type="button"
                    onClick={() => selecionarDestaque(destaque)}
                    className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-left transition hover:border-blue-300 hover:bg-blue-100"
                  >
                    <p className="text-sm font-black leading-5 text-slate-950">
                      {destaque.titulo}
                    </p>

                    <p className="mt-2 text-sm font-bold text-blue-700">
                      {destaque.quantidadeVagas} vaga
                      {destaque.quantidadeVagas > 1 ? "s" : ""}
                    </p>

                    <p className="mt-3 text-xs font-black uppercase tracking-wide text-slate-500">
                      Ver cards dessa vaga
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <section className="mt-10">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-5">
              <div>
                <label
                  htmlFor="busca"
                  className="mb-2 block text-sm font-bold text-slate-900"
                >
                  Buscar vagas
                </label>

                <div className="relative">
                  <Search
                    className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400"
                    aria-hidden="true"
                  />

                  <input
                    id="busca"
                    type="text"
                    value={busca}
                    onChange={(event) => {
                      setBusca(event.target.value);
                      setQuantidadeVisivel(12);
                    }}
                    placeholder="Digite cargo, escolaridade, experiência ou requisito"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-11 pr-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-bold text-slate-900">
                  Filtrar vagas
                </p>

                <div className="flex flex-wrap gap-3">
                  {filtros.map((filtro) => {
                    const estaSelecionado = filtroSelecionado === filtro;

                    return (
                      <button
                        key={filtro}
                        type="button"
                        onClick={() => {
                          setFiltroSelecionado(filtro);
                          setQuantidadeVisivel(12);
                        }}
                        className={`rounded-full border px-5 py-3 text-sm font-bold transition ${
                          estaSelecionado
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

              <div>
                <p className="mb-3 text-sm font-bold text-slate-900">
                  Filtrar por bairro
                </p>

                <div className="flex flex-wrap gap-3">
                  {bairros.map((bairro) => {
                    const estaSelecionado = bairroSelecionado === bairro;

                    return (
                      <button
                        key={bairro}
                        type="button"
                        onClick={() => {
                          setBairroSelecionado(bairro);
                          setQuantidadeVisivel(12);
                        }}
                        className={`rounded-full border px-5 py-3 text-sm font-bold transition ${
                          estaSelecionado
                            ? "border-blue-700 bg-blue-700 text-white shadow-sm"
                            : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                        }`}
                      >
                        {bairro}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-slate-600">
                  {busca.trim() ? (
                    <>
                      Exibindo{" "}
                      <span className="font-black text-slate-950">
                        {vagasFiltradas.length}
                      </span>{" "}
                      resultado
                      {vagasFiltradas.length !== 1 ? "s" : ""} para “
                      {busca.trim()}”
                    </>
                  ) : (
                    <>
                      Exibindo{" "}
                      <span className="font-black text-slate-950">
                        {vagasFiltradas.length}
                      </span>{" "}
                      cargo
                      {vagasFiltradas.length !== 1 ? "s" : ""}
                    </>
                  )}
                </p>

                {filtrosAtivos && (
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
          </div>

          {(erroSine || erroSetemp) && (
            <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-800">
              {erroSine &&
                "Não foi possível carregar as vagas do Sine Manaus no momento. "}
              {erroSetemp &&
                "Não foi possível carregar as vagas do Portal do Trabalhador (SETEMP) no momento. "}
              Os resultados abaixo podem estar incompletos.
            </div>
          )}

          {carregando && (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, indice) => (
                <VagaCardSkeleton key={indice} />
              ))}
            </div>
          )}

          {!carregando && vagasFiltradas.length > 0 && (
            <>
              <div
                ref={gridRef}
                className="mt-8 scroll-mt-24 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {vagasVisiveis.map((vaga) => (
                  <VagaCard key={vaga.id} vaga={vaga} />
                ))}
              </div>

              {aindaTemMais && (
                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={() =>
                      setQuantidadeVisivel((valor) => valor + 12)
                    }
                    className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-800 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                  >
                    Mostrar mais vagas
                  </button>
                </div>
              )}
            </>
          )}

          {!carregando && vagasFiltradas.length === 0 && (
            <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <h2 className="text-2xl font-black text-slate-950">
                Nenhuma vaga encontrada com esses filtros.
              </h2>

              <p className="mt-3 text-slate-600">
                Tente remover filtros ou buscar por outro cargo, escolaridade,
                experiência ou requisito.
              </p>

              <button
                type="button"
                onClick={limparFiltros}
                className="mt-6 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
