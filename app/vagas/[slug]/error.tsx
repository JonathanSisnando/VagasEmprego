"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function VagaDetalheError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <section className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <AlertTriangle className="size-6" aria-hidden="true" />
          </span>

          <h1 className="mt-4 text-2xl font-black text-slate-950">
            Não conseguimos carregar essa vaga agora
          </h1>

          <p className="mt-3 text-slate-600">
            A fonte oficial (Sine Manaus ou SETEMP) pode estar instável no
            momento. Tente novamente em instantes.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={reset}
              className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              Tentar de novo
            </button>

            <Link
              href="/vagas"
              className="rounded-xl border border-blue-700 px-5 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              Ver outras vagas
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
