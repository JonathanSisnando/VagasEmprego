"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  GraduationCap,
  MapPin,
  Timer,
} from "lucide-react";
import type { Vaga } from "../data/vagas";
import { normalizar, formatarData } from "../lib/vaga-utils";

type VagaCardProps = {
  vaga: Vaga;
};

export function VagaCard({ vaga }: VagaCardProps) {
  const [expandido, setExpandido] = useState(false);

  const ehVagaSine =
    String(vaga.id).startsWith("sine-") ||
    normalizar(vaga.fonte).includes("sine manaus");

  const ehVagaSetemp =
    String(vaga.id).startsWith("setemp-") ||
    normalizar(vaga.fonte).includes("setemp");

  const bairroInformado =
    vaga.bairro && normalizar(vaga.bairro) !== "nao informado";

  const semExperiencia =
    normalizar(vaga.experiencia).includes("nao e necessario") ||
    normalizar(vaga.experiencia).includes("sem experiencia") ||
    normalizar(vaga.experiencia).includes("nao exige") ||
    normalizar(vaga.experiencia).includes("nao necessita");

  const ensinoMedio = normalizar(vaga.escolaridade).includes("ensino medio");

  const quantidadeVagas = vaga.quantidadeVagas ?? 1;

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-blue-200 md:hover:-translate-y-1 md:hover:shadow-lg">
      <button
        type="button"
        onClick={() => setExpandido((v) => !v)}
        className="flex w-full flex-col p-6 text-left md:cursor-default"
      >
        <div className="flex flex-wrap items-center gap-2">
          {ehVagaSine && (
            <span className="rounded-full bg-blue-700 px-3 py-1 text-xs font-black text-white">
              Sine Manaus
            </span>
          )}

          {ehVagaSetemp && (
            <span className="rounded-full bg-blue-700 px-3 py-1 text-xs font-black text-white">
              SETEMP
            </span>
          )}

          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
            {vaga.categoria}
          </span>

          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            {quantidadeVagas} vaga{quantidadeVagas > 1 ? "s" : ""}
          </span>

          {vaga.pcd && (
            <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700">
              PCD
            </span>
          )}

          {semExperiencia && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
              Sem experiência
            </span>
          )}

          {ensinoMedio && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
              Ensino médio
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <h2 className="text-xl font-black leading-tight text-slate-950 md:group-hover:text-blue-700">
            {vaga.titulo}
          </h2>

          <ChevronDown
            className={`size-5 shrink-0 text-slate-400 transition md:hidden ${
              expandido ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        </div>

        <p className="mt-1 text-sm font-medium text-slate-500">
          {ehVagaSine
            ? "Prefeitura de Manaus - Sine Manaus"
            : ehVagaSetemp
              ? "SETEMP / Portal do Trabalhador"
              : vaga.empresa}
        </p>
      </button>

      <div
        className={`overflow-hidden transition-all md:!max-h-none md:!opacity-100 ${
          expandido ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-6">
          {ehVagaSine && (
            <div className="mb-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-sm font-bold text-blue-900">
                Cadastro: presencial no Sine Manaus
              </p>
            </div>
          )}

          {ehVagaSetemp && (
            <div className="mb-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-sm font-bold text-blue-900">
                Cadastro: on-line pelo Portal do Trabalhador
              </p>
            </div>
          )}

          <div className="space-y-2.5 text-sm text-slate-700">
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-slate-400" aria-hidden="true" />
              <span>
                {vaga.cidade}/{vaga.estado}
                {bairroInformado ? ` — ${vaga.bairro}` : ""}
              </span>
            </p>

            <p className="flex items-start gap-2">
              <GraduationCap className="mt-0.5 size-4 shrink-0 text-slate-400" aria-hidden="true" />
              <span>{vaga.escolaridade}</span>
            </p>

            <p className="flex items-start gap-2">
              <Timer className="mt-0.5 size-4 shrink-0 text-slate-400" aria-hidden="true" />
              <span>{vaga.experiencia}</span>
            </p>

            <p className="flex items-start gap-2">
              <CalendarDays className="mt-0.5 size-4 shrink-0 text-slate-400" aria-hidden="true" />
              <span>Publicado em {formatarData(vaga.dataPublicacao)}</span>
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {vaga.modalidade && (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                {vaga.modalidade}
              </span>
            )}

            {vaga.tipoContrato && vaga.tipoContrato !== "Não informado" && (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                {vaga.tipoContrato}
              </span>
            )}

            {ehVagaSine && (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                Fonte oficial
              </span>
            )}
          </div>

          <Link
            href={`/vagas/${vaga.slug}`}
            className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-800"
          >
            Ver detalhes da vaga
          </Link>
        </div>
      </div>
    </article>
  );
}

