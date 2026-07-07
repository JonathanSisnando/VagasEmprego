import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "../../config/site";

export const metadata: Metadata = {
  title: "Adaptar currículo | Vagas Manaus Hoje",
  description:
    "Envie a vaga de interesse e seu currículo atual para receber uma versão adaptada, destacando o que essa vaga pede.",
};

type AdaptarCurriculoPageProps = {
  searchParams: Promise<{ vaga?: string; fonte?: string }>;
};

export default async function AdaptarCurriculoPage({
  searchParams,
}: AdaptarCurriculoPageProps) {
  const { vaga, fonte } = await searchParams;

  const mensagem = vaga
    ? encodeURIComponent(
        `Olá! Quero adaptar meu currículo para: ${vaga}${
          fonte ? ` — ${fonte}` : ""
        }.
Meu currículo está em anexo.`
      )
    : encodeURIComponent(
        `Olá! Quero adaptar meu currículo no site ${siteConfig.nome}.

Vaga de interesse (link ou nome/empresa):
Meu currículo está em anexo.`
      );

  const linkWhatsApp = `https://wa.me/${siteConfig.whatsapp}?text=${mensagem}`;

  const informacoesNecessarias = [
    "Link ou nome da vaga de interesse",
    "Empresa e cidade da vaga, se souber",
    "Seu currículo atual (PDF ou Word)",
    "Áreas de experiência que quer destacar",
    "Alguma preferência de formatação, se tiver",
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <Link
            href="/"
            className="text-sm font-bold text-blue-700 hover:text-blue-800"
          >
            ← Voltar para início
          </Link>

          <div className="mt-8 max-w-3xl">
            <p className="text-sm font-black uppercase tracking-wide text-blue-700">
              Serviço extra
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
              Adaptar currículo
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Envie a vaga de interesse e seu currículo atual pelo WhatsApp.
              Devolvemos uma versão adaptada, destacando o que essa vaga
              específica pede.
            </p>

            <p className="mt-4 inline-flex w-fit items-center rounded-full bg-blue-50 px-4 py-2 text-sm font-black text-blue-700">
              {siteConfig.precoCurriculo} via Pix
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">
              Como funciona
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-3xl font-black text-blue-700">1</p>
                <h3 className="mt-3 font-black text-slate-950">
                  Envie a vaga e o currículo
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Mande o link da vaga (ou nome e empresa) e seu currículo
                  atual em PDF ou Word.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-3xl font-black text-blue-700">2</p>
                <h3 className="mt-3 font-black text-slate-950">
                  Adaptamos o conteúdo
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Destacamos as experiências e habilidades que mais combinam
                  com os requisitos daquela vaga.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-3xl font-black text-blue-700">3</p>
                <h3 className="mt-3 font-black text-slate-950">
                  Você recebe pronto
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  A versão adaptada volta pra você pelo mesmo WhatsApp, pronta
                  pra enviar na candidatura.
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">
              Informações necessárias
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              Para agilizar a adaptação, envie o máximo possível das
              informações abaixo.
            </p>

            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {informacoesNecessarias.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-700"
                >
                  <span className="mt-1 h-2 w-2 rounded-full bg-blue-700" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
            <h2 className="text-xl font-black text-amber-900">
              Aviso importante
            </h2>

            <p className="mt-3 leading-7 text-amber-900">
              O Vagas Manaus Hoje é uma central independente de divulgação.
              Adaptar o currículo não garante contratação nem vínculo com a
              empresa da vaga. Sempre confira a fonte oficial antes de enviar
              seus dados ou se candidatar.
            </p>
          </article>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-xl font-black text-slate-950">
              Enviar pelo WhatsApp
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Clique no botão abaixo para abrir o WhatsApp com uma mensagem
              pronta para preencher.
            </p>

            <p className="mt-4 text-sm font-black text-slate-900">
              Valor: {siteConfig.precoCurriculo}, pago via Pix
            </p>

            <a
              href={linkWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex w-full items-center justify-center rounded-xl bg-green-600 px-5 py-4 text-sm font-black text-white shadow-sm transition hover:bg-green-700"
            >
              Adaptar meu currículo pelo WhatsApp
            </a>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-black text-slate-900">
                Antes de enviar
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Tenha o currículo em mãos (PDF ou Word) e o link ou nome da
                vaga de interesse.
              </p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
