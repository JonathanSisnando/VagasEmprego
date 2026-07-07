"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { vagas } from "../data/vagas";
import type { Vaga } from "../data/vagas";

type RespostaSine = {
  totalImportado?: number;
  totalDeclaradoNoticia?: number | null;
  totalCargos?: number;
  vagas: Vaga[];
  erro?: string;
};

type Destaque = {
  id: string;
  titulo: string;
  quantidadeVagas: number;
};

export function ResumoVagasSineHome() {
  const [totalCargos, setTotalCargos] = useState(0);
  const [totalOficial, setTotalOficial] = useState(0);
  const [destaques, setDestaques] = useState<Destaque[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    async function carregarResumo() {
      try {
        const resposta = await fetch("/api/vagas-sine");

        if (!resposta.ok) {
          throw new Error("Erro ao buscar vagas do Sine Manaus.");
        }

        const dados = (await resposta.json()) as RespostaSine;

        if (dados.erro) {
          throw new Error(dados.erro);
        }

        const vagasSine = dados.vagas ?? [];

        setTotalCargos(dados.totalCargos ?? vagasSine.length);
        setTotalOficial(dados.totalDeclaradoNoticia ?? dados.totalImportado ?? 0);

        const destaquesCalculados = [...vagasSine]
          .filter((vaga) => (vaga.quantidadeVagas ?? 0) > 1)
          .sort((a, b) => (b.quantidadeVagas ?? 0) - (a.quantidadeVagas ?? 0))
          .slice(0, 3)
          .map((vaga) => ({
            id: String(vaga.id),
            titulo: vaga.titulo,
            quantidadeVagas: vaga.quantidadeVagas ?? 1,
          }));

        setDestaques(destaquesCalculados);
      } catch (error) {
        console.error(error);
        setErro(true);
      } finally {
        setCarregando(false);
      }
    }

    carregarResumo();
  }, []);

  const totalCadastradas = useMemo(() => vagas.length, []);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-black uppercase tracking-wide text-blue-700">
        Resumo das vagas
      </p>

      <h2 className="mt-1 text-2xl font-black text-slate-950">
        Consulte as oportunidades disponíveis hoje
      </h2>

      <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
        <p className="text-sm leading-6 text-slate-600">
          {carregando && (
            <>
              Carregando vagas do Sine Manaus e exibindo{" "}
              <span className="font-black text-slate-950">
                {totalCadastradas}
              </span>{" "}
              vagas cadastradas na plataforma.
            </>
          )}

          {erro && (
            <>
              Não foi possível contar as vagas do Sine Manaus no momento.
              Exibindo{" "}
              <span className="font-black text-slate-950">
                {totalCadastradas}
              </span>{" "}
              vagas cadastradas na plataforma.
            </>
          )}

          {!carregando && !erro && (
            <>
              Exibindo{" "}
              <span className="font-black text-slate-950">
                {totalCargos}
              </span>{" "}
              cargos do Sine Manaus,{" "}
              <span className="font-black text-slate-950">
                {totalOficial}
              </span>{" "}
              vagas oficiais divulgadas e{" "}
              <span className="font-black text-slate-950">
                {totalCadastradas}
              </span>{" "}
              vagas cadastradas na plataforma.
            </>
          )}
        </p>
      </div>

      {carregando && (
        <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <p className="text-sm font-semibold text-slate-600">
            Carregando vagas em destaque...
          </p>
        </div>
      )}

      {!carregando && destaques.length > 0 && (
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {destaques.map((destaque) => (
            <Link
              key={destaque.id}
              href="/vagas"
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
            </Link>
          ))}
        </div>
      )}

      <Link
        href="/vagas"
        className="mt-5 inline-flex w-fit items-center justify-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-blue-800"
      >
        Ver todas as vagas do Sine Manaus
      </Link>
    </div>
  );
}
