import { Link } from "@tanstack/react-router";

import type { Vaga } from "@/lib/vagas-types";

import { fonteCurta, isFromSetemp, isFromSine, VagaBadges } from "./VagaBadges";

function tempoRelativo(data: string): string {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const d = new Date(data);
  d.setHours(0, 0, 0, 0);
  const diff = Math.round((hoje.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diff <= 0) return "Hoje";
  if (diff === 1) return "Ontem";
  if (diff < 7) return `Há ${diff} dias`;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

export function VagaCard({ vaga }: { vaga: Vaga }) {
  const sine = isFromSine(vaga);
  const setemp = isFromSetemp(vaga);
  const borda = sine ? "border-l-primary" : setemp ? "border-l-slate-300" : "border-l-slate-300";

  return (
    <Link
      to="/vagas/$slug"
      params={{ slug: vaga.slug }}
      className={`animate-slide-up block border-y border-r border-black/5 bg-white p-4 transition-colors hover:bg-[#fafbfc] active:bg-[#f1f5f9] border-l-4 ${borda}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className={`text-[10px] font-bold uppercase tracking-wider font-mono ${sine ? "text-primary" : "text-muted-foreground"}`}>
          {fonteCurta(vaga)}
        </span>
        <span className="text-[10px] font-mono text-muted-foreground">
          {tempoRelativo(vaga.dataPublicacao)}
        </span>
      </div>

      <h3 className="mt-1 text-base font-semibold leading-tight text-foreground">
        {vaga.titulo}
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">
        {vaga.empresa} • {vaga.bairro && vaga.bairro !== "Não informado" ? vaga.bairro : `${vaga.cidade}, ${vaga.estado}`}
      </p>

      <div className="mt-3">
        <VagaBadges vaga={vaga} />
      </div>
    </Link>
  );
}

export function VagaCardSkeleton() {
  return (
    <div className="border-y border-r border-l-4 border-l-slate-200 border-black/5 bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="h-3 w-12 rounded bg-slate-100" />
        <div className="h-3 w-14 rounded bg-slate-100" />
      </div>
      <div className="mt-2 h-5 w-3/4 rounded bg-slate-100" />
      <div className="mt-2 h-3.5 w-1/2 rounded bg-slate-100" />
      <div className="mt-3 flex gap-2">
        <div className="h-5 w-20 rounded bg-slate-100" />
        <div className="h-5 w-16 rounded bg-slate-100" />
      </div>
    </div>
  );
}
