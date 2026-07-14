import { FILTROS_RAPIDOS, type FiltroRapido } from "@/lib/vagas-types";

export function FiltrosVagas({
  ativo,
  onChange,
  total,
}: {
  ativo: FiltroRapido;
  onChange: (f: FiltroRapido) => void;
  total: number;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between px-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-mono">
          Filtros rápidos
        </p>
        <p className="text-[10px] font-medium text-muted-foreground font-mono">
          {total} {total === 1 ? "vaga" : "vagas"}
        </p>
      </div>
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-2">
        {FILTROS_RAPIDOS.map((f) => {
          const on = f === ativo;
          return (
            <button
              key={f}
              type="button"
              onClick={() => onChange(f)}
              className={
                "shrink-0 rounded-sm border px-3 py-1.5 text-xs font-semibold transition-colors font-mono " +
                (on
                  ? "border-slate-800 bg-slate-800 text-white"
                  : "border-black/10 bg-white text-foreground hover:border-primary/30")
              }
            >
              {f}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function aplicarFiltro<
  T extends {
    categoria: string;
    experiencia: string;
    escolaridade: string;
    pcd?: boolean;
  },
>(vagas: T[], filtro: FiltroRapido): T[] {
  if (filtro === "Todas") return vagas;
  const norm = (s: string) => s.toLowerCase();
  switch (filtro) {
    case "PCD":
      return vagas.filter((v) => v.pcd);
    case "Sem experiência":
      return vagas.filter((v) => /não|nao|sem/i.test(v.experiencia));
    case "Ensino médio":
      return vagas.filter((v) => /médio|medio/i.test(v.escolaridade));
    case "Ensino fundamental":
      return vagas.filter((v) => /fundamental/i.test(v.escolaridade));
    case "Serviços gerais":
      return vagas.filter((v) => norm(v.categoria).includes("serviços gerais"));
    case "Atendimento":
      return vagas.filter((v) => /atendimento|comércio|comercio/i.test(v.categoria));
    default:
      return vagas.filter((v) => norm(v.categoria) === norm(filtro));
  }
}
