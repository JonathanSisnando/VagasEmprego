"use client";

import { useMemo, useState } from "react";
import { vagas } from "../data/vagas";
import { VagaCard } from "./VagaCard";
import { VagasSineSection } from "./VagasSineSection";

type DestaqueSine = {
  id: string;
  titulo: string;
  quantidadeVagas: number;
};

type DestaqueSelecionado = {
  id: string;
  titulo: string;
  acionadoEm: number;
};

type ResumoSine = {
  totalCargos: number;
  totalOficial: number;
  carregando: boolean;
  erro: boolean;
  destaques: DestaqueSine[];
};

const filtrosRapidos = [
  "Todas",
  "Sem experiência",
  "Ensino médio",
  "Ensino fundamental",
  "PCD",
];

export function VagasClient() {
  const [filtroSelecionado, setFiltroSelecionado] = useState("Todas");
  const [busca, setBusca] = useState("");

  const [resumoSine, setResumoSine] = useState<ResumoSine>({
    totalCargos: 0,
    totalOficial: 0,
    carregando: true,
    erro: false,
    destaques: [],
  });

  const [destaqueSelecionado, setDestaqueSelecionado] =
    useState<DestaqueSelecionado | null>(null);

  const categorias = useMemo(() => {
    return Array.from(new Set(vagas.map((vaga) => vaga.categoria)));
  }, []);

  const filtros = useMemo(() => {
    const categoriasSemRepeticao = categorias.filter(
      (categoria) => !filtrosRapidos.includes(categoria)
    );

    return [...filtrosRapidos, ...categoriasSemRepeticao];
  }, [categorias]);

  const vagasFiltradas = useMemo(() => {
    const termoBusca = normalizar(busca.trim());

    return vagas.filter((vaga) => {
      const correspondeFiltro = filtrarPorTipo(vaga, filtroSelecionado);

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

      return correspondeFiltro && correspondeBusca;
    });
  }, [busca, filtroSelecionado]);

  const filtrosAtivos =
    filtroSelecionado !== "Todas" || busca.trim().length > 0;

  function limparFiltros() {
    setFiltroSelecionado("Todas");
    setBusca("");
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
            Consulte oportunidades divulgadas publicamente e veja as vagas
            atualizadas automaticamente pelo Sine Manaus antes de ir
            presencialmente ao atendimento.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-black uppercase tracking-wide text-blue-700">
            Resumo das vagas
          </p>

          <h2 className="mt-1 text-2xl font-black text-slate-950">
            Consulte as oportunidades disponíveis hoje
          </h2>

          <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-sm leading-6 text-slate-600">
              {resumoSine.carregando && (
                <>
                  Carregando vagas do Sine Manaus e exibindo{" "}
                  <span className="font-black text-slate-950">
                    {vagas.length}
                  </span>{" "}
                  vagas cadastradas na plataforma.
                </>
              )}

              {resumoSine.erro && (
                <>
                  Não foi possível contar as vagas do Sine Manaus no momento.
                  Exibindo{" "}
                  <span className="font-black text-slate-950">
                    {vagas.length}
                  </span>{" "}
                  vagas cadastradas na plataforma.
                </>
              )}

              {!resumoSine.carregando && !resumoSine.erro && (
                <>
                  Exibindo{" "}
                  <span className="font-black text-slate-950">
                    {resumoSine.totalCargos}
                  </span>{" "}
                  cargos do Sine Manaus,{" "}
                  <span className="font-black text-slate-950">
                    {resumoSine.totalOficial}
                  </span>{" "}
                  vagas oficiais divulgadas e{" "}
                  <span className="font-black text-slate-950">
                    {vagas.length}
                  </span>{" "}
                  vagas cadastradas na plataforma.
                </>
              )}
            </p>
          </div>

          {resumoSine.carregando && (
            <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-sm font-semibold text-slate-600">
                Carregando vagas em destaque...
              </p>
            </div>
          )}

          {!resumoSine.carregando && resumoSine.destaques.length > 0 && (
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {resumoSine.destaques.map((destaque) => (
                <button
                  key={destaque.id}
                  type="button"
                  onClick={() =>
                    setDestaqueSelecionado({
                      id: destaque.id,
                      titulo: destaque.titulo,
                      acionadoEm: Date.now(),
                    })
                  }
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

        <VagasSineSection
          onResumoChange={setResumoSine}
          destaqueSelecionado={destaqueSelecionado}
        />

        <section className="mt-14 border-t border-slate-200 pt-10">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-blue-700">
                Vagas cadastradas
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                Oportunidades selecionadas na plataforma
              </h2>

              <p className="mt-3 max-w-2xl leading-7 text-slate-600">
                Vagas cadastradas manualmente ou divulgadas diretamente na
                plataforma.
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-5">
              <div>
                <label
                  htmlFor="busca"
                  className="mb-2 block text-sm font-bold text-slate-900"
                >
                  Buscar nas vagas cadastradas
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    🔎
                  </span>

                  <input
                    id="busca"
                    type="text"
                    value={busca}
                    onChange={(event) => setBusca(event.target.value)}
                    placeholder="Digite cargo, escolaridade, experiência ou requisito"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-11 pr-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-bold text-slate-900">
                  Filtrar vagas cadastradas
                </p>

                <div className="flex flex-wrap gap-3">
                  {filtros.map((filtro) => {
                    const estaSelecionado = filtroSelecionado === filtro;

                    return (
                      <button
                        key={filtro}
                        type="button"
                        onClick={() => setFiltroSelecionado(filtro)}
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
                      vaga
                      {vagasFiltradas.length !== 1 ? "s" : ""} cadastrada
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

          {vagasFiltradas.length > 0 ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {vagasFiltradas.map((vaga) => (
                <VagaCard key={vaga.id} vaga={vaga} />
              ))}
            </div>
          ) : (
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

function filtrarPorTipo(vaga: (typeof vagas)[number], filtro: string) {
  const escolaridade = normalizar(vaga.escolaridade);
  const experiencia = normalizar(vaga.experiencia);
  const categoria = normalizar(vaga.categoria);
  const titulo = normalizar(vaga.titulo);
  const requisitos = normalizar(vaga.requisitos.join(" "));

  if (filtro === "Todas") {
    return true;
  }

  if (filtro === "Sem experiência") {
    return (
      experiencia.includes("sem experiencia") ||
      experiencia.includes("nao e necessario") ||
      experiencia.includes("nao necessita") ||
      experiencia.includes("nao exige") ||
      requisitos.includes("sem experiencia") ||
      requisitos.includes("nao e necessario") ||
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

  return (
    categoria.includes(normalizar(filtro)) || titulo.includes(normalizar(filtro))
  );
}

function normalizar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}