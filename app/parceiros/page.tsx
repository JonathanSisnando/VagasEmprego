import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, Megaphone } from "lucide-react";
import { siteConfig } from "../../config/site";
import { parceiros } from "../../data/parceiros";
import { TrackedActionLink } from "../../components/TrackedActionLink";

export const metadata: Metadata = {
  title: "Parceiros | Vagas Manaus Hoje",
  description:
    "Grupos de WhatsApp e perfis de Instagram parceiros do Vagas Manaus Hoje, com troca de divulgação de vagas em Manaus.",
};

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export default function ParceirosPage() {
  const mensagem = encodeURIComponent(
    `Olá! Tenho um grupo de WhatsApp ou perfil de Instagram sobre vagas e gostaria de propor uma parceria de divulgação com o ${siteConfig.nome}.`
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
              Rede de divulgação
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
              Parceiros
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Grupos de WhatsApp e perfis de Instagram que divulgam vagas em
              Manaus em parceria com o {siteConfig.nome}. A gente troca
              divulgação: as vagas circulam nos dois canais e o alcance
              cresce para os dois lados.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">
              Canais parceiros
            </h2>

            {parceiros.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <p className="font-black text-slate-900">
                  Ainda não temos parceiros cadastrados.
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Seu grupo de WhatsApp ou perfil de Instagram pode ser o
                  primeiro. Fale com a gente pelo WhatsApp ao lado.
                </p>
              </div>
            ) : (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {parceiros.map((parceiro) => (
                  <a
                    key={parceiro.id}
                    href={parceiro.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50 hover:shadow-lg"
                  >
                    <span
                      className={`flex size-10 items-center justify-center rounded-xl text-white shadow-sm ${
                        parceiro.tipo === "whatsapp"
                          ? "bg-green-600"
                          : "bg-gradient-to-br from-fuchsia-600 to-amber-500"
                      }`}
                    >
                      {parceiro.tipo === "whatsapp" ? (
                        <MessageCircle className="size-5" aria-hidden="true" />
                      ) : (
                        <InstagramIcon className="size-5" />
                      )}
                    </span>

                    <h3 className="mt-3 font-black text-slate-950">
                      {parceiro.nome}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {parceiro.descricao}
                    </p>

                    <span className="mt-3 inline-block text-sm font-bold text-blue-700 group-hover:underline">
                      {parceiro.tipo === "whatsapp"
                        ? "Entrar no grupo →"
                        : "Seguir no Instagram →"}
                    </span>
                  </a>
                ))}
              </div>
            )}
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">
              Como funciona a parceria
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-3xl font-black text-blue-700">1</p>
                <h3 className="mt-3 font-black text-slate-950">
                  Você entra em contato
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Envie o link do seu grupo de WhatsApp ou perfil de
                  Instagram pelo botão ao lado.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-3xl font-black text-blue-700">2</p>
                <h3 className="mt-3 font-black text-slate-950">
                  Combinamos a troca
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Alinhamos como as vagas e a divulgação vão circular entre
                  os dois canais.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-3xl font-black text-blue-700">3</p>
                <h3 className="mt-3 font-black text-slate-950">
                  Divulgação mútua
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Seu canal aparece nesta página e nas nossas divulgações; o
                  Vagas Manaus Hoje aparece no seu.
                </p>
              </div>
            </div>
          </article>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <div className="flex items-center gap-2 text-blue-700">
              <Megaphone className="size-5" aria-hidden="true" />
              <p className="text-sm font-black uppercase tracking-wide">
                Seja parceiro
              </p>
            </div>

            <h2 className="mt-3 text-xl font-black text-slate-950">
              Divulgue seu grupo ou perfil aqui
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Manda o link do seu grupo de WhatsApp ou perfil de Instagram
              pelo botão abaixo e a gente combina a parceria.
            </p>

            <TrackedActionLink
              href={linkWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              evento="click_parceria_whatsapp"
              className="mt-6 flex w-full items-center justify-center rounded-xl bg-green-600 px-5 py-4 text-sm font-black text-white shadow-sm transition hover:bg-green-700"
            >
              Propor parceria pelo WhatsApp
            </TrackedActionLink>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-black text-slate-900">
                Sem custo
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                A parceria é uma troca de divulgação — sem cobrança para
                nenhum dos lados.
              </p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
