import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  CalendarDays,
  ExternalLink,
  GraduationCap,
  Hash,
  Mail,
  MapPin,
  MessageCircle,
  Timer,
  AlertTriangle,
  CalendarCheck,
} from "lucide-react";

import { AntiFraudNotice } from "@/components/site/AntiFraudNotice";
import { CurriculoCTA } from "@/components/site/CurriculoCTA";
import { SiteLayout } from "@/components/site/SiteLayout";
import { StickyMobileCTA } from "@/components/site/StickyMobileCTA";
import { fonteCurta, isFromSetemp, isFromSine, VagaBadges } from "@/components/site/VagaBadges";
import { findVagaBySlug, useVagasUnificadas } from "@/lib/vagas-hooks";
import type { Vaga } from "@/lib/vagas-types";
import { whatsappLink } from "@/lib/site-config";

export const Route = createFileRoute("/vagas/$slug")({
  component: VagaDetailPage,
});

function formatarData(data: string): string {
  const d = new Date(data);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function normalizar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

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
          <Link
            to="/vagas"
            className="mt-6 inline-block rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
          >
            Ver vagas de hoje
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const sine = isFromSine(vaga);
  const setemp = isFromSetemp(vaga);
  const cand = candidaturaFor(vaga);
  const primaryClasses =
    cand?.variant === "whatsapp"
      ? "bg-whatsapp text-whatsapp-foreground shadow-lg shadow-whatsapp/25"
      : "bg-primary text-primary-foreground shadow-lg shadow-primary/25";

  const semExperiencia = /não|nao|sem/i.test(vaga.experiencia);
  const quantidadeVagas = vaga.quantidadeVagas ?? 1;

  const employmentType =
    vaga.tipoContrato === "CLT"
      ? "FULL_TIME"
      : vaga.tipoContrato === "Estágio"
        ? "INTERN"
        : vaga.tipoContrato === "Temporário"
          ? "TEMPORARY"
          : vaga.tipoContrato === "Freelancer"
            ? "CONTRACTOR"
            : "FULL_TIME";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: vaga.titulo,
    description: vaga.descricao || `Vaga de ${vaga.titulo} em ${vaga.cidade}/${vaga.estado}.`,
    datePosted: vaga.dataPublicacao,
    employmentType,
    directApply: false,
    hiringOrganization: {
      "@type": "Organization",
      name: sine
        ? "Prefeitura de Manaus - Sine Manaus"
        : setemp
          ? "SETEMP / Portal do Trabalhador"
          : vaga.empresa,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: vaga.cidade,
        addressRegion: vaga.estado,
        addressCountry: "BR",
      },
    },
    ...(vaga.dataExpiracao && {
      validThrough: `${vaga.dataExpiracao}T23:59:59-04:00`,
    }),
    ...(vaga.quantidadeVagas && {
      totalJobOpenings: vaga.quantidadeVagas,
    }),
  };

  const requisitos = vaga.requisitos.filter((r) => !/^atividades?:?\s/i.test(r));
  const atividades = vaga.requisitos.filter((r) => /^atividades?:?\s/i.test(r));

  const horariosSine =
    "Os candidatos devem comparecer a um dos postos do Sine Manaus com documentos pessoais, currículo, comprovante de escolaridade e residência. Atendimento das 8h às 14h.";

  return (
    <SiteLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mx-auto max-w-5xl px-4 py-6">
        <Link to="/vagas" className="text-sm font-medium text-muted-foreground hover:text-primary">
          ← Voltar para vagas
        </Link>
      </div>

      <div className="mx-auto grid max-w-5xl gap-8 px-4 pb-40 md:grid-cols-[1fr_320px] md:pb-16">
        <article className="min-w-0">
          <div className="flex flex-wrap gap-2">
            {sine && (
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-black text-primary-foreground">
                Sine Manaus
              </span>
            )}
            {setemp && (
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-black text-primary-foreground">
                SETEMP
              </span>
            )}
            <VagaBadges vaga={vaga} />
            {semExperiencia && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                Sem experiência
              </span>
            )}
          </div>

          <h1 className="mt-3 text-2xl font-black leading-tight md:text-3xl">{vaga.titulo}</h1>
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            {sine ? "Prefeitura de Manaus - Sine Manaus" : setemp ? "SETEMP / Portal do Trabalhador" : vaga.empresa}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-4" aria-hidden />
            {vaga.bairro !== "Não informado" ? `${vaga.bairro} · ` : ""}
            {vaga.cidade}, {vaga.estado}
          </p>

          {sine && (
            <article className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <h2 className="text-base font-extrabold">Como se candidatar no Sine Manaus</h2>
              <p className="mt-2 text-sm leading-relaxed text-foreground/90">{horariosSine}</p>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                Os interessados devem estar munidos do comprovante de vacinação (Covid-19), currículo,
                certificados de cursos e documentos pessoais (RG, CPF, PIS, CTPS, comprovante de
                escolaridade e residência).
              </p>
            </article>
          )}

          {setemp && (
            <article className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <h2 className="text-base font-extrabold">Como se candidatar no SETEMP</h2>
              <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                Esta vaga foi divulgada pelo SETEMP, no Portal do Trabalhador do Governo do Amazonas.
                A candidatura é feita diretamente na página da vaga no portal.
              </p>
            </article>
          )}

          <div className="mt-6 rounded-2xl border border-black/5 bg-white p-5">
            <h2 className="text-base font-extrabold">Informações da vaga</h2>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
              <Info label="Local" value={vaga.bairro !== "Não informado" ? `${vaga.cidade}/${vaga.estado} — ${vaga.bairro}` : `${vaga.cidade}/${vaga.estado}`} />
              <Info label="Escolaridade" value={vaga.escolaridade} />
              <Info label="Experiência" value={vaga.experiencia} />
              <Info label="Salário" value={vaga.salario} />
              <Info label="Publicado em" value={formatarData(vaga.dataPublicacao)} />
              <Info label="Status" value={vaga.status} />
              {vaga.dataExpiracao && (
                <Info label="Disponível até" value={formatarData(vaga.dataExpiracao)} />
              )}
              {vaga.quantidadeVagas && (
                <Info label="Quantidade" value={`${vaga.quantidadeVagas} vaga${vaga.quantidadeVagas > 1 ? "s" : ""}`} />
              )}
              <Info label="Modalidade" value={vaga.modalidade ?? "—"} />
              <Info label="Tipo de contrato" value={vaga.tipoContrato ?? "—"} />
            </dl>
          </div>

          <section className="mt-6">
            <h2 className="text-base font-extrabold">Descrição</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground/90">
              {vaga.descricao ??
                `Oportunidade para ${vaga.titulo} em ${vaga.cidade}/${vaga.estado}. Confira os requisitos, benefícios e forma de candidatura antes de seguir para a fonte oficial.`}
            </p>
          </section>

          {requisitos.length > 0 && (
            <section className="mt-6">
              <h2 className="text-base font-extrabold">Requisitos</h2>
              <ul className="mt-2 space-y-1.5 text-sm">
                {requisitos.map((r) => {
                  const partes = r.split(";").map((s) => s.trim()).filter(Boolean);
                  return (
                    <li key={r} className="flex gap-2">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{partes.join("; ")}</span>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {atividades.length > 0 && (
            <section className="mt-6">
              <h2 className="text-base font-extrabold">Atividades</h2>
              <ul className="mt-2 space-y-1.5 text-sm">
                {atividades.map((item) => {
                  const texto = item.replace(/^atividades?:?\s*/i, "");
                  const itens = texto.split(";").map((s) => s.trim()).filter(Boolean);
                  return itens.map((atividade, i) => (
                    <li key={`${atividade}-${i}`} className="flex gap-2 rounded-xl bg-blue-50 p-2">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{atividade}</span>
                    </li>
                  ));
                })}
              </ul>
            </section>
          )}

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
          <div className="rounded-2xl border border-black/5 bg-white p-5">
            <h2 className="text-base font-extrabold">
              {sine ? "Cadastro presencial" : "Como se candidatar"}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {sine
                ? "Confira as instruções acima sobre postos, documentos e orientações para se candidatar presencialmente no Sine Manaus."
                : vaga.comoSeCandidatar}
            </p>

            <div className="mt-4 flex gap-3 rounded-xl border-l-4 border-alert bg-alert/10 px-4 py-3">
              <AlertTriangle className="mt-0.5 size-5 shrink-0 text-alert" aria-hidden />
              <p className="text-sm leading-relaxed text-alert/90">
                <strong className="font-black">Vagas são gratuitas.</strong> Nunca pague para se
                candidatar, fazer cadastro, treinamento ou garantir contratação.
              </p>
            </div>

            <div className="mt-4 space-y-3">
              {sine && vaga.linkFonte && (
                <a
                  href={vaga.linkFonte}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-black text-primary-foreground transition hover:bg-primary/90"
                >
                  Ver notícia oficial <ExternalLink className="size-4" />
                </a>
              )}

              {setemp && vaga.linkFonte && (
                <a
                  href={vaga.linkFonte}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-black text-primary-foreground transition hover:bg-primary/90"
                >
                  Candidatar-se no Portal do Trabalhador <ExternalLink className="size-4" />
                </a>
              )}

              {!sine && !setemp && vaga.whatsappCandidatura && (
                <a
                  href={cand?.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-whatsapp px-5 py-3 text-sm font-black text-whatsapp-foreground shadow-lg shadow-whatsapp/25"
                >
                  Candidatar pelo WhatsApp <MessageCircle className="size-4" />
                </a>
              )}

              {!sine && !setemp && vaga.emailCandidatura && (
                <a
                  href={`mailto:${vaga.emailCandidatura}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-black text-primary-foreground"
                >
                  Candidatar por e-mail <Mail className="size-4" />
                </a>
              )}

              {!sine && !setemp && !vaga.whatsappCandidatura && !vaga.emailCandidatura && vaga.linkFonte && (
                <a
                  href={vaga.linkFonte}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-black text-foreground transition hover:bg-slate-50"
                >
                  Ver fonte oficial <ExternalLink className="size-4" />
                </a>
              )}

              {!vaga.whatsappCandidatura && !vaga.emailCandidatura && !vaga.linkFonte && (
                <div className="rounded-xl border-2 border-warning bg-warning/10 p-4 text-sm font-semibold leading-relaxed text-warning">
                  A forma de candidatura não foi informada. Confira a fonte da vaga antes de enviar
                  seus dados.
                </div>
              )}
            </div>
          </div>

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
