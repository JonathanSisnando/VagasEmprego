import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { ArrowRight, ExternalLink, Mail, MapPin, MessageCircle } from "lucide-react";

import { AntiFraudNotice } from "@/components/site/AntiFraudNotice";
import { CurriculoCTA } from "@/components/site/CurriculoCTA";
import { SiteLayout } from "@/components/site/SiteLayout";
import { StickyMobileCTA } from "@/components/site/StickyMobileCTA";
import { fonteCurta, VagaBadges } from "@/components/site/VagaBadges";
import { findVagaBySlug, useVagasUnificadas } from "@/lib/vagas-hooks";
import type { Vaga } from "@/lib/vagas-types";

export const Route = createFileRoute("/vagas/$slug")({
  component: VagaDetailPage,
});

type Candidatura = {
  href: string;
  label: string;
  hint: string;
  external: boolean;
  variant: "primary" | "whatsapp";
  icon: typeof ExternalLink;
};

function candidaturaFor(vaga: Vaga): Candidatura | null {
  const fonte = vaga.fonte.toLowerCase();
  // 1. Sine
  if (fonte.includes("sine")) {
    return {
      href: vaga.linkFonte,
      label: "Ver notícia oficial do Sine",
      hint: "A candidatura é presencial em qualquer posto do Sine Manaus. Leve documento oficial e currículo impresso.",
      external: true,
      variant: "primary",
      icon: ExternalLink,
    };
  }
  // 2. SETEMP
  if (fonte.includes("setemp") || fonte.includes("portal do trabalhador")) {
    return {
      href: vaga.linkFonte,
      label: "Candidatar-se no Portal do Trabalhador",
      hint: "Candidatura feita online. Você será redirecionado ao portal oficial da SETEMP.",
      external: true,
      variant: "primary",
      icon: ExternalLink,
    };
  }
  // 3. Outros: WhatsApp → e-mail → link fonte
  if (vaga.whatsappCandidatura) {
    const num = vaga.whatsappCandidatura.replace(/\D/g, "");
    const msg = encodeURIComponent(`Olá! Tenho interesse na vaga de ${vaga.titulo}.`);
    return {
      href: `https://wa.me/${num}?text=${msg}`,
      label: "Candidatar-se pelo WhatsApp",
      hint: "Você será direcionado ao WhatsApp da empresa.",
      external: true,
      variant: "whatsapp",
      icon: MessageCircle,
    };
  }
  if (vaga.emailCandidatura) {
    return {
      href: `mailto:${vaga.emailCandidatura}?subject=${encodeURIComponent(`Candidatura — ${vaga.titulo}`)}`,
      label: "Enviar currículo por e-mail",
      hint: "Anexe seu currículo em PDF.",
      external: false,
      variant: "primary",
      icon: Mail,
    };
  }
  if (vaga.linkFonte) {
    return {
      href: vaga.linkFonte,
      label: "Ver na fonte oficial",
      hint: "Instruções de candidatura estão na página oficial.",
      external: true,
      variant: "primary",
      icon: ExternalLink,
    };
  }
  return null;
}

function VagaDetailPage() {
  const { slug } = Route.useParams();
  const { vagas, isLoading } = useVagasUnificadas();
  const router = useRouter();

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-4 py-10">
          <div className="h-6 w-40 animate-pulse rounded bg-slate-200" />
          <div className="mt-4 h-8 w-3/4 animate-pulse rounded bg-slate-200" />
          <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-slate-200" />
        </div>
      </SiteLayout>
    );
  }

  const vaga = findVagaBySlug(vagas, slug);
  if (!vaga) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="text-2xl font-black">Vaga não encontrada</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Esta vaga pode ter sido preenchida ou removida.
          </p>
          <Link to="/vagas" className="mt-6 inline-block rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">
            Ver vagas de hoje
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const cand = candidaturaFor(vaga);
  const primaryClasses =
    cand?.variant === "whatsapp"
      ? "bg-whatsapp text-whatsapp-foreground shadow-lg shadow-whatsapp/25"
      : "bg-primary text-primary-foreground shadow-lg shadow-primary/25";

  return (
    <SiteLayout>
      <div className="mx-auto max-w-5xl px-4 py-6">
        <button
          type="button"
          onClick={() => router.history.back()}
          className="text-sm font-medium text-muted-foreground hover:text-primary"
        >
          ← Voltar
        </button>
      </div>

      <div className="mx-auto grid max-w-5xl gap-8 px-4 pb-40 md:grid-cols-[1fr_320px] md:pb-16">
        <article className="min-w-0">
          <VagaBadges vaga={vaga} />
          <h1 className="mt-3 text-2xl font-black leading-tight md:text-3xl">
            {vaga.titulo}
          </h1>
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            {vaga.empresa}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-4" aria-hidden />
            {vaga.bairro !== "Não informado" ? `${vaga.bairro} · ` : ""}
            {vaga.cidade}, {vaga.estado}
          </p>

          <div className="mt-6 rounded-2xl border border-black/5 bg-white p-5">
            <dl className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
              <Info label="Escolaridade" value={vaga.escolaridade} />
              <Info label="Experiência" value={vaga.experiencia} />
              <Info label="Salário" value={vaga.salario} />
              <Info label="Modalidade" value={vaga.modalidade ?? "—"} />
              <Info label="Tipo de contrato" value={vaga.tipoContrato ?? "—"} />
              <Info
                label="Quantidade"
                value={vaga.quantidadeVagas ? `${vaga.quantidadeVagas} vagas` : "—"}
              />
            </dl>
          </div>

          {vaga.descricao ? (
            <section className="mt-6">
              <h2 className="text-base font-extrabold">Descrição</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground/90">
                {vaga.descricao}
              </p>
            </section>
          ) : null}

          {vaga.requisitos?.length ? (
            <section className="mt-6">
              <h2 className="text-base font-extrabold">Requisitos</h2>
              <ul className="mt-2 space-y-1.5 text-sm">
                {vaga.requisitos.map((r) => (
                  <li key={r} className="flex gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                    {r}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {vaga.beneficios?.length ? (
            <section className="mt-6">
              <h2 className="text-base font-extrabold">Benefícios</h2>
              <ul className="mt-2 flex flex-wrap gap-2 text-sm">
                {vaga.beneficios.map((b) => (
                  <li key={b} className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                    {b}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="mt-6">
            <h2 className="text-base font-extrabold">Como se candidatar</h2>
            <p className="mt-2 text-sm text-muted-foreground">{vaga.comoSeCandidatar}</p>
          </section>

          <div className="mt-8">
            <AntiFraudNotice />
          </div>

          <div className="mt-6 rounded-2xl border border-black/5 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Fonte oficial
            </p>
            <p className="mt-1 text-sm font-bold">{fonteCurta(vaga)}</p>
            {vaga.linkFonte ? (
              <a
                href={vaga.linkFonte}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                Abrir página oficial <ExternalLink className="size-3.5" aria-hidden />
              </a>
            ) : null}
          </div>
        </article>

        <aside className="space-y-4 md:sticky md:top-20 md:self-start">
          {cand ? (
            <div className="rounded-2xl border border-black/5 bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Candidatura
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{cand.hint}</p>
              <a
                href={cand.href}
                target={cand.external ? "_blank" : undefined}
                rel={cand.external ? "noopener noreferrer" : undefined}
                data-analytics="cta-candidatura"
                data-fonte={fonteCurta(vaga)}
                className={`mt-4 flex h-12 items-center justify-center gap-2 rounded-xl px-4 text-sm font-black ${primaryClasses}`}
              >
                <cand.icon className="size-4" aria-hidden />
                {cand.label}
              </a>
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-warning bg-warning/10 p-5">
              <p className="text-sm font-bold text-warning">
                Forma de candidatura não informada nesta vaga.
              </p>
              <p className="mt-1 text-xs text-warning/90">
                Consulte a fonte oficial pelo link abaixo.
              </p>
            </div>
          )}

          <CurriculoCTA vagaTitulo={`${vaga.titulo} (${fonteCurta(vaga)})`} />
        </aside>
      </div>

      {cand ? (
        <StickyMobileCTA>
          <Link
            to="/adaptar-curriculo"
            search={{ vaga: `${vaga.titulo} (${fonteCurta(vaga)})` }}
            className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-black/10 bg-white text-foreground"
            aria-label="Montar currículo"
          >
            <ArrowRight className="size-5" aria-hidden />
          </Link>
          <a
            href={cand.href}
            target={cand.external ? "_blank" : undefined}
            rel={cand.external ? "noopener noreferrer" : undefined}
            data-analytics="cta-candidatura-mobile"
            className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-black ${primaryClasses}`}
          >
            <cand.icon className="size-4" aria-hidden />
            {cand.label}
          </a>
        </StickyMobileCTA>
      ) : null}
    </SiteLayout>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] uppercase tracking-wider text-slate-400">{label}</dt>
      <dd className="mt-0.5 truncate text-sm font-semibold">{value}</dd>
    </div>
  );
}