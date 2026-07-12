import type { Vaga } from "@/lib/vagas-types";

export function VagaBadges({ vaga }: { vaga: Vaga }) {
  const semExperiencia = /não|nao|sem/i.test(vaga.experiencia);
  const ensinoMedio = /médio|medio/i.test(vaga.escolaridade);
  const ensinoFundamental = /fundamental/i.test(vaga.escolaridade);

  return (
    <div className="flex flex-wrap gap-2">
      <span className="bg-[#e8ecf1] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 font-mono rounded-sm">
        {vaga.categoria}
      </span>
      {vaga.quantidadeVagas && vaga.quantidadeVagas > 1 ? (
        <span className="bg-[#e8ecf1] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 font-mono rounded-sm">
          {vaga.quantidadeVagas} vagas
        </span>
      ) : null}
      {vaga.pcd ? (
        <span className="bg-[#e8ecf1] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 font-mono rounded-sm">
          PCD
        </span>
      ) : null}
      {semExperiencia ? (
        <span className="bg-[#e8ecf1] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 font-mono rounded-sm">
          Sem experiência
        </span>
      ) : null}
      {ensinoMedio ? (
        <span className="bg-[#e8ecf1] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 font-mono rounded-sm">
          Ensino médio
        </span>
      ) : null}
      {ensinoFundamental ? (
        <span className="bg-[#e8ecf1] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 font-mono rounded-sm">
          Ensino fundamental
        </span>
      ) : null}
      {vaga.salario && vaga.salario !== "Não informado" ? (
        <span className="bg-[#e8ecf1] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 font-mono rounded-sm">
          {vaga.salario}
        </span>
      ) : null}
    </div>
  );
}
