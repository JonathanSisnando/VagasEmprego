import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "../../config/site";
import { TrackedActionLink } from "../../components/TrackedActionLink";

export const metadata: Metadata = {
  title: "Contato | Vagas Manaus Hoje",
  description:
    "Entre em contato com o Vagas Manaus Hoje para dúvidas, envio de vagas, correções ou solicitações.",
};

export default function ContatoPage() {

const mensagem = encodeURIComponent(
  `Olá! Vim pelo site ${siteConfig.nome} e gostaria de entrar em contato.`
);

const linkWhatsApp = `https://wa.me/${siteConfig.whatsapp}?text=${mensagem}`;
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
              Fale conosco
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
              Contato
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Entre em contato para enviar vagas, solicitar correções, avisar
              sobre oportunidades encerradas ou tirar dúvidas sobre o site.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">
              Como podemos ajudar?
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-5">
                <h3 className="font-black text-slate-950">
                  Enviar uma vaga
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Envie as informações da oportunidade para análise antes da
                  publicação.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <h3 className="font-black text-slate-950">
                  Corrigir uma informação
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Avise caso alguma vaga tenha informação incorreta,
                  incompleta ou desatualizada.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <h3 className="font-black text-slate-950">
                  Informar vaga encerrada
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Se uma oportunidade não estiver mais disponível, você pode
                  avisar para mantermos o site atualizado.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <h3 className="font-black text-slate-950">
                  Tirar dúvidas
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Fale conosco sobre funcionamento do site, divulgação ou
                  informações publicadas.
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">
              Links úteis
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Link
                href="/vagas"
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:bg-blue-50"
              >
                <h3 className="font-black text-slate-950">Ver vagas</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Acesse a lista de oportunidades disponíveis em Manaus.
                </p>
              </Link>

              <Link
                href="/enviar-vaga"
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:bg-blue-50"
              >
                <h3 className="font-black text-slate-950">Enviar vaga</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Veja quais informações enviar para divulgar uma oportunidade.
                </p>
              </Link>

              <Link
                href="/sobre"
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:bg-blue-50"
              >
                <h3 className="font-black text-slate-950">Sobre o site</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Entenda o objetivo do Vagas Manaus Hoje.
                </p>
              </Link>

              <Link
                href="/politica-de-privacidade"
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:bg-blue-50"
              >
                <h3 className="font-black text-slate-950">
                  Política de privacidade
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Veja informações sobre privacidade e uso do site.
                </p>
              </Link>
            </div>
          </article>

          <article className="rounded-3xl border border-red-100 bg-red-50 p-6">
            <h2 className="text-xl font-black text-red-800">
              Aviso de segurança
            </h2>

            <p className="mt-3 leading-7 text-red-700">
              O Vagas Manaus Hoje não cobra para candidaturas. Nunca envie
              dinheiro para participar de processo seletivo e desconfie de
              promessas de contratação imediata.
            </p>
          </article>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-xl font-black text-slate-950">
              Canais de contato
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Escolha uma das opções abaixo para falar com o Vagas Manaus Hoje.
            </p>

            <div className="mt-6 space-y-3">
              <TrackedActionLink
                href={linkWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                evento="click_contato_whatsapp"
                className="flex w-full items-center justify-center rounded-xl bg-green-600 px-5 py-4 text-sm font-black text-white shadow-sm transition hover:bg-green-700"
              >
                Falar pelo WhatsApp
              </TrackedActionLink>

              <TrackedActionLink
                href={`mailto:${siteConfig.email}`}
                evento="click_contato_email"
                className="flex w-full items-center justify-center rounded-xl bg-blue-700 px-5 py-4 text-sm font-black text-white shadow-sm transition hover:bg-blue-800"
              >
                Enviar e-mail
              </TrackedActionLink>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-black text-slate-900">
                E-mail de contato
              </p>

              <p className="mt-2 break-all text-sm leading-6 text-slate-600">
                {siteConfig.email}
              </p>
            </div>

            <div className="mt-4 rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-black text-slate-900">
                Melhor forma de envio
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Para vagas, prefira enviar texto completo, fonte oficial e forma
                de candidatura.
              </p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}