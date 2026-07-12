import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ClipboardList, MessageCircle, Search } from "lucide-react";

import { CurriculoCTA } from "@/components/site/CurriculoCTA";
import { FonteResumoCard } from "@/components/site/FonteResumoCard";
import { SiteLayout } from "@/components/site/SiteLayout";
import { VagaCard, VagaCardSkeleton } from "@/components/site/VagaCard";
import { useVagasSetemp, useVagasSine, useVagasUnificadas } from "@/lib/vagas-hooks";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const sine = useVagasSine();
  const setemp = useVagasSetemp();
  const { vagas, isLoading } = useVagasUnificadas();
  const destaques = vagas.slice(0, 4);
  const hoje = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
  });

  return (
    <SiteLayout>
      {/* Hero */}
      <header className="animate-slide-up border-b border-black/5 bg-white px-4 py-8 md:py-14">
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary">
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
            Atualizado em {hoje}
          </p>
          <h1 className="max-w-2xl text-balance text-3xl font-black leading-tight tracking-tight md:text-5xl">
            Emprego de verdade em Manaus, sem complicação.
          </h1>
          <p className="mt-3 max-w-xl text-pretty text-sm text-muted-foreground md:text-base">
            Reunimos as vagas do <strong>Sine Manaus</strong> e da{" "}
            <strong>SETEMP</strong> em um só lugar. Gratuito, direto, sem
            cadastro.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
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

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/vagas"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-black text-primary-foreground shadow-sm"
            >
              Ver vagas de hoje <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              to="/adaptar-curriculo"
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-black/10 bg-white px-5 text-sm font-bold text-foreground"
            >
              Montar meu currículo
            </Link>
          </div>
        </div>
      </header>

      {/* Como funciona */}
      <section className="px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-lg font-extrabold">Como funciona</h2>
          <ol className="mt-4 grid gap-3 md:grid-cols-3">
            {[
              { icon: Search, t: "1. Encontre a vaga", d: "Filtre por bairro, categoria ou requisitos e escolha a que combina." },
              { icon: ClipboardList, t: "2. Prepare seu currículo", d: "Já tem? Ótimo. Se não, montamos por WhatsApp a partir de R$ 7." },
              { icon: MessageCircle, t: "3. Candidate-se", d: "Cada vaga leva ao canal oficial: Sine, SETEMP ou empresa." },
            ].map((s) => (
              <li key={s.t} className="rounded-2xl border border-black/5 bg-white p-4">
                <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <s.icon className="size-5" aria-hidden />
                </div>
                <p className="mt-3 font-bold">{s.t}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Destaques */}
      <section className="px-4">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-end justify-between">
            <h2 className="text-lg font-extrabold">Vagas em destaque</h2>
            <Link to="/vagas" className="text-sm font-bold text-primary hover:underline">
              Ver todas →
            </Link>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {isLoading && destaques.length === 0
              ? Array.from({ length: 4 }).map((_, i) => <VagaCardSkeleton key={i} />)
              : destaques.map((v) => <VagaCard key={v.id} vaga={v} />)}
          </div>
        </div>
      </section>

      {/* CTA currículo */}
      <section className="mt-10 px-4">
        <div className="mx-auto max-w-5xl">
          <CurriculoCTA />
        </div>
      </section>
    </SiteLayout>
  );
}
