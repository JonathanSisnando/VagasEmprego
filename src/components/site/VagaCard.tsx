import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";

import type { Vaga } from "@/lib/vagas-types";

import { VagaBadges } from "./VagaBadges";

export function VagaCard({ vaga }: { vaga: Vaga }) {
  return (
    <article className="animate-slide-up rounded-3xl border border-black/5 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <VagaBadges vaga={vaga} />

      <h3 className="mt-3 text-lg font-extrabold leading-tight text-foreground">
        {vaga.titulo}
      </h3>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
        <MapPin className="size-3.5" aria-hidden />
        {vaga.bairro && vaga.bairro !== "Não informado"
          ? `${vaga.bairro} · ${vaga.cidade}, ${vaga.estado}`
          : `${vaga.cidade}, ${vaga.estado}`}
      </p>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-[13px]">
        <div className="flex flex-col">
          <dt className="text-[11px] text-slate-400">Escolaridade</dt>
          <dd className="font-medium">{vaga.escolaridade}</dd>
        </div>
        <div className="flex flex-col">
          <dt className="text-[11px] text-slate-400">Experiência</dt>
          <dd className="font-medium">{vaga.experiencia}</dd>
        </div>
        {vaga.salario && vaga.salario !== "Não informado" ? (
          <div className="flex flex-col">
            <dt className="text-[11px] text-slate-400">Salário</dt>
            <dd className="font-medium">{vaga.salario}</dd>
          </div>
        ) : null}
        {vaga.modalidade ? (
          <div className="flex flex-col">
            <dt className="text-[11px] text-slate-400">Modalidade</dt>
            <dd className="font-medium">{vaga.modalidade}</dd>
          </div>
        ) : null}
      </dl>

      <Link
        to="/vagas/$slug"
        params={{ slug: vaga.slug }}
        className="mt-5 flex h-11 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-foreground transition-colors hover:bg-slate-200"
      >
        Ver detalhes e candidatar
      </Link>
    </article>
  );
}

export function VagaCardSkeleton() {
  return (
    <div className="rounded-3xl border border-black/5 bg-white p-5">
      <div className="flex gap-1.5">
        <div className="h-4 w-16 rounded bg-slate-100" />
        <div className="h-4 w-14 rounded bg-slate-100" />
      </div>
      <div className="mt-3 h-5 w-3/4 rounded bg-slate-100" />
      <div className="mt-2 h-4 w-1/2 rounded bg-slate-100" />
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="h-8 rounded bg-slate-50" />
        <div className="h-8 rounded bg-slate-50" />
      </div>
      <div className="mt-5 h-11 rounded-xl bg-slate-100" />
    </div>
  );
}