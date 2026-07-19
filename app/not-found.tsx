import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <section className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
            Erro 404
          </p>

          <h1 className="mt-3 text-3xl font-bold text-slate-900">
            Página não encontrada
          </h1>

          <p className="mt-4 text-slate-600">
            A página que você tentou acessar não existe, foi removida ou o link
            pode estar incorreto.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/vagas"
              className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              Ver vagas
            </Link>

            <Link
              href="/"
              className="rounded-xl border border-blue-700 px-5 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              Ir para início
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}