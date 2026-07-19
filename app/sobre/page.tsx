import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sobre | Vagas Manaus Hoje",
  description:
    "Conheça o objetivo do Vagas Manaus Hoje, uma central independente de divulgação de oportunidades de emprego em Manaus.",
};

export default function SobrePage() {
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
              Sobre o projeto
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
              Sobre o Vagas Manaus Hoje
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              O Vagas Manaus Hoje é uma central independente criada para reunir
              e organizar oportunidades de emprego divulgadas publicamente em
              Manaus.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">
              Nosso objetivo
            </h2>

            <p className="mt-4 leading-8 text-slate-700">
              O objetivo do site é facilitar o acesso a vagas de emprego em
              Manaus, ajudando candidatos a encontrarem oportunidades de forma
              mais organizada, clara e rápida.
            </p>

            <p className="mt-4 leading-8 text-slate-700">
              As vagas são apresentadas com informações como cargo, bairro,
              escolaridade, experiência, requisitos, benefícios e fonte da
              divulgação, sempre que esses dados estiverem disponíveis.
            </p>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">
              Como as vagas são divulgadas
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-3xl font-black text-blue-700">1</p>
                <h3 className="mt-3 font-black text-slate-950">
                  Coleta das informações
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  As oportunidades podem vir de fontes públicas, divulgações de
                  empresas, pessoas ou canais oficiais.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-3xl font-black text-blue-700">2</p>
                <h3 className="mt-3 font-black text-slate-950">
                  Organização dos dados
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  As informações são organizadas por categoria, local,
                  requisitos e forma de candidatura.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-3xl font-black text-blue-700">3</p>
                <h3 className="mt-3 font-black text-slate-950">
                  Publicação no site
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Após análise básica, a vaga pode ser publicada para facilitar
                  o acesso dos candidatos.
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">
              Compromisso com os candidatos
            </h2>

            <ul className="mt-6 space-y-3">
              <li className="flex gap-3 rounded-2xl bg-slate-50 p-4 text-slate-700">
                <span className="mt-1 h-2 w-2 rounded-full bg-blue-700" />
                <span>Organizar vagas de forma simples e acessível.</span>
              </li>

              <li className="flex gap-3 rounded-2xl bg-slate-50 p-4 text-slate-700">
                <span className="mt-1 h-2 w-2 rounded-full bg-blue-700" />
                <span>Informar a fonte da vaga sempre que possível.</span>
              </li>

              <li className="flex gap-3 rounded-2xl bg-slate-50 p-4 text-slate-700">
                <span className="mt-1 h-2 w-2 rounded-full bg-blue-700" />
                <span>Evitar divulgação de oportunidades suspeitas.</span>
              </li>

              <li className="flex gap-3 rounded-2xl bg-slate-50 p-4 text-slate-700">
                <span className="mt-1 h-2 w-2 rounded-full bg-blue-700" />
                <span>
                  Incentivar que o candidato sempre confirme a vaga na fonte
                  oficial.
                </span>
              </li>
            </ul>
          </article>

          <article className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
            <h2 className="text-xl font-black text-amber-900">
              Aviso de responsabilidade
            </h2>

            <p className="mt-3 leading-7 text-amber-900">
              O Vagas Manaus Hoje não é responsável pelos processos seletivos,
              contratações, entrevistas ou decisões das empresas anunciantes. O
              site atua como uma central independente de divulgação e
              organização de oportunidades.
            </p>
          </article>

          <article className="rounded-3xl border border-red-100 bg-red-50 p-6">
            <h2 className="text-xl font-black text-red-800">
              Segurança em primeiro lugar
            </h2>

            <p className="mt-3 leading-7 text-red-700">
              Nunca pague para participar de processo seletivo. Desconfie de
              promessas de contratação imediata, cobranças, links suspeitos ou
              pedidos de dados sensíveis sem confirmação da fonte oficial.
            </p>
          </article>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-xl font-black text-slate-950">
              Navegue pelo site
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Acesse as principais áreas do Vagas Manaus Hoje.
            </p>

            <div className="mt-6 space-y-3">
              <Link
                href="/vagas"
                className="flex w-full items-center justify-center rounded-xl bg-blue-700 px-5 py-4 text-sm font-black text-white shadow-sm transition hover:bg-blue-800"
              >
                Ver vagas disponíveis
              </Link>

              <Link
                href="/enviar-vaga"
                className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm font-black text-slate-800 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                Enviar uma vaga
              </Link>

              <Link
                href="/contato"
                className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm font-black text-slate-800 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                Entrar em contato
              </Link>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-black text-slate-900">
                Projeto local
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Criado com foco em oportunidades de emprego para Manaus e região.
              </p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}