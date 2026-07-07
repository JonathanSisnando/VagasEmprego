"use client";

import { useEffect, useMemo, useState } from "react";
import type { Vaga } from "../data/vagas";
import { VagaCard } from "./VagaCard";
import { VagaCardSkeleton } from "./VagaCardSkeleton";

type RespostaFonteExterna = {
  fonte: string;
  total: number;
  totalImportado?: number;
  totalCargos?: number;
  vagas: Vaga[];
  erro?: string;
};

type VagasFonteExternaSectionProps = {
  apiEndpoint: string;
  idPrefix: string;
  eyebrow: string;
  titulo: string;
  descricao: string;
  linkFonteLabel?: string;
  linkFonteHref?: string;
};

const filtrosRapidos = [
  "Todas",
  "Sem experiência",
  "Ensino médio",
  "Ensino fundamental",
  "PCD",
];

export function VagasFonteExternaSection({
  apiEndpoint,
  idPrefix,
  eyebrow,
  titulo,
  descricao,
  linkFonteLabel,
  linkFonteHref,
}: VagasFonteExternaSectionProps) {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [fonte, setFonte] = useState("");
  const [totalImportado, setTotalImportado] = useState(0);
  const [totalCargos, setTotalCargos] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [quantidadeVisivel, setQuantidadeVisivel] = useState(12);

  const [busca, setBusca] = useState("");
  const [filtroSelecionado, setFiltroSelecionado] = useState("Todas");

  useEffect(() => {
    async function carregarVagas() {
      try {
        const resposta = await fetch(apiEndpoint);

        if (!resposta.ok) {
          throw new Error("Erro ao buscar vagas.");
        }

        const dados = (await resposta.json()) as RespostaFonteExterna;

        if (dados.erro) {
          throw new Error(dados.erro);
        }

        setVagas(dados.vagas ?? []);
        setFonte(dados.fonte);
        setTotalImportado(dados.totalImportado ?? dados.total ?? 0);
        setTotalCargos(dados.totalCargos ?? dados.vagas?.length ?? 0);
      } catch (error) {
        console.error(error);
        setErro(
          "Não foi possível carregar as vagas no momento. Tente novamente mais tarde."
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarVagas();
  }, [apiEndpoint]);

  const categorias = useMemo(() => {
    return Array.from(new Set(vagas.map((vaga) => vaga.categoria))).sort();
  }, [vagas]);

  const filtros = useMemo(() => {
    return [...filtrosRapidos, ...categorias];
  }, [categorias]);

  const vagasFiltradas = useMemo(() => {
    const termoBusca = normalizar(busca.trim());

    return vagas.filter((vaga) => {
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
  }, [busca, filtroSelecionado, vagas]);

  const vagasVisiveis = vagasFiltradas.slice(0, quantidadeVisivel);
  const aindaTemMais = quantidadeVisivel < vagasFiltradas.length;

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
            {eyebrow}
          </p>

          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
            {titulo}
          </h2>

          <p className="mt-3 max-w-3xl leading-7 text-slate-600">
            {descricao}
          </p>
        </div>

        {linkFonteHref && (
          <a
            href={linkFonteHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center justify-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-blue-800"
          >
            {linkFonteLabel ?? "Ver fonte oficial"}
          </a>
        )}
      </div>

      {!carregando && !erro && vagas.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2 text-sm font-semibold text-slate-700">
          <span className="rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
            {totalImportado} vagas oficiais
          </span>

          <span className="rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
            {totalCargos} cargos organizados
          </span>
        </div>
      )}

      {carregando && (
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, indice) => (
            <VagaCardSkeleton key={indice} />
          ))}
        </div>
      )}

      {erro && (
        <div className="mt-6 rounded-3xl border border-red-100 bg-red-50 p-8 text-center">
          <h3 className="text-xl font-black text-red-800">
            Erro ao carregar vagas
          </h3>

          <p className="mt-3 text-red-700">{erro}</p>
        </div>
      )}

      {!carregando && !erro && vagas.length > 0 && (
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div>
            <label
              htmlFor={`busca-${idPrefix}`}
              className="mb-2 block text-sm font-bold text-slate-900"
            >
              Buscar nas vagas
            </label>

            <input
              id={`busca-${idPrefix}`}
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
              Filtrar vagas
            </p>

            <div className="flex flex-wrap gap-3">
              {filtros.map((filtro) => {
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
                  cargos
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

      {!carregando && !erro && vagas.length === 0 && (
        <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <h3 className="text-xl font-black text-slate-950">
            Nenhuma vaga encontrada nesta fonte
          </h3>

          <p className="mt-3 text-slate-600">
            Não conseguimos importar vagas desta fonte no momento.
          </p>
        </div>
      )}

      {!carregando &&
        !erro &&
        vagas.length > 0 &&
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
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {vagasVisiveis.map((vaga) => (
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
                Mostrar mais vagas
              </button>
            </div>
          )}
        </>
      )}

      {!carregando && !erro && fonte && (
        <div className="mt-10 rounded-3xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm leading-6 text-amber-900">
            <strong>Aviso importante:</strong> as vagas são gratuitas. Nunca
            pague para se candidatar, fazer cadastro, treinamento ou garantir
            contratação. Confirme sempre as orientações na fonte oficial (
            {fonte}).
          </p>
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

  if (filtro === "Sem experiência") {
    return (
      experiencia.includes("sem experiencia") ||
      experiencia.includes("nao e necessario") ||
      experiencia.includes("nao necessario") ||
      experiencia.includes("nao necessita") ||
      experiencia.includes("nao exige") ||
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

  return (
    categoria === normalizar(filtro) || titulo.includes(normalizar(filtro))
  );
}

function normalizar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}
