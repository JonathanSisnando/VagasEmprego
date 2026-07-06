import Link from "next/link";
import { vagas } from "../data/vagas";
import { VagaCard } from "../components/VagaCard";

export default function HomePage() {
  const ultimasVagas = vagas.slice(0, 3);

  const totalVagas = vagas.length;

  const totalCategorias = new Set(vagas.map((vaga) => vaga.categoria)).size;

  const totalVagasPcd = vagas.filter((vaga) => vaga.pcd).length;

  const totalPresenciais = vagas.filter(
    (vaga) => vaga.modalidade === "Presencial"
  ).length;

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-blue-700">
              Vagas em Manaus atualizadas
            </p>

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
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm font-bold text-slate-500">
                Resumo da plataforma
              </p>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-3xl font-black text-blue-700">
                    {totalVagas}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-600">
                    Vagas ativas
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-3xl font-black text-blue-700">
                    {totalCategorias}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-600">
                    Categorias
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-3xl font-black text-blue-700">
                    {totalPresenciais}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-600">
                    Presenciais
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-3xl font-black text-blue-700">
                    {totalVagasPcd}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-600">
                    Vagas PCD
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <p className="text-sm font-black text-blue-800">
                Dica para candidatos
              </p>
              <p className="mt-2 text-sm leading-6 text-blue-900">
                Nunca pague para participar de processo seletivo. Desconfie de
                promessas de contratação imediata e sempre confirme a origem da
                vaga.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-blue-700">
              Últimas oportunidades
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              Vagas em destaque
            </h2>

            <p className="mt-3 max-w-2xl text-slate-600">
              Veja algumas das vagas mais recentes cadastradas na plataforma.
            </p>
          </div>

          <Link
            href="/vagas"
            className="inline-flex w-fit items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-800 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            Ver todas as vagas
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ultimasVagas.map((vaga) => (
            <VagaCard key={vaga.id} vaga={vaga} />
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-lg font-black text-slate-950">
              Busque por categoria
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Filtre oportunidades por áreas como administrativo, produção,
              atendimento e outras categorias.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-lg font-black text-slate-950">
              Confira os detalhes
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Veja requisitos, bairro, escolaridade, fonte da vaga e forma de
              candidatura.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-lg font-black text-slate-950">
              Envie oportunidades
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Empresas e pessoas podem sugerir vagas para ajudar mais candidatos
              em Manaus.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}