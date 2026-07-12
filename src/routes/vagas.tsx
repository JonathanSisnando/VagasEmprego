import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MapPin } from "lucide-react";

import { AntiFraudNotice } from "@/components/site/AntiFraudNotice";
import { aplicarFiltro, FiltrosVagas } from "@/components/site/FiltrosVagas";
import { FonteResumoCard } from "@/components/site/FonteResumoCard";
import { SiteLayout } from "@/components/site/SiteLayout";
import { VagaCard, VagaCardSkeleton } from "@/components/site/VagaCard";
import { useVagasSetemp, useVagasSine, useVagasUnificadas } from "@/lib/vagas-hooks";
import type { FiltroRapido } from "@/lib/vagas-types";

export const Route = createFileRoute("/vagas")({
  head: () => ({
    meta: [
      { title: "Vagas de emprego em Manaus — Vagas Manaus Hoje" },
      { name: "description", content: "Vagas do Sine Manaus e SETEMP filtráveis por bairro, categoria, PCD, ensino médio e sem experiência." },
      { property: "og:title", content: "Vagas de emprego em Manaus" },
      { property: "og:description", content: "Vagas atualizadas todos os dias do Sine Manaus e SETEMP." },
    ],
  }),
  component: VagasPage,
});

function VagasPage() {
  const [filtro, setFiltro] = useState<FiltroRapido>("Todas");
  const [bairro, setBairro] = useState<string>("");

  const { vagas, isLoading } = useVagasUnificadas();
  const sine = useVagasSine();
  const setemp = useVagasSetemp();

  const bairros = useMemo(() => {
    const set = new Set(vagas.map((v) => v.bairro).filter(Boolean));
    return ["", ...Array.from(set).sort()];
  }, [vagas]);

  const filtradas = useMemo(() => {
    let list = aplicarFiltro(vagas, filtro);
    if (bairro) list = list.filter((v) => v.bairro === bairro);
    return list;
  }, [vagas, filtro, bairro]);

  return (
    <SiteLayout>
      <header className="border-b border-black/5 bg-white px-4 py-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-2xl font-black tracking-tight md:text-3xl">
            Todas as vagas em Manaus
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Duas fontes oficiais, um só lugar. Cada card leva ao canal correto
            de candidatura.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <FonteResumoCard
              titulo="Sine Manaus"
              resumo={sine.data?.resumo}
              loading={sine.isLoading}
              erro={sine.isError}
            />
            <FonteResumoCard
              titulo="SETEMP / AM"
              resumo={setemp.data?.resumo}
              loading={setemp.isLoading}
              erro={setemp.isError}
            />
          </div>
        </div>
      </header>

      <div className="sticky top-14 z-30 border-b border-black/5 bg-background/95 py-3 backdrop-blur-md">
        <div className="mx-auto max-w-5xl">
          <FiltrosVagas ativo={filtro} onChange={setFiltro} total={filtradas.length} />
          <div className="mt-2 flex items-center gap-2 px-4">
            <label htmlFor="bairro" className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <MapPin className="size-3.5" aria-hidden /> Bairro
            </label>
            <select
              id="bairro"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
              className="flex-1 rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-medium"
            >
              <option value="">Todos os bairros</option>
              {bairros.filter(Boolean).map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            {(filtro !== "Todas" || bairro) && (
              <button
                type="button"
                onClick={() => { setFiltro("Todas"); setBairro(""); }}
                className="text-xs font-bold text-primary"
              >
                Limpar
              </button>
            )}
          </div>
        </div>
      </div>

      <section className="px-4 pt-6">
        <div className="mx-auto max-w-5xl space-y-4">
          {isLoading && filtradas.length === 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => <VagaCardSkeleton key={i} />)}
            </div>
          ) : filtradas.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-black/10 bg-white p-8 text-center">
              <p className="text-lg font-extrabold">Nenhuma vaga com esse filtro</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Tente limpar os filtros ou trocar de bairro.
              </p>
              <button
                type="button"
                onClick={() => { setFiltro("Todas"); setBairro(""); }}
                className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filtradas.map((v) => <VagaCard key={v.id} vaga={v} />)}
            </div>
          )}

          <div className="pt-6">
            <AntiFraudNotice />
          </div>

          <p className="pb-2 pt-4 text-center text-xs text-muted-foreground">
            Fontes oficiais:{" "}
            <Link to="/sobre" className="underline">saiba de onde vêm as vagas</Link>.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}