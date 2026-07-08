import { Search, Eye, Send, Clock } from "lucide-react";
import { ResumoVagasSineHome } from "../components/ResumoVagasSineHome";
import { FadeIn } from "../components/FadeIn";
import { CurriculoCta } from "../components/CurriculoCta";

export default function HomePage() {
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

            <div className="mt-4">
              <CurriculoCta variant="inline" />
            </div>
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

            <div className="mt-10 grid items-start gap-6 md:grid-cols-3">
              {passos.map((passo) => (
                <div
                  key={passo.numero}
                  className="group rounded-3xl border border-slate-200 bg-slate-50 p-5 text-center transition hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50 hover:shadow-lg"
                >
                  <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-blue-700 text-xl font-black text-white shadow-sm transition group-hover:scale-110">
                    {passo.numero}
                  </span>

                  <passo.icone className="mx-auto mt-3 size-5 text-blue-700" aria-hidden="true" />

                  <h3 className="mt-2 text-base font-black text-slate-950">
                    {passo.titulo}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {passo.descricao}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <FadeIn>
          <ResumoVagasSineHome />
        </FadeIn>
      </section>
    </main>
  );
}