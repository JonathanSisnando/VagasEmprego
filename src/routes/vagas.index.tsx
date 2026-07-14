import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useCallback } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { AntiFraudNotice } from "@/components/site/AntiFraudNotice";
import { aplicarFiltro, FiltrosVagas } from "@/components/site/FiltrosVagas";
import { FonteResumoCard } from "@/components/site/FonteResumoCard";
import { SiteLayout } from "@/components/site/SiteLayout";
import { VagaCard, VagaCardSkeleton } from "@/components/site/VagaCard";
import { useVagasSetemp, useVagasSine, useVagasUnificadas } from "@/lib/vagas-hooks";
import type { FiltroRapido } from "@/lib/vagas-types";

const ITENS_POR_PAGINA = 10;

export const Route = createFileRoute("/vagas/")({
  head: () => ({
    meta: [
      { title: "Vagas de emprego em Manaus — Vagas Manaus Hoje" },
      {
        name: "description",
        content:
          "Vagas do Sine Manaus e SETEMP filtráveis por bairro, categoria, PCD, ensino médio e sem experiência.",
      },
      { property: "og:title", content: "Vagas de emprego em Manaus" },
      {
        property: "og:description",
        content: "Vagas atualizadas todos os dias do Sine Manaus e SETEMP.",
      },
    ],
  }),
  component: VagasPage,
});

function VagasPage() {
  const [filtro, setFiltro] = useState<FiltroRapido>("Todas");
  const [bairro, setBairro] = useState<string>("");
  const [openCardId, setOpenCardId] = useState<string | null>(null);
  const [itensVisiveis, setItensVisiveis] = useState(ITENS_POR_PAGINA);

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

  const vagasVisiveis = useMemo(() => filtradas.slice(0, itensVisiveis), [filtradas, itensVisiveis]);
  const temMaisVagas = itensVisiveis < filtradas.length;

  const handleFiltroChange = useCallback(
    (novoFiltro: FiltroRapido) => {
      setFiltro(novoFiltro);
      setItensVisiveis(ITENS_POR_PAGINA);
      setOpenCardId(null);
    },
    [],
  );

  const handleBairroChange = useCallback(
    (novoBairro: string) => {
      setBairro(novoBairro);
      setItensVisiveis(ITENS_POR_PAGINA);
      setOpenCardId(null);
    },
    [],
  );

  const handleCarregarMais = useCallback(() => {
    setItensVisiveis((prev) => prev + ITENS_POR_PAGINA);
  }, []);

  const handleLimparFiltros = useCallback(() => {
    setFiltro("Todas");
    setBairro("");
    setItensVisiveis(ITENS_POR_PAGINA);
    setOpenCardId(null);
  }, []);

  return (
    <SiteLayout>
      <header className="border-b border-black/5 bg-white px-4 py-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-2xl font-black tracking-tight md:text-3xl font-mono uppercase">
            Vagas <span className="text-primary">Manaus</span> Hoje
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Duas fontes oficiais, um só lugar. Cada card leva ao canal correto de candidatura.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <FonteResumoCard
              titulo="Sine"
              resumo={sine.data?.resumo}
              loading={sine.isLoading}
              erro={sine.isError}
            />
            <FonteResumoCard
              titulo="Setemp"
              resumo={setemp.data?.resumo}
              loading={setemp.isLoading}
              erro={setemp.isError}
            />
          </div>
        </div>
      </header>

      <div className="border-b border-black/5 bg-background px-4 py-4">
        <div className="mx-auto max-w-5xl space-y-3">
          <div className="relative">
            <select
              id="bairro"
              value={bairro}
              onChange={(e) => handleBairroChange(e.target.value)}
              className="w-full appearance-none rounded-sm border border-black/10 bg-white px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Todos os bairros</option>
              {bairros.filter(Boolean).map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
          </div>

          <FiltrosVagas ativo={filtro} onChange={handleFiltroChange} total={filtradas.length} />

          {(filtro !== "Todas" || bairro) && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleLimparFiltros}
                className="text-xs font-bold text-primary font-mono uppercase tracking-wider"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      </div>

      <section className="px-4 pt-6">
        <div className="mx-auto max-w-5xl space-y-4">
          {isLoading && vagasVisiveis.length === 0 ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <VagaCardSkeleton key={i} />
              ))}
            </div>
          ) : filtradas.length === 0 ? (
            <div className="border border-dashed border-black/10 bg-white p-8 text-center">
              <p className="text-lg font-extrabold font-mono uppercase">
                Nenhuma vaga com esse filtro
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Tente limpar os filtros ou trocar de bairro.
              </p>
              <button
                type="button"
                onClick={handleLimparFiltros}
                className="mt-4 rounded-sm bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {vagasVisiveis.map((v) => (
                  <VagaCard
                    key={v.id}
                    vaga={v}
                    isOpen={openCardId === v.id}
                    onToggle={() => setOpenCardId(openCardId === v.id ? null : v.id)}
                  />
                ))}
              </div>

              {temMaisVagas && (
                <button
                  type="button"
                  onClick={handleCarregarMais}
                  className="flex w-full items-center justify-center gap-2 rounded-sm border border-dashed border-muted-foreground py-3 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:bg-white font-mono"
                >
                  <ChevronDown className="size-4" />
                  Carregar mais ({filtradas.length - itensVisiveis} restantes)
                </button>
              )}

              {!temMaisVagas && filtradas.length > ITENS_POR_PAGINA && (
                <p className="text-center text-xs text-muted-foreground font-mono">
                  Todas as {filtradas.length} vagas foram carregadas
                </p>
              )}
            </>
          )}

          <div className="pt-6">
            <AntiFraudNotice />
          </div>

          <p className="pb-2 pt-4 text-center text-xs text-muted-foreground">
            Fontes oficiais:{" "}
            <Link to="/sobre" className="underline">
              saiba de onde vêm as vagas
            </Link>
            .
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
