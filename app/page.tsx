import Link from "next/link";
import { Search, Eye, Send, Clock } from "lucide-react";
import { vagas } from "../data/vagas";
import { VagaCard } from "../components/VagaCard";
import { CurriculoCta } from "../components/CurriculoCta";
import { ResumoVagasSineHome } from "../components/ResumoVagasSineHome";
import { FadeIn } from "../components/FadeIn";
import { Testimonials } from "../components/Testimonials";

export default function HomePage() {
  const vagasDestaque = [...vagas].sort(
    (a, b) => (b.quantidadeVagas ?? 1) - (a.quantidadeVagas ?? 1)
  ).slice(0, 6);

  const dataAtual = new Date();
  const dataFormatada = new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(dataAtual);

  const passos = [
    {
      numero: 1,
      titulo: "Busque por categoria",
      descricao:
        "Filtre oportunidades por áreas como administrativo, produção, atendimento e outras categorias.",
      icone: Search,
    },
    {
      numero: 2,
      titulo: "Confira os detalhes",
      descricao:
        "Veja requisitos, bairro, escolaridade, fonte da vaga e forma de candidatura.",
      icone: Eye,
    },
    {
      numero: 3,
      titulo: "Candidate-se",
      descricao:
        "Siga as instruções da vaga — presencial no Sine, on-line no portal ou pelo contato informado.",
      icone: Send,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <FadeIn>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm font-black uppercase tracking-wide text-blue-700">
                Vagas em Manaus atualizadas
              </p>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                <Clock className="size-3" aria-hidden="true" />
                {dataFormatada}
              </span>
            </div>

            <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
              Encontre oportunidades de emprego em Manaus
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Uma central independente para divulgar vagas públicas em Manaus,
              reunindo oportunidades por categoria, bairro, escolaridade e
              requisitos.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/vagas"
                className="inline-flex items-center justify-center rounded-xl bg-blue-700 px-6 py-4 text-sm font-black text-white shadow-sm transition hover:bg-blue-800"
              >
                Ver vagas disponíveis
              </Link>

              <Link
                href="/enviar-vaga"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-4 text-sm font-black text-slate-800 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                Enviar uma vaga
              </Link>
            </div>

            <p className="mt-5 text-sm font-medium text-slate-500">
              Sempre confira a fonte oficial antes de enviar seus dados ou se
              candidatar.
            </p>
          </FadeIn>
        </div>
      </section>

      <FadeIn>
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <div className="text-center">
              <p className="text-sm font-black uppercase tracking-wide text-blue-700">
                Como funciona
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
                Encontre a vaga ideal em 3 passos
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">
                Reunimos oportunidades de fontes oficiais e divulgações para
                facilitar sua busca.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {passos.map((passo) => (
                <div
                  key={passo.numero}
                  className="group rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center transition hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50 hover:shadow-lg"
                >
                  <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-700 text-2xl font-black text-white shadow-sm transition group-hover:scale-110">
                    {passo.numero}
                  </span>

                  <passo.icone className="mx-auto mt-4 size-6 text-blue-700" aria-hidden="true" />

                  <h3 className="mt-3 text-lg font-black text-slate-950">
                    {passo.titulo}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {passo.descricao}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      <section className="mx-auto max-w-6xl px-4 pt-12">
        <FadeIn>
          <CurriculoCta />
        </FadeIn>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <FadeIn delay={100}>
          <ResumoVagasSineHome />
        </FadeIn>
      </section>

      <FadeIn delay={200}>
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6">
            <p className="text-sm font-black uppercase tracking-wide text-blue-700">
              Vagas cadastradas
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-950">
              Oportunidades cadastradas no sistema
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700">
              Estas vagas foram cadastradas manualmente na plataforma — não vêm
              do Sine Manaus. Veja algumas das mais recentes abaixo.
            </p>
          </div>

          <div className="mt-6 flex justify-end">
            <Link
              href="/vagas"
              className="inline-flex w-fit items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-800 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              Ver todas as vagas
            </Link>
          </div>

          <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {vagasDestaque.map((vaga) => (
              <FadeIn key={vaga.id}>
                <VagaCard vaga={vaga} />
              </FadeIn>
            ))}
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <Testimonials />
      </FadeIn>
    </main>
  );
}