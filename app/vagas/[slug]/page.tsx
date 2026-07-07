import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BadgeCheck,
  Banknote,
  CalendarCheck,
  CalendarDays,
  GraduationCap,
  Hash,
  MapPin,
  Timer,
  type LucideIcon,
} from "lucide-react";
import { vagas } from "../../../data/vagas";
import { CurriculoCta } from "../../../components/CurriculoCta";
import { normalizar } from "../../../lib/vaga-utils";
import {
  buscarNoticiaSineMaisRecente,
  extrairVagasDoPost,
} from "../../../lib/sine-manaus";
import { buscarVagasSetemp } from "../../../lib/setemp";

type VagaDetalhePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: VagaDetalhePageProps): Promise<Metadata> {
  const { slug } = await params;
  const vaga = await buscarVagaPorSlug(slug);

  if (!vaga) {
    return {
      title: "Vaga não encontrada | Vagas Manaus Hoje",
    };
  }

  return {
    title: `${vaga.titulo} em ${vaga.cidade} | Vagas Manaus Hoje`,
    description: `Veja detalhes da vaga de ${vaga.titulo} em ${vaga.cidade}/${vaga.estado}. Confira escolaridade, experiência, requisitos, fonte e forma de candidatura.`,
  };
}

export default async function VagaDetalhePage({
  params,
}: VagaDetalhePageProps) {
  const { slug } = await params;

  const vaga = await buscarVagaPorSlug(slug);

  if (!vaga) {
    notFound();
  }

  const ehVagaSine =
    String(vaga.id).startsWith("sine-") ||
    normalizar(vaga.fonte).includes("sine manaus");

  const ehVagaSetemp =
    String(vaga.id).startsWith("setemp-") ||
    normalizar(vaga.fonte).includes("setemp");

  const bairroInformado =
    vaga.bairro && normalizar(vaga.bairro) !== "nao informado";

  const quantidadeVagas = vaga.quantidadeVagas ?? 1;

  const semExperiencia =
    normalizar(vaga.experiencia).includes("nao e necessario") ||
    normalizar(vaga.experiencia).includes("sem experiencia") ||
    normalizar(vaga.experiencia).includes("nao exige") ||
    normalizar(vaga.experiencia).includes("nao necessita");

  const ensinoMedio = normalizar(vaga.escolaridade).includes("ensino medio");

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

  const descricaoVaga = `
    <p>${vaga.descricao ?? `Vaga de ${vaga.titulo} em ${vaga.cidade}/${vaga.estado}.`}</p>
    <p>Requisitos: ${vaga.requisitos.join(", ")}.</p>
    <p>Benefícios: ${vaga.beneficios.join(", ")}.</p>
    <p>Fonte: ${vaga.fonte}.</p>
  `;

  const camposExtrasJsonLd = {
    ...(vaga.dataExpiracao && {
      validThrough: `${vaga.dataExpiracao}T23:59:59-04:00`,
    }),
    ...(vaga.quantidadeVagas && {
      totalJobOpenings: vaga.quantidadeVagas,
    }),
    ...(vaga.modalidade === "Remoto" && {
      jobLocationType: "TELECOMMUTE",
      applicantLocationRequirements: {
        "@type": "Country",
        name: "Brazil",
      },
    }),
  };

  const jobPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: vaga.titulo,
    description: descricaoVaga,
    datePosted: vaga.dataPublicacao,
    employmentType,
    directApply: false,
    hiringOrganization: {
      "@type": "Organization",
      name: ehVagaSine
        ? "Prefeitura de Manaus - Sine Manaus"
        : ehVagaSetemp
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
    ...camposExtrasJsonLd,
  };

  const temLinkFonte = vaga.linkFonte && vaga.linkFonte !== "#";
  const temEmail = vaga.emailCandidatura && vaga.emailCandidatura.trim() !== "";
  const temWhatsapp =
    vaga.whatsappCandidatura && vaga.whatsappCandidatura.trim() !== "";

  const mensagemWhatsapp = encodeURIComponent(
    `Olá! Vi a vaga de ${vaga.titulo} no site Vagas Manaus Hoje e gostaria de saber como me candidatar.`
  );

  const linkWhatsapp = temWhatsapp
    ? `https://wa.me/${vaga.whatsappCandidatura}?text=${mensagemWhatsapp}`
    : "";

  return (
    <main className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jobPostingJsonLd),
        }}
      />

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_360px]">
        <div>
          <Link
            href="/vagas"
            className="inline-flex items-center text-sm font-bold text-blue-700 hover:text-blue-800"
          >
            ← Voltar para vagas
          </Link>

          <div className="mt-8 max-w-3xl">
            <div className="flex flex-wrap gap-2">
              {ehVagaSine && (
                <span className="rounded-full bg-blue-700 px-3 py-1 text-xs font-black text-white">
                  Sine Manaus
                </span>
              )}

              {ehVagaSetemp && (
                <span className="rounded-full bg-blue-700 px-3 py-1 text-xs font-black text-white">
                  SETEMP
                </span>
              )}

              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                {vaga.categoria}
              </span>

              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                {quantidadeVagas} vaga{quantidadeVagas > 1 ? "s" : ""}
              </span>

              {vaga.modalidade && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                  {vaga.modalidade}
                </span>
              )}

              {vaga.tipoContrato && vaga.tipoContrato !== "Não informado" && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                  {vaga.tipoContrato}
                </span>
              )}

              {vaga.pcd && (
                <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-black text-purple-700">
                  PCD
                </span>
              )}

              {semExperiencia && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                  Sem experiência
                </span>
              )}

              {ensinoMedio && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                  Ensino médio
                </span>
              )}
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
              {vaga.titulo}
            </h1>

            <p className="mt-4 text-lg font-medium text-slate-600">
              {ehVagaSine
                ? "Prefeitura de Manaus - Sine Manaus"
                : ehVagaSetemp
                  ? "SETEMP / Portal do Trabalhador"
                  : vaga.empresa}
            </p>
          </div>

          <div className="mt-10 space-y-6 border-t border-slate-200 pt-10">
          {ehVagaSine && (
            <article className="rounded-3xl border border-blue-100 bg-blue-50 p-6 shadow-sm">
              <h2 className="text-2xl font-black text-slate-950">
                Como se candidatar
              </h2>

              <p className="mt-4 leading-8 text-slate-700">
                Esta vaga foi divulgada pela Prefeitura de Manaus/Sine Manaus. O
                cadastro deve ser feito presencialmente no Sine Manaus, conforme
                orientações da notícia oficial. Antes de ir, confira
                escolaridade, experiência, requisitos e prazo de disponibilidade.
              </p>

              {temLinkFonte && (
                <a
                  href={vaga.linkFonte}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center justify-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-800"
                >
                  Ver notícia oficial
                </a>
              )}
            </article>
          )}

          {ehVagaSetemp && (
            <article className="rounded-3xl border border-blue-100 bg-blue-50 p-6 shadow-sm">
              <h2 className="text-2xl font-black text-slate-950">
                Como se candidatar
              </h2>

              <p className="mt-4 leading-8 text-slate-700">
                Esta vaga foi divulgada pelo SETEMP, no Portal do Trabalhador
                do Governo do Amazonas. A candidatura é feita diretamente na
                página da vaga no portal.
              </p>

              {temLinkFonte && (
                <a
                  href={vaga.linkFonte}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center justify-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-800"
                >
                  Ver vaga no Portal do Trabalhador
                </a>
              )}
            </article>
          )}

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">
              Informações da vaga
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <InfoCard
                titulo="Local"
                icon={MapPin}
                valor={
                  bairroInformado
                    ? `${vaga.cidade}/${vaga.estado} — ${vaga.bairro}`
                    : `${vaga.cidade}/${vaga.estado}`
                }
              />

              <InfoCard titulo="Escolaridade" icon={GraduationCap} valor={vaga.escolaridade} />

              <InfoCard titulo="Experiência" icon={Timer} valor={vaga.experiencia} />

              <InfoCard titulo="Salário" icon={Banknote} valor={vaga.salario} />

              <InfoCard titulo="Publicado em" icon={CalendarDays} valor={vaga.dataPublicacao} />

              <InfoCard titulo="Status" icon={BadgeCheck} valor={vaga.status} />

              {vaga.dataExpiracao && (
                <InfoCard titulo="Disponível até" icon={CalendarCheck} valor={vaga.dataExpiracao} />
              )}

              {vaga.quantidadeVagas && (
                <InfoCard
                  titulo="Quantidade"
                  icon={Hash}
                  valor={`${vaga.quantidadeVagas} vaga${
                    vaga.quantidadeVagas > 1 ? "s" : ""
                  }`}
                />
              )}
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">Descrição</h2>

            <p className="mt-4 leading-8 text-slate-700">
              {vaga.descricao ??
                `Oportunidade para ${vaga.titulo} em ${vaga.cidade}/${vaga.estado}. Confira os requisitos, benefícios e forma de candidatura antes de seguir para a fonte oficial.`}
            </p>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">Requisitos</h2>

            <ul className="mt-5 space-y-3">
              {vaga.requisitos.map((requisito) => (
                <li
                  key={requisito}
                  className="flex gap-3 rounded-2xl bg-slate-50 p-4 text-slate-700"
                >
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-700" />
                  <span>{requisito}</span>
                </li>
              ))}
            </ul>
          </article>

          {vaga.beneficios.length > 0 && (
            <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black text-slate-950">
                Benefícios
              </h2>

              <ul className="mt-5 space-y-3">
                {vaga.beneficios.map((beneficio) => (
                  <li
                    key={beneficio}
                    className="flex gap-3 rounded-2xl bg-slate-50 p-4 text-slate-700"
                  >
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-600" />
                    <span>{beneficio}</span>
                  </li>
                ))}
              </ul>
            </article>
          )}
          </div>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">
              {ehVagaSine ? "Cadastro presencial" : "Como se candidatar"}
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              {ehVagaSine
                ? "Esta vaga não recebe candidatura pelo site. O cadastro deve ser feito presencialmente no Sine Manaus, seguindo as orientações da notícia oficial da Prefeitura de Manaus."
                : vaga.comoSeCandidatar}
            </p>

            <div className="mt-6 space-y-3">
              {ehVagaSine && temLinkFonte && (
                <a
                  href={vaga.linkFonte}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-800"
                >
                  Ver notícia oficial
                </a>
              )}

              {ehVagaSetemp && temLinkFonte && (
                <a
                  href={vaga.linkFonte}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-800"
                >
                  Candidatar-se no Portal do Trabalhador
                </a>
              )}

              {!ehVagaSine && !ehVagaSetemp && temWhatsapp && (
                <a
                  href={linkWhatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center rounded-xl bg-green-600 px-5 py-3 text-sm font-black text-white transition hover:bg-green-700"
                >
                  Candidatar pelo WhatsApp
                </a>
              )}

              {!ehVagaSine && !ehVagaSetemp && temEmail && (
                <a
                  href={`mailto:${vaga.emailCandidatura}`}
                  className="flex w-full items-center justify-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-800"
                >
                  Candidatar por e-mail
                </a>
              )}

              {!ehVagaSine && !ehVagaSetemp && temLinkFonte && (
                <a
                  href={vaga.linkFonte}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-800 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  Ver fonte oficial
                </a>
              )}

              {!temWhatsapp && !temEmail && !temLinkFonte && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-900">
                  A forma de candidatura não foi informada. Confira a fonte da
                  vaga antes de enviar seus dados.
                </div>
              )}
            </div>

            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-black text-amber-900">
                Aviso importante
              </p>

              <p className="mt-2 text-sm leading-6 text-amber-900">
                As vagas são gratuitas. Nunca pague para se candidatar, fazer
                cadastro, treinamento ou garantir contratação. Confirme sempre
                as orientações na notícia oficial.
              </p>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-5 text-sm text-slate-600">
              <p>
                <span className="font-black text-slate-900">Fonte:</span>{" "}
                {vaga.fonte}
              </p>

              {vaga.quantidadeVagas && (
                <p className="mt-2">
                  <span className="font-black text-slate-900">
                    Quantidade:
                  </span>{" "}
                  {vaga.quantidadeVagas} vaga
                  {vaga.quantidadeVagas > 1 ? "s" : ""}
                </p>
              )}

              {vaga.dataExpiracao && (
                <p className="mt-2">
                  <span className="font-black text-slate-900">
                    Disponível até:
                  </span>{" "}
                  {vaga.dataExpiracao}
                </p>
              )}
            </div>
          </div>

          <CurriculoCta variant="sidebar" vaga={vaga.titulo} fonte={vaga.fonte} />
        </aside>
      </section>
    </main>
  );
}

function InfoCard({
  titulo,
  valor,
  icon: Icon,
}: {
  titulo: string;
  valor: string;
  icon: LucideIcon;
}) {
  return (
    <div className="flex gap-3 rounded-2xl bg-slate-50 p-4">
      <Icon className="mt-0.5 size-4 shrink-0 text-slate-400" aria-hidden="true" />
      <div>
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">
          {titulo}
        </p>

        <p className="mt-1 font-bold text-slate-900">{valor}</p>
      </div>
    </div>
  );
}

async function buscarVagaPorSlug(slug: string) {
  const vagaLocal = vagas.find((vaga) => vaga.slug === slug);

  if (vagaLocal) {
    return vagaLocal;
  }

  const postSine = await buscarNoticiaSineMaisRecente();

  if (postSine) {
    const vagasSine = extrairVagasDoPost(postSine);
    const vagaSine = vagasSine.find((vaga) => vaga.slug === slug);

    if (vagaSine) {
      return vagaSine;
    }
  }

  const vagasSetemp = await buscarVagasSetemp();

  return vagasSetemp.find((vaga) => vaga.slug === slug) ?? null;
}

