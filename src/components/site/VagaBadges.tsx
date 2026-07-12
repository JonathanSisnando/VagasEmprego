import type { Vaga } from "@/lib/vagas-types";

function isFromSine(v: Vaga) {
  return v.fonte.toLowerCase().includes("sine");
}
function isFromSetemp(v: Vaga) {
  return v.fonte.toLowerCase().includes("setemp") || v.fonte.toLowerCase().includes("portal do trabalhador");
}

export function fonteCurta(v: Vaga): string {
  if (isFromSine(v)) return "Sine Manaus";
  if (isFromSetemp(v)) return "SETEMP";
  return v.fonte;
}

export function VagaBadges({ vaga }: { vaga: Vaga }) {
  const sine = isFromSine(vaga);
  const setemp = isFromSetemp(vaga);
  const semExperiencia = /não|nao|sem/i.test(vaga.experiencia);
  const ensinoMedio = /médio|medio/i.test(vaga.escolaridade);
  const ensinoFundamental = /fundamental/i.test(vaga.escolaridade);

  return (
    <div className="flex flex-wrap gap-1.5">
      {sine ? (
        <span className="rounded bg-sine/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sine">
          Sine Manaus
        </span>
      ) : null}
      {setemp ? (
        <span className="rounded bg-setemp/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-setemp">
          SETEMP
        </span>
      ) : null}
      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
        {vaga.categoria}
      </span>
      {vaga.quantidadeVagas && vaga.quantidadeVagas > 1 ? (
        <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
          {vaga.quantidadeVagas} vagas
        </span>
      ) : null}
      {vaga.pcd ? (
        <span className="rounded bg-pcd px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-pcd-foreground">
          Vaga PCD
        </span>
      ) : null}
      {semExperiencia ? (
        <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
          Sem experiência
        </span>
      ) : null}
      {ensinoMedio ? (
        <span className="rounded bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
          Ensino médio
        </span>
      ) : null}
      {ensinoFundamental ? (
        <span className="rounded bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
          Ensino fundamental
        </span>
      ) : null}
    </div>
  );
}