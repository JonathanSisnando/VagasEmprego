import type { FonteResumo } from "@/lib/vagas-types";

export function FonteResumoCard({
  titulo,
  resumo,
  loading,
  erro,
}: {
  titulo: string;
  resumo?: FonteResumo;
  loading?: boolean;
  erro?: boolean;
}) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-black/5 bg-slate-50 p-4">
        <p className="mb-1 font-mono text-[10px] uppercase text-slate-500">{titulo}</p>
        <div className="h-7 w-16 animate-pulse rounded bg-slate-200" />
        <div className="mt-2 h-3 w-24 animate-pulse rounded bg-slate-200" />
      </div>
    );
  }
  if (erro || !resumo) {
    return (
      <div className="rounded-2xl border border-alert/30 bg-alert/5 p-4">
        <p className="mb-1 font-mono text-[10px] uppercase text-alert">{titulo}</p>
        <p className="text-sm font-bold text-alert">Falha ao carregar</p>
        <p className="mt-1 text-[11px] text-alert/80">Tente novamente em instantes.</p>
      </div>
    );
  }
  const declarado = resumo.totalDeclarado;
  const importado = resumo.totalImportado;
  const divergencia =
    declarado !== null && declarado !== importado ? declarado - importado : 0;
  return (
    <div className="rounded-2xl border border-black/5 bg-slate-50 p-4">
      <p className="mb-1 font-mono text-[10px] uppercase text-slate-500">{titulo}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-black">{importado}</span>
        <span className="text-xs text-slate-400">vagas importadas</span>
      </div>
      <p className="mt-2 text-[11px] italic text-slate-500">
        {declarado !== null
          ? divergencia > 0
            ? `Boletim oficial declara ${declarado} · ${divergencia} sem dados estruturados`
            : `Total confere com boletim oficial (${declarado})`
          : "Total oficial não informado"}
      </p>
    </div>
  );
}