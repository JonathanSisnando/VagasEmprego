import { Quote, Star } from "lucide-react";

const depoimentos = [
  {
    nome: "Ana C.",
    texto:
      "O site me ajudou muito! Consegui ver as vagas do Sine sem sair de casa e fui chamada para uma vaga de auxiliar administrativo.",
    estrelas: 5,
  },
  {
    nome: "Carlos M.",
    texto:
      "Usei o serviço de adaptação de currículo. Mudou completamente minha apresentação. Fui chamado para 3 entrevistas depois disso.",
    estrelas: 5,
  },
  {
    nome: "Juliana S.",
    texto:
      "Ótimo pra quem mora em Manaus! As vagas são atualizadas direto e ainda tem filtro por bairro, o que facilitou muito.",
    estrelas: 5,
  },
];

export function Testimonials() {
  return (
    <section className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="text-center">
          <p className="text-sm font-black uppercase tracking-wide text-blue-700">
            Depoimentos
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
            Quem usou, aprovou
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Veja o que candidatos estão falando sobre o Vagas Manaus Hoje.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {depoimentos.map((depoimento) => (
            <article
              key={depoimento.nome}
              className="flex flex-col rounded-3xl border border-slate-100 bg-slate-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <Quote className="size-8 text-blue-200" aria-hidden="true" />

              <p className="mt-3 flex-1 leading-7 text-slate-700">
                &ldquo;{depoimento.texto}&rdquo;
              </p>

              <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
                <span className="text-sm font-bold text-slate-900">
                  {depoimento.nome}
                </span>

                <span className="flex gap-0.5">
                  {Array.from({ length: depoimento.estrelas }).map((_, i) => (
                    <Star
                      key={i}
                      className="size-4 fill-amber-400 text-amber-400"
                      aria-hidden="true"
                    />
                  ))}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
