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
      <div className="border border-black/5 bg-white p-3 rounded-sm">
        <p className="mb-1 text-[10px] font-bold uppercase text-muted-foreground font-mono">{titulo}</p>
        <div className="h-7 w-16 animate-pulse rounded bg-slate-100" />
        <div className="mt-2 h-1 w-full bg-slate-100" />
      </div>
    );
  }
  if (erro || !resumo) {
    return (
      <div className="border border-alert/30 bg-alert/5 p-3 rounded-sm">
        <p className="mb-1 text-[10px] font-bold uppercase text-alert font-mono">{titulo}</p>
        <p className="text-sm font-bold text-alert">Falha ao carregar</p>
        <div className="mt-2 h-1 w-full bg-alert/20" />
      </div>
    );
  }
  const declarado = resumo.totalDeclarado;
  const importado = resumo.totalImportado;
  const percentual = declarado && declarado > 0 ? Math.min(100, Math.round((importado / declarado) * 100)) : 100;

  return (
    <div className="border border-black/5 bg-white p-3 rounded-sm">
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-mono">
        Fonte: {titulo}
      </p>
      <p className="mt-1 text-2xl font-bold text-foreground font-mono">
        {importado}
      </p>
      <div className="mt-2 h-1 w-full bg-[#e8ecf1]">
        <div
          className="h-1 bg-primary"
          style={{ width: `${percentual}%` }}
        />
      </div>
    </div>
  );
}
